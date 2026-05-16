import express, { type Application, type Request, type Response } from 'express'



import { initDB, pool } from './db/index.js';
import { userRouter } from './modules/user/user.route.js';

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
//when some request comes to /api/users it will go to userRouter (mini server)




app.get('/api/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM users WHERE id = $1
      `, [id])

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        })
      }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result.rows[0]
    })
  } catch (error:any) {
    res.status(500).json({
      message: error.message,
      error: error
    })
  }
})

app.put('/api/users/:id', async(req:Request, res:Response) => {
    const {id} = req.params;
    const {name, age, password, is_active} = req.body;
    console.log(id, name, age, password, is_active)

    
    
    try {
      const result = await pool.query(`
        UPDATE users SET name = COALESCE($1, name), age = COALESCE($2, age), password = COALESCE($3, password), is_active = COALESCE($4, is_active) WHERE id = $5 RETURNING *;  
        `,
        [name, age, password, is_active, id]
      )
      
      if(result.rows.length === 0){
        return res.status(404).json({
          success: false,
          message: "User not found"
        })
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully", 
        data: result.rows[0]
      })
    } catch (error:any) {
      res.status(500).json({
        message: error.message,
        error: error
      })
    }

})

app.delete('/api/users/:id', async(req:Request, res:Response) => {
    const {id} = req.params;
    try {
      const result = await pool.query(`
        DELETE FROM users WHERE id = $1 RETURNING *;  
        `,
        [id]
      )
      
      if(result.rows.length === 0){
        return res.status(404).json({
          success: false,
          message: "User not found"
        })
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully", 
        data: result.rows[0]
      })
    } catch (error:any) {
      res.status(500).json({
        message: error.message,
        error: error
      })
    }

})

export default app
