import jwt from "jsonwebtoken"
import {config} from "../config/config.js"


export function generateToken(payload){

    return jwt.sign(payload, config.JWT_SECRET,{
        expiresIn: "20m"
    })
}

export function veryfyToken(token){
    try{
        const decoded= jwt.verify(token,config.JWT_SECRET);

        return decoded
    } catch(error){
        throw new Error("Token no valido")
    }
}