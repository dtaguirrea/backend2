export function authorization(roles){
    return async (req, res, next)=>{
        if (!req.user) {
            return res.status(401).json({ message: "No autorizado"})        
        }
        if (!roles.includes(req.user.role)){
            return res.status(401).json({ message: "No tienes permisos"})
        }

        next()
    }
}