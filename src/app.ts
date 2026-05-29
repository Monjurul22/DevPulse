import express, { json, type Application, type Request, type Response } from 'express'

const app:Application = express()
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:true}))

import {Pool} from "pg"
import { initDB,pool } from './db'
import { authRouter } from './modules/auth/auth.router'
import { issuesRouter } from './modules/issues/issues.router'
app.get('/', (req:Request, res:Response) => {
//   res.send('Hello World!')
res.status(200).json({
    massage:"express Server",
    "author":"Next Lever",

})
})

app.use("/api/auth", authRouter)
app.use("/api/issues",issuesRouter)
// app.use("/api/issuse:id",issuesRouter)
// app.use("/api/issues/:id",issuesRouter)
// app.use("/api/issues/:id",issuesRouter)

export default app