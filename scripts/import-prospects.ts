// import-prospects — bulk-load the outbound prospect list from a scrape/export
// into the DB, deduping on normalized phone. This is the backbone of the
// outreach play: turn "a list from anywhere" (CDA applicator export, a Google
// Places pull, the ISA directory, a hand-built CSV) into call-ready rows without
// duplicates.
//
//   npm run import:prospects <file.csv | file.ndjson | file.json> [--source cda] [--dry]
//
// Accepted columns (case-insensitive headers / JSON keys): company (required),
// phone, email, website, town, source, license, notes. --source sets a default
// source for rows that don't carry one. --dry parses and reports without writing.
//
// NOTE ON DATA SOURCES: only persist fields you're allowed to store. The Google
// Places API ToS forbids retaining its name/phone/address beyond a short window —
// use it to DISCOVER companies, then enrich from the company's own site or a
// storable public source (CDA licensee lists). CDA exports and hand-built CSVs
// are fine to keep.
import './load-env'
import { readFileSync } from 'node:fs'
import { upsertProspect, type NewProspect } from '../lib/prospects'

type RawRow = Record<string, string>

function usage(msg?: string): never {
  if (msg) console.error(`error: ${msg}`)
  console.error(
    'usage: npm run import:prospects <file.csv|file.ndjson|file.json> [--source <name>] [--dry]',
  )
  process.exit(1)
}

// --- tiny dependency-free CSV parser: quoted fields, embedded commas/newlines,
// "" escapes, CRLF. Returns an array of {header: value} objects. ---
function parseCSV(text: string): RawRow[] {
  const rows: string[][] = []
  let field = ''
  let record: string[] = []
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      record.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      // end of record on \n, or \r not followed by \n; swallow \r\n as one
      if (c === '\r' && text[i + 1] === '\n') i++
      record.push(field)
      field = ''
      // ignore blank trailing lines
      if (record.length > 1 || record[0] !== '') rows.push(record)
      record = []
    } else {
      field += c
    }
  }
  if (field !== '' || record.length > 0) {
    record.push(field)
    if (record.length > 1 || record[0] !== '') rows.push(record)
  }
  if (rows.length === 0) return []
  const header = rows[0].map((h) => h.trim().toLowerCase())
  return rows.slice(1).map((r) => {
    const obj: RawRow = {}
    header.forEach((h, i) => {
      obj[h] = (r[i] ?? '').trim()
    })
    return obj
  })
}

function parseRows(file: string, text: string): RawRow[] {
  const lower = file.toLowerCase()
  if (lower.endsWith('.csv')) return parseCSV(text)
  if (lower.endsWith('.ndjson') || lower.endsWith('.jsonl')) {
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => JSON.parse(l) as RawRow)
  }
  // .json — an array of objects, or a single object
  const data = JSON.parse(text)
  return Array.isArray(data) ? (data as RawRow[]) : [data as RawRow]
}

// pick returns the first present, non-empty value across a set of aliases.
function pick(row: RawRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k] ?? row[k.toLowerCase()]
    if (typeof v === 'string' && v.trim() !== '') return v.trim()
    if (typeof v === 'number') return String(v)
  }
  return ''
}

function toProspect(row: RawRow, defaultSource: string): NewProspect | null {
  const company = pick(row, 'company', 'name', 'business', 'business_name')
  if (company === '') return null
  return {
    company,
    phone: pick(row, 'phone', 'telephone', 'tel', 'phone_number'),
    email: pick(row, 'email', 'e-mail'),
    website: pick(row, 'website', 'url', 'site'),
    town: pick(row, 'town', 'city', 'locality'),
    source: pick(row, 'source') || defaultSource,
    license: pick(row, 'license', 'license_number', 'lic'),
    notes: pick(row, 'notes', 'note'),
  }
}

// ---- main ----
const args = process.argv.slice(2)
const dry = args.includes('--dry')
const srcIdx = args.indexOf('--source')
const defaultSource = srcIdx >= 0 ? (args[srcIdx + 1] ?? '') : ''
const file = args.find((a) => !a.startsWith('--') && a !== defaultSource)
if (!file) usage('no input file given')

let text: string
try {
  text = readFileSync(file, 'utf8')
} catch (err) {
  usage(`cannot read ${file}: ${(err as Error).message}`)
}

let rawRows: RawRow[]
try {
  rawRows = parseRows(file, text)
} catch (err) {
  usage(`failed to parse ${file}: ${(err as Error).message}`)
}

let inserted = 0
let updated = 0
let skipped = 0
let withPhone = 0

for (const row of rawRows) {
  const p = toProspect(row, defaultSource)
  if (!p) {
    skipped++
    continue
  }
  if ((p.phone ?? '') !== '') withPhone++
  if (dry) continue
  const result = upsertProspect(p)
  if (result === 'inserted') inserted++
  else updated++
}

if (dry) {
  console.log(
    `[dry run] ${rawRows.length} rows parsed · ${rawRows.length - skipped} with a company · ` +
      `${skipped} skipped (no company) · ${withPhone} carry a phone. Nothing written.`,
  )
} else {
  console.log(
    `imported: ${inserted} new · ${updated} deduped/enriched · ${skipped} skipped (no company). ` +
      `${inserted + updated} prospects touched.`,
  )
}
