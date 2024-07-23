import { Router } from "express";
import { userModel } from "../models/user.model";
import { comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

const router = Router()

router.post("/login", async (req,res)=>{
    const { email, password } = req.body

    if (!email || !password){
        return res.status(400).json({error: "Falta el email o la contraseña"})
    }
     try{
        const user = await userModel.findOne({ email })

        if (!user){
            return res.status(404).json({error: "Usuario no encontrado"})
        }

        const isPasswordCorrect = await comparePassword(password,user.password)
    
        if(!isPasswordCorrect){
            return res.status(401).json({error: "Contraseña incorrecta"})
        }

        const token = generateToken({email: user.email, role: user.role})

        res.cookie("currentUser", token, {maxAge:100000})

        res.status(200).json({ message: "Sesión iniciada"})
    } catch(error){
        res
        .status(500)
        .json({error:"Error al iniciar sesión",details: error.message})
    
    }
})

router.get("/current", (req,res)=>{
    const token = req.cookies.currentUser

    if(!token){
        return res.status(401).json({error: "No autorizado"})
    }

    try {
        const user = verifyToken(token)

        res.status(200).json(user)
    } catch(error){
        res
        .status(500)
        .json({ error: "Error al obtener al usuario", details: error.message})
    }
})