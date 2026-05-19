import express, { type Application, type Request, type Response } from 'express'




import { userRouter } from './modules/user/user.route.js';
import { profileRouter } from './modules/profile/profile.route.js';
import { authRouter } from './modules/auth/auth.route.js';
import fs from "fs";
import logger from './middleweare/logger.js';

const app: Application = express()

// 8mZ.LXKX4u.!H85

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger)




app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "Success",
    "author": "Sabbir Ahmed Jony"
  })
})

app.use('/api/users', userRouter)
app.use('/api/profile', profileRouter)
app.use('/api/auth', authRouter)







export default app
