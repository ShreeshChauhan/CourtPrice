import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function parseCSV(text) {
  const lines = text.trim().split("\n")
  const headers = lines[0].split(",")
  return lines.slice(1).map((line) => {
    const values = line.split(",")
    return Object.fromEntries(
      headers.map((h, i) => [h.trim(), (values[i] || "").trim()])
    )
  })
}

function getMatches() {
  const filePath = path.join(__dirname, "../data/atp_matches.csv")
  const text = fs.readFileSync(filePath, "utf-8")
  return parseCSV(text)
}

router.get("/players", (req, res) => {
  try {
    const { name } = req.query
    if (!name || name.length < 2) return res.json([])

    const matches = getMatches()
    const query = name.toLowerCase()
    const seen = new Set()
    const players = []

    for (const m of matches) {
      for (const role of ["winner", "loser"]) {
        const playerName = m[`${role}_name`]
        const playerId = m[`${role}_id`]
        if (playerName?.toLowerCase().includes(query) && !seen.has(playerId)) {
          seen.add(playerId)
          players.push({
            player_key: playerId,
            player_name: playerName,
            player_country: m[`${role}_ioc`] || "?"
          })
        }
      }
      if (players.length >= 10) break
    }

    res.json(players)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Failed to search players" })
  }

})

router.get("/matches", (req, res) => {
  try {
    const { playerName } = req.query
    if (!playerName) return res.json([])

    const matches = getMatches()
    const query = playerName.toLowerCase()

    const playerMatches = matches
      .filter((m) =>
        m.winner_name?.toLowerCase().includes(query) ||
        m.loser_name?.toLowerCase().includes(query)
      )
      .map((m) => {
        const won = m.winner_name?.toLowerCase().includes(query)
        return {
          tournament: m.tourney_name,
          surface: m.surface,
          date: m.tourney_date,
          round: m.round,
          score: m.score,
          opponent: won ? m.loser_name : m.winner_name,
          won
        }
      })

    res.json(playerMatches)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch matches" })
  }
})

export default router