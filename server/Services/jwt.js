import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const setJwtUser =(user)=>{
    const token = jwt.sign({userId:user._id,name:user.name,email:user.email, role:user.role},process.env.SECRET_KEY, { expiresIn: "24h" } );
    return token;
}

export const getJwtUser = (token)=>{
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user; 
    } catch (error) {
        console.log("Token is Expired",error.message);
        return null;
    }

}