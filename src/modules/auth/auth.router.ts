import { Router } from "express";
import { authController } from "./auth.controller";


const router=Router()
export const authRouter=router;

router.post("/signup", authController.signUp)
router.post("/login" ,authController.logIn)