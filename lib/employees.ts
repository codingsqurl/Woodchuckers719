// employees.ts — port of the Employee half of store.go. Raw prepared
// statements, no ORM. bcrypt via bcryptjs (wire-compatible with Go's
// golang.org/x/crypto/bcrypt $2a$ hashes; existing hashes verify unchanged).
import bcrypt from 'bcryptjs'
import { db } from './db'
import { formatStamp } from './format'

// DefaultCost in Go's bcrypt is 10 — match it so new hashes look the same.
const BCRYPT_COST = 10

export type Employee = {
  id: number
  email: string
  passwordHash: string
  fullName: string
  role: string // "employee" | "admin"
  active: boolean
  lastLoginAt: number | null // unix seconds; null = never signed in
  lastLoginVia: string | null // "password" | "google" | "github"
}

type EmployeeRow = {
  id: number
  email: string
  password_hash: string
  full_name: string
  role: string
  active: number
  last_login_at: number | null
  last_login_via: string | null
}

function mapEmployee(r: EmployeeRow): Employee {
  return {
    id: r.id,
    email: r.email,
    passwordHash: r.password_hash,
    fullName: r.full_name,
    role: r.role,
    active: r.active === 1,
    lastLoginAt: r.last_login_at ?? null,
    lastLoginVia: r.last_login_via ?? null,
  }
}

export function isAdmin(e: Employee): boolean {
  return e.role === 'admin'
}

// lastLogin renders the last sign-in for the admin view, e.g.
// "Jan 2, 3:04 PM (google)" or "Never".
export function lastLogin(e: Employee): string {
  if (!e.lastLoginAt) return 'Never'
  let out = formatStamp(e.lastLoginAt)
  if (e.lastLoginVia) out += ` (${e.lastLoginVia})`
  return out
}

// createEmployee inserts a new account. An empty password creates an SSO-only
// account: the stored hash is blank and password login can never succeed for it.
export function createEmployee(
  email: string,
  fullName: string,
  role: string,
  password: string,
): Employee {
  const hash = password !== '' ? bcrypt.hashSync(password, BCRYPT_COST) : ''
  const info = db
    .prepare(
      `INSERT INTO employees (email, password_hash, full_name, role)
       VALUES (?, ?, ?, ?)`,
    )
    .run(email, hash, fullName, role)
  return {
    id: Number(info.lastInsertRowid),
    email,
    passwordHash: hash,
    fullName,
    role,
    active: true,
    lastLoginAt: null,
    lastLoginVia: null,
  }
}

// employeeByEmail looks up an active account for login.
export function employeeByEmail(email: string): Employee | null {
  const row = db
    .prepare(
      `SELECT id, email, password_hash, full_name, role, active, last_login_at, last_login_via
       FROM employees WHERE email = ? AND active = 1`,
    )
    .get(email) as EmployeeRow | undefined
  return row ? mapEmployee(row) : null
}

// employeeByID loads an active account by id (used when resolving a session).
export function employeeByID(id: number): Employee | null {
  const row = db
    .prepare(
      `SELECT id, email, password_hash, full_name, role, active, last_login_at, last_login_via
       FROM employees WHERE id = ? AND active = 1`,
    )
    .get(id) as EmployeeRow | undefined
  return row ? mapEmployee(row) : null
}

// listEmployees returns all accounts (active and inactive) for the admin view.
export function listEmployees(): Employee[] {
  const rows = db
    .prepare(
      `SELECT id, email, password_hash, full_name, role, active, last_login_at, last_login_via
       FROM employees ORDER BY active DESC, full_name`,
    )
    .all() as EmployeeRow[]
  return rows.map(mapEmployee)
}

// checkPassword reports whether the plaintext matches the stored hash. A blank
// hash (SSO-only account) always rejects rather than throwing.
export function checkPassword(e: Employee, plain: string): boolean {
  if (!e.passwordHash) return false
  try {
    return bcrypt.compareSync(plain, e.passwordHash)
  } catch {
    return false
  }
}

// touchLogin stamps an employee's last sign-in time and method. Best-effort:
// a failure here must not block the login itself.
export function touchLogin(id: number, via: string): void {
  try {
    db.prepare(`UPDATE employees SET last_login_at = ?, last_login_via = ? WHERE id = ?`).run(
      Math.floor(Date.now() / 1000),
      via,
      id,
    )
  } catch (err) {
    console.error(`touchLogin id=${id}:`, err)
  }
}

// setEmployeeActive enables or disables an account (soft delete).
export function setEmployeeActive(id: number, active: boolean): void {
  db.prepare(`UPDATE employees SET active = ? WHERE id = ?`).run(active ? 1 : 0, id)
}

// isDuplicateEmail reports whether err is a UNIQUE violation on employees.email.
export function isDuplicateEmail(err: unknown): boolean {
  return err instanceof Error && err.message.includes('UNIQUE')
}
