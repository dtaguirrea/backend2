import { Router } from "express"
import { productModel } from "../models/product.model.js";
import { validate } from "../middlewares/validation.middleware.js";
import { productDto } from "../dtos/product.dto.js";
import { authorization } from "../middlewares/authorization.middleware.js";
import passport from "passport";

const router= Router()

router.get("/", async (req,res)=>{
    try {
        const products = await productModel.find()
        res.json(products)
    } catch (error){
        res.status(500).json({
            error: "Error al obtnener los productos",
            details: error.message
        })
    }
})

router.get("/:id", async (req,res)=>{
    try{
        const { id }= req.params
        const product = await productModel.findById(id)
        res.json(product)
    } catch(error){
        res.status(500).json({error: "Error al obtener el producto", details: error.message})
    }
})

router.post("/", 
    passport.authenticate("jwt", { session: false }),
    authorization(["admin"]),
    validate(productDto),
    async(req,res) =>{
        try {
            const { name, description, price, stock} = req.body
            const product = await productModel.create({
                name,
                description,
                price,
                stock
            })
            res.status(201).json(product)
        } catch(error){
            res.status(500).json({ error:"Error al crear el producto", details: error.message})
        }
    }
)

router.delete("/:id", 
    passport.authenticate('jwt', { session: false }), 
    authorization(['admin']),
    async (req, res) => {
        const { id } = req.params;
        await productModel.findByIdAndDelete(id);
        res.status(204).json({ message: "Producto Eliminado" });
    }
);

router.put("/:id", 
    passport.authenticate('jwt', { session: false }), 
    authorization(['admin']),
    async (req, res) => {
        try {
            const { id } = req.params
            const updates = req.body
            const product = await productModel.findByIdAndUpdate(id, updates, { new: true });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: "Error updating product", details: error.message });
        }
    }
);

export default router