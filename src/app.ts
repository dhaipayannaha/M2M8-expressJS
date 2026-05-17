import express, { type Application, type Request, type Response } from 'express'



import { initDB, pool } from './db/index.js';
import { userRouter } from './modules/user/user.route.js';
import { profileRouter } from './modules/profile/profile.route.js';

const app: Application = express()

// 8mZ.LXKX4u.!H85

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

//this pool /setu thet connect setver to database neodb




app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "Success",
    "author": "Sabbir Ahmed Jony"
  })
})

app.use('/api/users', userRouter)
app.use('/api/profile', profileRouter)








export default app
