# CourtPrice 🎾

> A full-stack web app that tracks ATP tennis player performance and correlates it with real-world memorabilia prices on eBay.

Search any player, see their recent match history, and view what their signed merchandise is selling for — with price trends over time.

---

## What It Does

- Search any ATP player (Alcaraz, Sinner, Djokovic...)
- View their last 15 matches with results, opponents, scores, and tournaments
- See live eBay prices for their signed memorabilia (avg, min, max)
- Track price history over time as a chart
- Browse active listings with images and direct eBay links

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | UI — search, player cards, charts |
| Backend | Node.js + Express | REST API server, middleware |
| Tennis Data | JeffSackmann CSV (GitHub) | Free ATP match dataset (2023–2024) |
| Merchandise | eBay Browse API | Live signed memorabilia prices |
| Cloud Storage | AWS S3 | Caches tennis CSVs (avoids re-fetching) |
| Database | AWS DynamoDB | Stores daily price snapshots per player |
| Server | AWS EC2 | Hosts Express backend 24/7 |
| Frontend Deploy | Vercel | Hosts React app, connects to EC2 |

---

## Architecture

```
User's Browser
      ↓
  React App (Vercel)
      ↓  HTTP requests
  Express Server (AWS EC2)
      ↓              ↓              ↓
  eBay API     GitHub CSVs      DynamoDB
               (cached in S3)  (price history)
```

---

## Project Structure

```
courtprice/
├── client/                   # React frontend
│   └── src/
│       ├── components/
│       │   ├── MatchHistory.jsx        # Win/loss match list
│       │   ├── PriceChart.jsx          # Active eBay listings
│       │   └── PriceHistoryChart.jsx   # SVG price trend over time
│       ├── hooks/
│       │   ├── useTennisData.js        # Player search, matches, rankings
│       │   └── useEbayPrices.js        # Live eBay price fetching
│       └── pages/
│           ├── Home.jsx                # Rankings + search
│           └── PlayerDetail.jsx        # Player profile page
│
└── server/                   # Express backend
    ├── aws/
    │   ├── s3.js             # S3 read/write helpers
    │   └── dynamo.js         # DynamoDB save/query helpers
    ├── routes/
    │   ├── tennis.js         # /api/tennis/* — players, matches, rankings
    │   └── ebay.js           # /api/ebay/* — prices, history
    └── index.js              # Server entry point
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- An eBay Developer account (free at [developer.ebay.com](https://developer.ebay.com))
- AWS account (free tier at [aws.amazon.com](https://aws.amazon.com)) — optional for local dev

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/courtprice.git
cd courtprice
```

### 2. Set up the server
```bash
cd server
npm install
cp .env.example .env
# Fill in your keys in .env
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

## Environment Variables

Create `server/.env` based on `.env.example`:

```env
PORT=3001

# eBay API — free at developer.ebay.com
EBAY_CLIENT_ID=your_client_id
EBAY_CLIENT_SECRET=your_client_secret

# AWS — optional locally, required on EC2
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=courtprice-csv-cache
DYNAMO_TABLE=courtprice-prices
```

> AWS keys are optional for local development. The app falls back to in-memory caching automatically.

---

## API Endpoints

### Tennis
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tennis/players?name=alcaraz` | Search players by name |
| GET | `/api/tennis/matches?playerName=Carlos+Alcaraz` | Last 15 matches |
| GET | `/api/tennis/rankings` | ATP Top 20 |

### eBay
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ebay/prices?player=Carlos+Alcaraz` | Live price stats + listings |
| GET | `/api/ebay/history?player=Carlos+Alcaraz` | Price history from DynamoDB |

---

## AWS Setup (for deployment)

See [AWS_DEPLOY.md](./AWS_DEPLOY.md) for the full step-by-step guide to:
- Creating an S3 bucket for CSV caching
- Creating a DynamoDB table for price history
- Launching an EC2 instance and deploying the server
- Connecting Vercel frontend to EC2 backend

---

## Deploying

### Backend → AWS EC2
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Upload server code
scp -i your-key.pem -r ./server ubuntu@YOUR_EC2_IP:~/

# On EC2
cd server && npm install
npm install -g pm2
pm2 start index.js --name courtprice
pm2 startup
```

### Frontend → Vercel
1. Push `client/` to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Set env variable: `VITE_API_URL=http://YOUR_EC2_IP:3001`
4. Deploy

---

## Data Sources

- **Tennis match data:** [JeffSackmann/tennis_atp](https://github.com/JeffSackmann/tennis_atp) — free, no API key required, updated regularly
- **Merchandise prices:** [eBay Browse API](https://developer.ebay.com/api-docs/buy/browse/overview.html) — free developer tier, OAuth2 app credentials


---

## License

MIT