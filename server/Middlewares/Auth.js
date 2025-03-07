import { getJwtUser } from "../Services/jwt.js";
import User from "../Models/User.js";

export const checkAuth =async (req , res , next)=>{
    req.user = null;
    
    const token = req.headers['authorization'];
    if(!token) return next();

    const user = getJwtUser(token);
    if(!user) return next();
   
    const checkinDb = await User.findById(user.userId);
    if(!checkinDb) return next();

    req.user = user;
    return next();

}

export const ristrictTo = (role =[])=>{
    return (req , res , next)=>{
        if(!req.user)
        {
            return  res.status(401).json({ message: "Please log in first.", success:false });
        }
        if(!role.includes(req.user.role))
        {
            return  res.status(401).json({ message: "Un Authorized User", success:false });
        }
        return next();
    }
}