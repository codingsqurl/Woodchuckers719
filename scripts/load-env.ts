// Minimal .env loader for standalone scripts (tsx doesn't auto-load env files
// the way `next` does). Mirrors env.go loadDotEnv: a real environment variable
// always wins. Import this FIRST, before anything that opens the DB.
import { existsSync, readFileSync } from 'node:fs'

function load(path: string): void {
  if (!existsSync(path)) return
  for (const raw of readFileSync(path, 'utf8').split('\n')) {
    const line = raw.trim()
    if (line === '' || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !(key in process.env)) process.env[key] = val
  }
}

load('.env.local')
load('.env')
