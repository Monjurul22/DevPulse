import express, { json, type Application, type Request, type Response } from 'express'

const app:Application = express()
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:true}))

import { authRouter } from './modules/auth/auth.router'
import { issuesRouter } from './modules/issues/issues.router'
app.get('/', (req:Request, res:Response) => {
//   res.send('Hello World!')
res.status(200).json({
    massage:"express Server",
    "author":"Monjuru Ahamed",

})
})

app.use("/api/auth", authRouter)
app.use("/api/issues",issuesRouter)


export default app