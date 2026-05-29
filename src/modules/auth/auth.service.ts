import bcrypt from "bcryptjs"
import type { logInInput, SignupInput } from "./auth.interface"
import { pool } from "../../db";
import jwt from "jsonwebtoken";
const signUp = async (paylode: SignupInput) => {
    const { name, email, password, role } = paylode
    const existing = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );
    if (existing.rows.length > 0) {
        throw { status: 400, message: "Email already registered." };
    }
    const hashed = await bcrypt.hash(password, 10)
    const result = await pool.query(
        `
        INSERT INTO users(name, email, password, role)
        VALUES($1,$2,$3,$4)
        RETURNING id, name, email, role, created_at, updated_at
    `,
        [name, email, hashed, role??"contributor"]
    );

    return result.rows[0];
}

const logIn = async (paylode: logInInput) => {
    const { email, password } = paylode;
    const result = await pool.query(
        "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = $1",
        [email]
    );
    const user = result.rows[0];
    if (!user) {
        throw { status: 401, message: "Invalid email or password." };
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw { status: 401, message: "Invalid email or password." };
    }
    const secret = "jwt_secret"
    const expires = "30d"
    const token = jwt.sign(
        { id: user.id, name: user.name, role: user.role },
        secret,
        { expiresIn: expires } as jwt.SignOptions
    );
    const { password: _, ...safeUser } = user as Record<string, unknown>;
return { token, user: safeUser };






}
export const authService = {
    signUp,
    logIn

}