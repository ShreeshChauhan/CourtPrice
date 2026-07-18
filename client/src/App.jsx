import { useState, useEffect } from "react"

// ── Small reusable components ──────────────────────────────────────

function Chip({ children }) {
  return (
    <span style={{
      fontSize: "0.72rem", color: "#94a3b8",
      background: "#1e1e2e", border: "1px solid #27272a",
      padding: "0.2rem 0.6rem", borderRadius: "9999px"
    }}>
      {children}
    </span>
  )
}

function WLBadge({ won }) {
  return (
    <span style={{
      fontSize: "0.7rem", fontWeight: "700",
      color: "white",
      background: won ? "#16a34a" : "#dc2626",
      padding: "0.2rem 0.55rem", borderRadius: "9999px",
      minWidth: "2rem", textAlign: "center"
    }}>
      {won ? "W" : "L"}
    </span>
  )
}

function StatCard({ label, value }) {
  return (
    <div style={{
      flex: 1, background: "#0f0f17",
      border: "1px solid #1e1e2e",
      borderRadius: "10px", padding: "0.9rem 1rem",
      textAlign: "center"
    }}>
      <div style={{ color: "#52525b", fontSize: "0.7rem", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#e2e8f0" }}>{value}</div>
    </div>
  )
}

function ImagePlaceholder() {
  return (
    <div style={{
      width: "44px", height: "44px", borderRadius: "6px",
      background: "#1e1e2e", border: "1px solid #27272a",
      flexShrink: 0, display: "flex", alignItems: "center",
      justifyContent: "center", color: "#3f3f46", fontSize: "1.2rem"
    }}>
      🎾
    </div>
  )
}

function AvatarPlaceholder({ name }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2)
  return (
    <div style={{
      width: "64px", height: "64px", borderRadius: "9999px",
      background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "1.4rem", fontWeight: "800", color: "white",
      flexShrink: 0
    }}>
      {initials}
    </div>
  )
}

// ── Player Detail Page ─────────────────────────────────────────────

function PlayerDetail({ player, matches, priceData, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "white", padding: "1.5rem 2rem" }}>

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #27272a", color: "#94a3b8", padding: "0.4rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
          ← Back
        </button>
        <span style={{ fontSize: "0.75rem", color: "#22c55e", background: "#052e16", border: "1px solid #166534", padding: "0.3rem 0.75rem", borderRadius: "9999px" }}>
          ● eBay API Connected
        </span>
      </div>

      {/* Player hero */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
        <AvatarPlaceholder name={player.player_name} />
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", letterSpacing: "-0.02em", margin: 0 }}>
            {player.player_name}
          </h1>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
            <Chip>🌍 {player.player_country}</Chip>
            <Chip>ATP Player</Chip>
            <Chip>Right-handed</Chip>
          </div>
        </div>
      </div>

      {/* 2-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "60% 40%", gap: "1.5rem", marginTop: "1.5rem" }}>

        {/* LEFT — Recent Matches */}
        <div>
          <h2 style={{ fontSize: "0.75rem", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            Recent Matches
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {matches.map((match, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.6rem 0.85rem",
                background: "#0f0f17", border: "1px solid #1e1e2e",
                borderRadius: "8px"
              }}>
                <WLBadge won={match.won} />

                {/* Left: Tournament + Surface */}
                <div style={{ flex: "0 0 38%" }}>
                  <div style={{ fontWeight: "600", fontSize: "0.85rem" }}>{match.tournament}</div>
                  <div style={{ color: "#52525b", fontSize: "0.72rem" }}>{match.surface} · {match.round}</div>
                </div>

                {/* Center: Opponent */}
                <div style={{ flex: 1, color: "#94a3b8", fontSize: "0.82rem" }}>
                  vs {match.opponent}
                </div>

                {/* Right: Score */}
                <div style={{ color: "#e2e8f0", fontSize: "0.8rem", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  {match.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — eBay Valuations */}
        <div>
          <h2 style={{ fontSize: "0.75rem", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            eBay Valuations
          </h2>

          {priceData ? (
            <>
              {/* Stat cards */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <StatCard label="Avg" value={"$" + priceData.average} />
                <StatCard label="Min" value={"$" + priceData.min} />
                <StatCard label="Max" value={"$" + priceData.max} />
                <StatCard label="Listed" value={priceData.count} />
              </div>

              {/* Listings */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {priceData.items.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.6rem 0.85rem",
                    background: "#0f0f17", border: "1px solid #1e1e2e",
                    borderRadius: "8px"
                  }}>
                    <ImagePlaceholder />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.8rem", color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.title}
                      </div>
                    </div>
                    <div style={{ color: "#93c5fd", fontWeight: "700", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                      ${item.price}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: "#52525b", fontSize: "0.85rem" }}>Loading prices...</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main App ───────────────────────────────────────────────────────

export default function App() {
  const [query, setQuery] = useState("")
  const [players, setPlayers] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [matches, setMatches] = useState([])
  const [priceData, setPriceData] = useState(null)

  useEffect(() => {
    if (query.length < 3) { setPlayers([]); return }
    fetch(`http://localhost:3001/api/tennis/players?name=${query}`)
      .then((r) => r.json()).then(setPlayers).catch(console.error)
  }, [query])

  useEffect(() => {
    if (!selectedPlayer) return
    fetch(`http://localhost:3001/api/tennis/matches?playerName=${selectedPlayer.player_name}`)
      .then((r) => r.json()).then(setMatches).catch(console.error)
    fetch(`http://localhost:3001/api/ebay/prices?player=${selectedPlayer.player_name}`)
      .then((r) => r.json()).then(setPriceData).catch(console.error)
  }, [selectedPlayer])

  if (selectedPlayer) {
    return (
      <PlayerDetail
        player={selectedPlayer}
        matches={matches}
        priceData={priceData}
        onBack={() => { setSelectedPlayer(null); setMatches([]); setPriceData(null) }}
      />
    )
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "radial-gradient(circle at center, #18181b 0%, #09090b 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", overflow: "hidden", gap: "1rem" }}>

      <nav style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
        <span style={{ color: "white", fontWeight: "700", fontSize: "1rem" }}>CourtPrice</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {["React", "Node.js", "Express", "AWS"].map((tech) => (
            <span key={tech} style={{ fontSize: "0.72rem", color: "#94a3b8", background: "#18181b", border: "1px solid #27272a", padding: "0.2rem 0.6rem", borderRadius: "9999px" }}>
              {tech}
            </span>
          ))}
          <a href="https://github.com/yourusername/courtprice" target="_blank" rel="noreferrer"
            style={{ color: "#94a3b8", fontSize: "0.82rem", textDecoration: "none", border: "1px solid #27272a", padding: "0.3rem 0.8rem", borderRadius: "9999px" }}>
            GitHub
          </a>
        </div>
      </nav>

      <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "white", zIndex: 10, letterSpacing: "-0.02em" }}>
        CourtPrice
      </h1>
      <p style={{ color: "#94a3b8", fontSize: "1rem", textAlign: "center", maxWidth: "360px", lineHeight: "1.6", zIndex: 10 }}>
        Search any ATP player and see how their results move memorabilia prices
      </p>

      <div style={{ zIndex: 10 }}>
        <input type="text" placeholder="Search a player..." value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "400px", height: "48px", padding: "0.75rem 1.5rem", fontSize: "1rem", borderRadius: "9999px", border: "1px solid #27272a", background: "#1e293b", color: "white", outline: "none" }} />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", zIndex: 10 }}>
        {["Alcaraz", "Sinner", "Djokovic", "Medvedev"].map((name) => (
          <button key={name} onClick={() => setQuery(name)}
            style={{ background: "transparent", border: "1px solid #27272a", color: "#94a3b8", padding: "0.3rem 0.85rem", borderRadius: "9999px", fontSize: "0.8rem", cursor: "pointer" }}>
            {name}
          </button>
        ))}
      </div>

      {players.length > 0 && (
        <ul style={{ listStyle: "none", width: "400px", background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", padding: "0.5rem 0", zIndex: 10 }}>
          {players.map((player) => (
            <li key={player.player_key}
              onClick={() => { setSelectedPlayer(player); setQuery(""); setPlayers([]) }}
              style={{ padding: "0.75rem 1rem", cursor: "pointer", color: "white", display: "flex", justifyContent: "space-between" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#27272a"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <span>{player.player_name}</span>
              <span style={{ color: "#71717a" }}>{player.player_country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}