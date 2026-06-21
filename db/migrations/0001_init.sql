-- 0001_init.sql — core schema for woodchuckers employee app (SQLite)
-- apply: sqlite3 woodchuckers.db < db/migrations/0001_init.sql
-- timestamps are Unix epoch seconds (INTEGER); booleans are 0/1 (INTEGER).

PRAGMA foreign_keys = ON;

BEGIN;

-- employees: login accounts + profile. role gates admin features.
CREATE TABLE employees (
    id            INTEGER PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,                 -- bcrypt
    full_name     TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'employee'
                  CHECK (role IN ('employee', 'admin')),
    active        INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    created_at    INTEGER NOT NULL DEFAULT (unixepoch())
);

-- sessions: server-side session tokens (cookie holds the token).
CREATE TABLE sessions (
    token       TEXT PRIMARY KEY,                -- random opaque id
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    expires_at  INTEGER NOT NULL,                -- unix seconds
    created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_sessions_employee ON sessions(employee_id);

-- shifts: scheduled work blocks an admin assigns to an employee.
CREATE TABLE shifts (
    id          INTEGER PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    starts_at   INTEGER NOT NULL,                -- unix seconds
    ends_at     INTEGER NOT NULL,
    position    TEXT,                            -- role/station for the shift
    notes       TEXT,
    created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
    CHECK (ends_at > starts_at)
);
CREATE INDEX idx_shifts_employee ON shifts(employee_id);
CREATE INDEX idx_shifts_starts_at ON shifts(starts_at);

-- time_entries: actual clock in/out. clock_out NULL = still on the clock.
CREATE TABLE time_entries (
    id          INTEGER PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    shift_id    INTEGER REFERENCES shifts(id) ON DELETE SET NULL, -- optional link
    clock_in    INTEGER NOT NULL DEFAULT (unixepoch()),
    clock_out   INTEGER,
    created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
    CHECK (clock_out IS NULL OR clock_out > clock_in)
);
CREATE INDEX idx_time_entries_employee ON time_entries(employee_id);

COMMIT;
