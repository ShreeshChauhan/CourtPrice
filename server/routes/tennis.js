import express from "express"
import axios from "axios"

const router = express.Router()

const BASE_URL = "https://raw.githubusercontent.com/JeffSackmann/tennis_atp/master"

let cachedMatches = null
let cacheTime = 0
const CACHE_TTL = 1000 * 60 * 60

function parseCSV(text) {
  const lines = text.trim().split("\n")
  const headers = lines[0].split(",")
  return lines.slice(1).map((line) => {
    const values = line.split(",")
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] || "").trim()]))
  })
}

async function getMatches() {
  if (cachedMatches && Date.now() - cacheTime < CACHE_TTL) return cachedMatches
  
  const all = await Promise.all(
    [2023, 2024].map((year) =>
      axios.get(`${BASE_URL}/atp_matches_${year}.csv`)
        .then((r) => {
          console.log(`Fetched ${year}, rows:`, r.data.split("\n").length)
          return parseCSV(r.data)
        })
        .catch((err) => {
          console.log(`Failed ${year}:`, err.message)
          return []
        })
    )
  )
  cachedMatches = all.flat()
  console.log("Total matches loaded:", cachedMatches.length)
  cacheTime = Date.now()
  return cachedMatches
}

router.get("/players", async (req, res) => {
  try {
    const { name } = req.query
    if (!name || name.length < 2) return res.json([])
    const matches = await getMatches()
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
    res.status(500).json({ error: "Failed to search players" })
  }
})

export default router