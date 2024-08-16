import passport from "passport";
import local from "passport-local"
import jwt from "jsonwebtoken"
import jwtStrategy from "passport-jwt"
import { userModel } from "../models/user.model.js";
import { comparePassword, createHash } from "../utils/hash.js";

const LocalStrategy= local.Strategy
const JWTStrategy = jwtStrategy.Strategy
const ExtractJWT = jwtStrategy.ExtractJwt

const initializePassport = () =>{
    passport.use(
        "login",
        new LocalStrategy(
            {usernameField: "email", passReqToCallback: true},
            async (req,email,password,done)=>{
                try{
                    const user= await userModel.findOne({email})

                    if(!user){
                        return done(null,false,{message: "usuario no encontrado"})
                    }

                    if(!(await comparePassword(password, user.password))){
                        return done (null, false, {message: "Contraseña incorrecta"})
                    }

                    return done(null, user)
                } catch (error){
                    done(error)
                }
            }
        )
    )
    passport.use(
        "register",
        new LocalStrategy(
            {usernameField:"email", passReqToCallback: true },
            async (req, email, password, done)=>{
                try{
                    const{ first_name, last_name, age} = req.body

                    const userExists = await userModel.findOne({email})

                    if (userExists){
                        return done( null, false, { message: "El usuario ya existe"})
                    }
                    const hashPassword= await createHash(password)

                    const user = await userModel.create({
                        first_name,
                        last_name,
                        email,
                        age,
                        password: hashPassword
                    })
                    return done(null,user)
                } catch(error){
                    done(error)
                }
            } 
        )
    )
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async (id,done)=>{
        try{
            const user = await userModel.findById(id)
            done(null,user)
        } catch(error){
            done(error)
        }
    })
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: "s3cr3t"
            },
            async (payload,done)=>{
                try{
                    return done(null,payload)
                } catch(error){
                    return done(error)
                }
            }
        )
    )
}

function cookieExtractor(req){
    let token =null
    if (req && req.cookies){
        token = req.cookies["token"]
    }

    return token
}

export { initializePassport }