import express from "express"

const router = express.Router()

// Mock data for now — replace with real eBay API call when keys arrive
const mockPrices = {
  "carlos alcaraz": {
    average: "245.00",
    min: "120.00",
    max: "890.00",
    count: 18,
    items: [
      { title: "Carlos Alcaraz Signed Tennis Racket", price: "450.00", currency: "USD", url: "#", image: null },
      { title: "Alcaraz Signed Wimbledon Photo", price: "220.00", currency: "USD", url: "#", image: null },
      { title: "Carlos Alcaraz Autographed Shirt", price: "189.00", currency: "USD", url: "#", image: null },
    ]
  },
  "novak djokovic": {
    average: "380.00",
    min: "150.00",
    max: "1200.00",
    count: 32,
    items: [
      { title: "Djokovic Signed Tennis Racket", price: "750.00", currency: "USD", url: "#", image: null },
      { title: "Novak Djokovic Autographed Photo", price: "310.00", currency: "USD", url: "#", image: null },
      { title: "Djokovic Signed Shirt Wimbledon", price: "280.00", currency: "USD", url: "#", image: null },
    ]
  },
  "jannik sinner": {
    average: "198.00",
    min: "95.00",
    max: "650.00",
    count: 12,
    items: [
      { title: "Jannik Sinner Signed Photo", price: "195.00", currency: "USD", url: "#", image: null },
      { title: "Sinner Autographed Tennis Ball", price: "120.00", currency: "USD", url: "#", image: null },
    ]
  }
}

router.get("/prices", (req, res) => {
  const { player } = req.query
  if (!player) return res.json(null)

  const key = player.toLowerCase()
  const data = mockPrices[key] || {
    average: "150.00",
    min: "50.00",
    max: "400.00",
    count: 5,
    items: [
      { title: `${player} Signed Photo`, price: "150.00", currency: "USD", url: "#", image: null }
    ]
  }

  res.json(data)
})

export default router