import { useState, useEffect } from "react"

export default function App() {
  const [query, setQuery] = useState("")
  const [players, setPlayers] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [matches, setMatches] = useState([])
  const [priceData, setPriceData] = useState(null)

  useEffect(() => {
    if (query.length < 3) {
      setPlayers([])
      return
    }
    fetch(`http://localhost:3001/api/tennis/players?name=${query}`)
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error(err))
  }, [query])

  useEffect(() => {
    if (!selectedPlayer) return
    fetch(`http://localhost:3001/api/tennis/matches?playerName=${selectedPlayer.player_name}`)
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error(err))
  }, [selectedPlayer])

  useEffect(() => {
  if (!selectedPlayer) return
  fetch(`http://localhost:3001/api/ebay/prices?player=${selectedPlayer.player_name}`)
    .then((res) => res.json())
    .then((data) => setPriceData(data))
    .catch((err) => console.error(err))
}, [selectedPlayer])

  if (selectedPlayer) {
    return (
      <div style={{ minHeight: "100vh", padding: "2rem", color: "white" }}>
        <button
          onClick={() => {
            setSelectedPlayer(null)
            setMatches([])
            setPriceData(null)
          }}
          style={{
            background: "none",
            border: "1px solid #444",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "2rem"
          }}
        >
          ← Back
        </button>

        <h1 style={{ fontSize: "2.5rem", fontWeight: "800" }}>
          {selectedPlayer.player_name}
        </h1>
        <p style={{ opacity: 0.5, marginTop: "0.5rem", marginBottom: "2rem" }}>
          {selectedPlayer.player_country}
        </p>

        <h2 style={{ fontSize: "1rem", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
          Recent Matches
        </h2>

        {matches.map((match, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.75rem 1rem",
            marginBottom: "0.5rem",
            background: "#1a1f35",
            borderRadius: "8px",
            borderLeft: `4px solid ${match.won ? "#00c896" : "#ff4d4d"}`
          }}>
            <span style={{
              fontWeight: "800",
              color: match.won ? "#00c896" : "#ff4d4d",
              width: "1.5rem"
            }}>
              {match.won ? "W" : "L"}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "600" }}>{match.tournament}</div>
              <div style={{ opacity: 0.5, fontSize: "0.85rem" }}>vs {match.opponent} · {match.score}</div>
            </div>
            <span style={{ opacity: 0.4, fontSize: "0.8rem" }}>{match.surface}</span>
          </div>
        ))}

        <h2 style={{ fontSize: "1rem", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.1em", margin: "2rem 0 1rem" }}>
  Memorabilia Prices
</h2>

{priceData && (
  <>
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
      {[
        { label: "Avg Price", value: `$${priceData.average}` },
        { label: "Min", value: `$${priceData.min}` },
        { label: "Max", value: `$${priceData.max}` },
        { label: "Listings", value: priceData.count },
      ].map((stat) => (
        <div key={stat.label} style={{
          flex: 1,
          background: "#1a1f35",
          border: "1px solid #2a3050",
          borderRadius: "8px",
          padding: "1rem",
          textAlign: "center"
        }}>
          <div style={{ opacity: 0.4, fontSize: "0.75rem", marginBottom: "0.25rem" }}>{stat.label}</div>
          <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#00c896" }}>{stat.value}</div>
        </div>
      ))}
    </div>

    {priceData.items.map((item, i) => (
      <div key={i} style={{
        padding: "0.75rem 1rem",
        marginBottom: "0.5rem",
        background: "#1a1f35",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{ fontSize: "0.9rem" }}>{item.title}</span>
        <span style={{ color: "#00c896", fontWeight: "700" }}>${item.price}</span>
      </div>
    ))}
  </>
)}
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem"
    }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "white" }}>
        CourtPrice
      </h1>

      <input
        type="text"
        placeholder="Search a player..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "400px",
          padding: "0.75rem 1rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #444",
          background: "transparent",
          color: "white",
          outline: "none"
        }}
      />

      {players.length > 0 && (
        <ul style={{
          listStyle: "none",
          width: "400px",
          background: "#1a1f35",
          border: "1px solid #444",
          borderRadius: "8px",
          padding: "0.5rem 0"
        }}>
          {players.map((player) => (
            <li
              key={player.player_key}
              onClick={() => {
                setSelectedPlayer(player)
                setQuery("")
                setPlayers([])
              }}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                color: "white",
                display: "flex",
                justifyContent: "space-between"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#2a3050"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span>{player.player_name}</span>
              <span style={{ opacity: 0.5 }}>{player.player_country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}