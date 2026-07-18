import express from "express"
import axios from "axios"

const router = express.Router()

async function getEbayToken() {
  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString("base64")

  const response = await axios.post(
    "https://api.ebay.com/identity/v1/oauth2/token",
    "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  )
  return response.data.access_token
}

router.get("/prices", async (req, res) => {
  try {
    const { player } = req.query
    if (!player) return res.json(null)

    const token = await getEbayToken()

    const response = await axios.get(
      "https://api.ebay.com/buy/browse/v1/item_summary/search",
      {
        params: {
          q: `${player} signed tennis`,
          filter: "buyingOptions:{FIXED_PRICE}",
          limit: 20,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    const items = response.data.itemSummaries || []
    const prices = items
      .map((i) => parseFloat(i.price?.value))
      .filter(Boolean)

    if (prices.length === 0) return res.json(null)

    const avg = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
    const min = Math.min(...prices).toFixed(2)
    const max = Math.max(...prices).toFixed(2)

    res.json({
      average: avg,
      min,
      max,
      count: prices.length,
      items: items.slice(0, 5).map((i) => ({
        title: i.title,
        price: i.price?.value,
        currency: i.price?.currency,
        url: i.itemWebUrl,
        image: i.image?.imageUrl,
      })),
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Failed to fetch eBay prices" })
  }
})

export default router