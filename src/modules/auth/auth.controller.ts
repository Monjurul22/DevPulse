import type { Request, Response } from "express"
import { authService } from "./auth.service"

const signUp = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            error: "name,email,and password are required"

        })
    }
    try {
        const user = await authService.signUp({ name, email, password, role })
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (err: any) {
        const status = err.status || 500;
        res.status(status).json({
            success: false,
            message: err.message || "Registration failed.",
            errors: err.message || "Internal server error.",
        });
    }

}

const logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: "email and password are required"

        })
    }
    try {
        const data = await authService.logIn({ email, password })
        res.status(200).json({
            success: true,
            message: "Login successful",
            data,
        });
    } catch (err: any) {
        const status = err.status || 500;
        res.status(status).json({
            success: false,
            message: err.message || "Login failed.",
            errors: err.message || "Internal server error.",
        });
    }

}


export const authController = {
    signUp,
    logIn
}