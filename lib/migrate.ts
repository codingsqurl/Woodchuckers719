// migrate.ts — port of migrate.go. Applies pending db/migrations/*.sql in
// sorted order, tracked in schema_migrations so each runs at most once, and
// BASELINES a pre-existing database (tables present, no tracking rows) by
// recording the files as applied without re-running them. This is what lets:
//   1. the live, already-migrated DB stay untouched, and
//   2. a fresh Fly volume build its own schema on first boot.
import type DatabaseType from 'better-sqlite3'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const MIGRATIONS_DIR = path.join(process.cwd(), 'db', 'migrations')

export function runMigrations(db: DatabaseType.Database): void {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version    TEXT PRIMARY KEY,
    applied_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`)

  const applied = new Set<string>(
    (db.prepare('SELECT version FROM schema_migrations').all() as { version: string }[]).map(
      (r) => r.version,
    ),
  )

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort() // 0001_, 0002_, ... apply in order

  const record = db.prepare('INSERT INTO schema_migrations (version) VALUES (?)')

  // Baseline a pre-tracking database so we don't re-run its CREATE TABLE SQL.
  if (applied.size === 0 && tableExists(db, 'employees')) {
    const baseline = db.transaction(() => {
      for (const f of files) record.run(f)
    })
    baseline()
    return
  }

  // Apply each pending migration and record it as applied inside ONE
  // transaction. The files carry their own BEGIN/COMMIT (like the Go version);
  // we strip that outer wrapper so the statements and the schema_migrations row
  // commit atomically. Otherwise a crash between exec and record leaves the
  // migration applied but untracked, and the next boot re-runs non-idempotent
  // SQL (ALTER/CREATE) which throws at module load and 500s every request.
  const applyOne = db.transaction((sql: string, version: string) => {
    db.exec(sql)
    record.run(version)
  })

  for (const f of files) {
    if (applied.has(f)) continue
    const raw = readFileSync(path.join(MIGRATIONS_DIR, f), 'utf8')
    applyOne(stripOuterTx(raw), f)
  }
}

// stripOuterTx removes a migration file's own leading BEGIN; and trailing
// COMMIT; so the statements can run inside our own transaction (SQLite rejects a
// nested BEGIN). Only the transaction-control tokens match — a trigger body's
// BEGIN is followed by statements, not a semicolon, and closes with END;. A file
// without an explicit transaction is returned unchanged.
function stripOuterTx(sql: string): string {
  return sql.replace(/\bBEGIN(\s+TRANSACTION)?\s*;/i, '').replace(/\bCOMMIT\s*;\s*$/i, '')
}

function tableExists(db: DatabaseType.Database, name: string): boolean {
  const row = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`)
    .get(name)
  return row !== undefined
}
