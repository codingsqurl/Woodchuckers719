// smoke.ts — non-browser verification against the dev DB snapshot. Exercises
// the DB layer, bcrypt compatibility, the estimate snapshot, and the pure
// helpers. Cleans up any rows it creates. Exits non-zero on any failure.
import './load-env'
import { db } from '../lib/db'
import {
  createEmployee,
  employeeByEmail,
  checkPassword,
  listEmployees,
} from '../lib/employees'
import { createEstimate, listEstimates, summarizeTrees, atoiClamp } from '../lib/estimates'

let failures = 0
function check(name: string, cond: boolean, extra = '') {
  const tag = cond ? 'PASS' : 'FAIL'
  if (!cond) failures++
  console.log(`  [${tag}] ${name}${extra ? ' — ' + extra : ''}`)
}

console.log(`DB: ${process.env.DATABASE_URL ?? 'woodchuckers.db'}`)

// 1) Existing data is intact (migrations baselined, nothing re-run/lost).
const employees = listEmployees()
check('existing employees present (baseline left data intact)', employees.length >= 3, `count=${employees.length}`)

const owner = employeeByEmail('owner@woodchuckers.test')
check('existing password account loads', !!owner && owner.passwordHash.startsWith('$2'), owner ? owner.passwordHash.slice(0, 4) : 'missing')

// 2) bcrypt: the real Go-generated $2a$ hash is parseable by bcryptjs (a wrong
//    password rejects without throwing — proving format compatibility).
if (owner) {
  check('Go $2a$ hash verifies via bcryptjs (wrong pw rejects, no throw)', checkPassword(owner, 'definitely-not-it') === false)
}

// 3) Blank-hash SSO-only accounts can never log in with a password.
const ssoOnly = employees.find((e) => e.passwordHash === '')
check('SSO-only (blank hash) account rejects password login', !!ssoOnly && checkPassword(ssoOnly, 'anything') === false)

// 4) Full bcrypt round-trip on a fresh account, then clean up.
const probeEmail = `smoke-${Date.now()}@example.test`
const probe = createEmployee(probeEmail, 'Smoke Probe', 'employee', 'password123')
check('new hash has bcrypt shape ($2, len 60)', probe.passwordHash.startsWith('$2') && probe.passwordHash.length === 60)
const probeLoaded = employeeByEmail(probeEmail)
check('fresh account logs in with correct password', !!probeLoaded && checkPassword(probeLoaded, 'password123') === true)
check('fresh account rejects wrong password', !!probeLoaded && checkPassword(probeLoaded, 'nope') === false)
db.prepare('DELETE FROM employees WHERE email = ?').run(probeEmail)

// 5) summarizeTrees zips the parallel arrays exactly like the Go version.
const sum = summarizeTrees({
  service: ['remove', 'remove', 'trim'],
  species: ['Oak', '', 'Aspen'],
  height: ['60+ ft', '', ''],
  condition: ['Dead/hazard', '', ''],
  near: ['', '', ''],
  drop: ['', '', ''],
})
check('summarizeTrees service summary', sum.service === '3 trees (2 Remove, 1 Trim)', sum.service)
check(
  'summarizeTrees detail breakdown',
  sum.detail === 'Tree 1: Remove, Oak, 60+ ft, Dead/hazard | Tree 2: Remove | Tree 3: Trim, Aspen',
  sum.detail,
)

// 6) atoiClamp never trusts the client.
check('atoiClamp clamps high', atoiClamp('999999999', 0, 1_000_000) === 1_000_000)
check('atoiClamp clamps days low/garbage', atoiClamp('x', 1, 2) === 1 && atoiClamp('5', 1, 2) === 2)

// 7) Estimate snapshot round-trips (insert → read back), then clean up.
const beforeMax = (db.prepare('SELECT COALESCE(MAX(id),0) AS m FROM estimates').get() as { m: number }).m
const id = createEstimate({
  name: 'Smoke Customer',
  email: 'smoke@example.test',
  phone: '7195551234',
  address: '1 Pine St',
  service: sum.service,
  details: 'two dead pines',
  source: 'google',
  removalInfo: sum.detail,
  estDays: 2,
  cleanup: false,
  debrisRemoval: true,
  estLow: 2 * 175 + 150,
  estHigh: 2 * 350 + 150,
})
const got = listEstimates(1)[0]
check('estimate inserted + newest-first', !!got && got.id === id && id > beforeMax)
check('snapshot low/high saved exactly', !!got && got.estLow === 500 && got.estHigh === 850, got ? `${got.estLow}/${got.estHigh}` : '')
check('debris flags saved (debrisRemoval set, cleanup clear)', !!got && got.debrisRemoval === true && got.cleanup === false)
check('removal_info persisted', !!got && got.removalInfo === sum.detail)
db.prepare('DELETE FROM estimates WHERE id = ?').run(id)

console.log(failures === 0 ? '\nALL SMOKE CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
