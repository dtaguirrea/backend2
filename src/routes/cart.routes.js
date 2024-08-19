import { Router } from "express";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { validate } from "../middlewares/validation.middleware.js";
import { cartDto } from "../dtos/cart.dto.js";
import { v4 as uuid } from "uuid";
import { ticketModel } from "../models/ticket.model.js"
import {sendPurchaseConfirmationEmail} from "../utils/email.service.js"
import passport from "passport";
import { authorization } from "../middlewares/authorization.middleware.js";
const router= Router()

router.get("/id", async(req,res)=>{
    try {
        const { id } = req.params
        const cart= await cartModel.findById(id)
        res.json(cart)
    } catch(error){
        res.status(500).json({ error:"Error al obtener el carrito", details: error.message})
    }
})

router.post("/", passport.authenticate('jwt', {session: false}) ,validate(cartDto), async (req,res)=>{
    try{
        const { products }= req.body
        const cart= await cartModel.create({ products })
        res.status(201).json(cart)
    } catch(error){
        res.status(500).json({ error:"Error al crear el carrito", details: error.message})
    }
})

router.post("/:id/products", passport.authenticate('jwt', {session: false}),authorization(['user']), async (req,res)=>{
    try{
        const { productId, quantity }= req.body
        const productExists = await productModel.findById(productId)

        if(!productExists){
            return res.status(404).json({
                error: "Producto no encontrado"
            })
        }
        const cart= await cartModel.findById(req.params.id)

        const isProductInCart = cart.products.find((p)=>p.product===productId)

        if(isProductInCart){
            cart.products.find((p)=>p.product=== productId).quantity += quantity

            cart.save()
            res.json(cart)
        } else{
            cart.products.push({
                product: productId,
                quantity
            })
            cart.save()
            res.json(cart)
        } 
    } catch(error){
        res.status(500).json({
            error: "Error al agregar producto",
            details: error.message
        })
    }

})

router.delete("/:id", passport.authenticate('jwt', {session: false}), async (req,res)=>{
    try{
        const { id } = req.params
        const cart = await cartModel.findByIdAndDelete(id)

        res.json(cart)
    } catch(error){
        res.status(500).json({
            error: "Error al eliminar el carrito",
            details: error.message
        })
    }
})

router.delete("/:id/products/:productId",passport.authenticate('jwt', {session: false}), async( req,res )=>{
    try{
        const { id, productId }= req.params
        const cart= await cartModel.findById(id)

        const isProductInCart= cart.products.find((p)=>p.product !== productId)
        if (isProductInCart){
            cart.products= cart.products.filter((p)=>p.product !== productId)
            cart.save()
            res.json(cart)
            } else{
                return res.status(404).json({error:"Producto no encontrado"})
            }
        } catch(error){
            res.status(500).json({
                error:"Error al eliminar el producto del carrito",
                details:error.message
            })
        }
    }
)

router.delete("/:id/products", passport.authenticate('jwt', {session: false}), async(req,res)=>{
    try{
        const { id }= req.params
        const cart= await cartModel.findById(id)

        cart.products= []
        cart.save()

        res.json(cart)
    } catch(error){
        res.status(500).json({
            error:"Error al eliminar los productos del carrito",
            details: error.message
        })
    }
})

router.post("/:id/purchase",passport.authenticate('jwt', {session: false}), async (req,res) => {
    try{
        const { id }= req.params

        const cart= await cartModel.findById(id).populate("products.product")

        if(!cart){
            return res.status(404).json({
                error: "Carrito no encontrado"
            })
        }

        const productsWithoutStock= []
        const productsToPurchase= []
        cart.products.forEach(async (p)=>{
            if(p.product.stock < p.quantity){
                productsWithoutStock.push(p.product.name)
            } else{
                productsToPurchase.push(p)
            }
        })
        
        await Promise.all(
            productsToPurchase.map(async (p)=>{
                const product = await productModel.findById(p.product._id)
                product.stock -= p.quantity
                await product.save()
            })
        )
        if (productsToPurchase.length>0){
            const ticket= await ticketModel.create({
                code: uuid(),
                purchase_datetime: new Date(),
                amount: productsToPurchase.reduce(
                    (acc,curr)=> acc + curr.quantity* curr.product.price,
                    0
                ),
                purchaser: req.user.email
            })
            cart.products= cart.products.filter(p=>
                productsWithoutStock.includes(p.product._id)
            )
            await cart.save()

            await sendPurchaseConfirmationEmail(req.user.email, ticket)

            return res.status(200).json({
                message:"Compra finalizada",
                ticket,
                unprocessedProducts: productsWithoutStock
            })
        } else{
            return res.status(400).json({
                error:"No hay productos para procesar la compra",
                unprocessedProducts: productsWithoutStock
                
            })
        }
    } catch(error){
        res.status(500).json({
            error: "Error al finalizar la compra",
            details: error.message
        })
    }
})

export default router