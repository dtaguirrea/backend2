import dotenv from "dotenv"

dotenv.config()

export const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    mailer:{
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        auth:{
            user: process.env.MAILER_USERNAME,
            pass: process.env.MAILER_PASSWORD,
        }
    }
}