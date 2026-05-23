import express, { type Application, type Request, type Response } from 'express'




import { userRouter } from './modules/user/user.route.js';
import { profileRouter } from './modules/profile/profile.route.js';
import { authRouter } from './modules/auth/auth.route.js';
import fs from "fs";
import logger from './middleweare/logger.js';
import cookieParser from "cookie-parser"
import globalErrorHandler from './middleweare/globalErrorhandler.js';

import cors from "cors"
const app: Application = express()

// 8mZ.LXKX4u.!H85


app.use(cookieParser())
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger)
const corsOptions = {
    origin: ["http://localhost:3000"]
}
app.use(cors(corsOptions))




app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "Success",
    "author": "Sabbir Ahmed Jony"
  })
})

app.use('/api/users', userRouter)
app.use('/api/profile', profileRouter)
app.use('/api/auth', authRouter)




app.use(globalErrorHandler)
// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));



export default app


