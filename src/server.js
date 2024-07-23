import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import sessionRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static("public"))