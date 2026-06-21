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

  for (const f of files) {
    if (applied.has(f)) continue
    const sql = readFileSync(path.join(MIGRATIONS_DIR, f), 'utf8')
    // Each migration file carries its own BEGIN/COMMIT (like the Go version),
    // so exec it directly, then record it as applied.
    db.exec(sql)
    record.run(f)
  }
}

function tableExists(db: DatabaseType.Database, name: string): boolean {
  const row = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`)
    .get(name)
  return row !== undefined
}
