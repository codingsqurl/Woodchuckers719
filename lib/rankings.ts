// rankings.ts — manual SEO rank tracker data layer (admin only). KING types in
// what he sees on a Google search: for a keyword, who sits at each position and
// which row is us. The admin view groups by keyword so "who ranks above" is the
// rows with a position below our own. No SERP API, no scraping — hand-entered.
import { db } from './db'
import { formatStamp } from './format'

export type Ranking = {
  id: number
  keyword: string
  position: number
  competitor: string
  isSelf: boolean
  note: string
  checkedAt: number
}

export type NewRanking = Omit<Ranking, 'id' | 'checkedAt'>

type RankingRow = {
  id: number
  keyword: string
  position: number
  competitor: string
  is_self: number
  note: string
  checked_at: number
}

function mapRanking(r: RankingRow): Ranking {
  return {
    id: r.id,
    keyword: r.keyword,
    position: r.position,
    competitor: r.competitor,
    isSelf: r.is_self === 1,
    note: r.note,
    checkedAt: r.checked_at,
  }
}

// addRanking inserts one hand-entered observation and returns its new id.
export function addRanking(r: NewRanking): number {
  const info = db
    .prepare(
      `INSERT INTO rankings (keyword, position, competitor, is_self, note)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(r.keyword, r.position, r.competitor, r.isSelf ? 1 : 0, r.note)
  return Number(info.lastInsertRowid)
}

// deleteRanking removes one row by id.
export function deleteRanking(id: number): void {
  db.prepare(`DELETE FROM rankings WHERE id = ?`).run(id)
}

// listRankings returns every observation, grouped-friendly: keyword A→Z, then
// position low→high, newest check first within a position. Defends against the
// table not existing yet (migration 0007 applies on the next server boot, so a
// page load before that restart returns empty instead of crashing /admin).
export function listRankings(): Ranking[] {
  try {
    const rows = db
      .prepare(
        `SELECT id, keyword, position, competitor, is_self, COALESCE(note, '') AS note, checked_at
         FROM rankings ORDER BY keyword ASC, position ASC, checked_at DESC`,
      )
      .all() as RankingRow[]
    return rows.map(mapRanking)
  } catch (err) {
    if (err instanceof Error && err.message.includes('no such table')) return []
    throw err
  }
}

// groupByKeyword buckets the flat list into keyword → rows for the admin view.
export function groupByKeyword(rows: Ranking[]): { keyword: string; rows: Ranking[] }[] {
  const groups = new Map<string, Ranking[]>()
  for (const r of rows) {
    const g = groups.get(r.keyword)
    if (g) g.push(r)
    else groups.set(r.keyword, [r])
  }
  return [...groups.entries()].map(([keyword, rows]) => ({ keyword, rows }))
}

// checked renders an observation's time for the admin list, e.g. "Jan 2, 3:04 PM".
export function checked(r: Pick<Ranking, 'checkedAt'>): string {
  return formatStamp(r.checkedAt)
}
