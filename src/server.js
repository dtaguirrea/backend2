import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.routes.js"
import morgan from "morgan"
import { initializePassport } from "./config/passport.config.js"
import passport from "passport"

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(morgan("dev"))
app.use(cookieParser())

initializePassport()
app.use(passport.initialize())

mongoose
.connect("mongodb://localhost:27017/backend2")
.then(()=>{
    console.log("Conectado a MongoDB")
})
.catch((error)=>{
    console.log(error)
})

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})