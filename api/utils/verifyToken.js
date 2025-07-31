import jwt from 'jsonwebtoken';
import {CreateError} from '../utils/error.js'

export const verifyToken = (req, res, next) => {   
    const token = req.cookies.access_token;
    console.log("Token:", token); // Log token
    if (!token) return res.status(401).json({ message: "You are not authenticated!" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(CreateError(403, "Token is not Valid!!!"));
        req.user = user;
        console.log("User from token:", req.user); // Log user info
        next();
    });
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log("User ID from token:", req.user.id); // Log user ID
        console.log("Requested ID:", req.params.id); // Log requested ID
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(CreateError(403, "You are not authorized!!!"));
        }
    });
}

export const verifyAdmin = (req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next();
        }
        else {
            return next(CreateError(403, "You are not authorized!!!"))
        }

    })
}