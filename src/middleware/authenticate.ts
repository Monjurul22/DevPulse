// import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// import type { AuthPayload } from "../types/express";

import type { NextFunction, Request, Response } from "express";
import type { AuthPayload } from "../types/express";


// export function authenticate(req: Request, res: Response, next: NextFunction):void {
//     const token = req.headers.authorization;
//     if (!token) {
//         res.status(401).json({
//             success: false,
//             message: "Access denied. No token provided.",
//             errors: "Authorization header is missing.",
//         });
//         return;
//     }
//     try {
//         const secret = "jwt_secret"
//         const decoded= jwt.verify(token,secret) as jwt.JwtPayload & AuthPayload;
//         req.user = decoded
//         next()
        
//     } catch (error) {
//         console.log(error);
        
//     }
// }


export function authenticate(req:Request,res:Response,next:NextFunction):void {
    const token = req.headers["authorization"];
    if(!token){
        res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
            errors: "Authorization header is missing.",
        });
        return;
    }
    try {
         const secret="jwt_secret"
    const decoded= jwt.verify(token,secret) as jwt.JwtPayload & AuthPayload 
    req.user=decoded
    next()
    } catch (error) {
        console.log(error);
        
    }
    
   
}