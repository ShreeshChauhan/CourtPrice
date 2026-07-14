import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import tennisRouter from "./routes/tennis.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use("/api/tennis", tennisRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})