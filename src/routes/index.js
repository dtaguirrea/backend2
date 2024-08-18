import { authorization } from "../middlewares/authorization.middleware.js"
import authRoutes from "./auth.routes.js"
import cartRoutes from "./cart.routes.js"
import productRoutes from "./products.routes.js"
import userRoutes from "./user.routes.js"
import { Router } from "express"

const router= Router()

router.use("/auth", authRoutes)
router.use("/cart",cartRoutes)
router.use("/products", productRoutes)
router.use("/users",userRoutes)

export default router