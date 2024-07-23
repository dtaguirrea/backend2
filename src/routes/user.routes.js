import { Router } from "express";
import { userModel } from "../models/user.model";
import { createHash } from "../utils/hash";

const router= Router();

router.get("/", async (req,res)=>{
    try{
        const users=await userModel.find();
        res.status(200).json(users)
    } catch(error){
        res.status(500).json({error: "Error al obtener los usuarios"})
    }
})

router.post("/", async(req,res)=>{
    const { first_name, last_name, email, age, password } = req.body

    if(!first_name || !last_name || !email || !age || !password){
        return res.status(400).json({error:"Falta información"})
    }

    try{
        const hashPassword= await createHash(password);

        const user= await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: hashPassword
        })

        res.status(201).json(user);
    } catch(error){
        res
        .status(500)
        .json({ error: "Error al crear el usuario", details: error.message})
    }
})

export default router