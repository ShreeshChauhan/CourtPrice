# CourtPrice 🎾

> A full-stack web app that tracks ATP tennis player performance and correlates it with real-world memorabilia prices on eBay.

Search any player, see their recent match history, and view what their signed merchandise is selling for right now.

---

## What It Does

- Search any ATP player (Alcaraz, Sinner, Djokovic, Medvedev...)
- Click a player to see their recent match history — wins, losses, scores, surfaces, tournaments
- See live eBay prices for their signed memorabilia (avg, min, max, total listings)
- Browse active eBay listings with titles and prices

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | Search UI, player profile, match history, price display |
| Backend | Node.js + Express | REST API server, routing, middleware |
| Tennis Data | Local CSV (ATP match data) | Player search and match history |
| Merchandise | eBay Browse API | Live signed memorabilia prices |

---

## Architecture

```
User's Browser
      ↓
  React App (localhost:5173)
      ↓  HTTP requests
  Express Server (localhost:3001)
      ↓                    ↓
  eBay Browse API     Local CSV Data
  (live prices)       (match history)
```

---

## Project Structure

```
courtprice/
├── client/                   # React frontend
│   └── src/
│       └── App.jsx           # Main app — search, player detail, prices
│
└── server/                   # Express backend
    ├── data/
    │   └── atp_matches.csv   # ATP match data
    ├── routes/
    │   ├── tennis.js         # /api/tennis/* — players, matches
    │   └── ebay.js           # /api/ebay/* — live prices
    └── index.js              # Server entry point
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- eBay Developer account — free at [developer.ebay.com](https://developer.ebay.com)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/courtprice.git
cd courtprice
```

### 2. Set up the server
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=3001
EBAY_CLIENT_ID=your_client_id
EBAY_CLIENT_SECRET=your_client_secret
```

Then run:
```bash
npm run dev
```

### 3. Set up the client
```bash
cd ../client
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## API Endpoints

### Tennis
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tennis/players?name=alcaraz` | Search players by name |
| GET | `/api/tennis/matches?playerName=Carlos+Alcaraz` | Recent match history |

### eBay
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ebay/prices?player=Carlos+Alcaraz` | Live price stats + listings |

---

## Features Breakdown

**Search Page**
- Radial gradient dark background
- Centered search bar with pill shape
- Quick-search tags: Alcaraz, Sinner, Djokovic, Medvedev
- Live dropdown as you type (triggers after 3 characters)
- Nav bar with tech stack badges + GitHub link

**Player Profile Page**
- Avatar with player initials
- Metadata chips (country, handedness)
- 2-column grid layout — matches left, prices right
- Win/Loss capsule badges (green/red)
- eBay stat cards (avg, min, max, listings)
- Listing rows with thumbnail placeholder and price

---


---

## License

MIT
