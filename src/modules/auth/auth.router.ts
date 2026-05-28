import { Router } from "express";
import { authController } from "./auth.controller";
import { Pool } from "pg";

const router=Router()
export const authRouter=router;

router.post("/signup", authController.signUp)
router.post("/login" ,authController.logIn)