// db.ts — port of db.go. Opens the SQLite database (DATABASE_URL overrides the
// default file), applies the same pragmas, and runs migrations on first open.
//
// better-sqlite3 is synchronous and single-connection by nature, which matches
// the Go app's SetMaxOpenConns(1): SQLite is single-writer. A module-level
// singleton (cached on globalThis so Next's dev HMR reuses it) keeps one
// connection per process — the same assumption the in-memory rate limiter and
// the single-machine Fly deploy rely on.
import Database from 'better-sqlite3'
import { runMigrations } from './migrate'

const DEFAULT_DSN = 'woodchuckers.db'

function open(): Database.Database {
  const dsn = process.env.DATABASE_URL || DEFAULT_DSN
  const db = new Database(dsn)
  // WAL for concurrent reads, enforce FKs, wait out brief write locks.
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.pragma('busy_timeout = 5000')
  runMigrations(db)
  return db
}

const globalForDb = globalThis as unknown as { __wcDb?: Database.Database }

export const db: Database.Database = globalForDb.__wcDb ?? (globalForDb.__wcDb = open())
