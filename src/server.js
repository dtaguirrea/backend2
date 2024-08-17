import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import routes from "./routes/index.js"
import morgan from "morgan"
import { initializePassport } from "./config/passport.config.js"
import passport from "passport"
import { config } from "./config/config.js"
const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(morgan("dev"))
app.use(cookieParser())

initializePassport()
app.use(passport.initialize())

mongoose
.connect(config.MONGO_URI)
.then(()=>{
    console.log("Conectado a MongoDB")
})
.catch((error)=>{
    console.log(error)
})

app.use("/api",routes)

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})