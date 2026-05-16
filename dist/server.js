import express, {} from 'express';
import { Pool } from 'pg';
import config from './config/index.js';
const app = express();
const port = config.database.port;
// 8mZ.LXKX4u.!H85
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
//this pool /setu thet connect setver to database neodb
const pool = new Pool({
    connectionString: config.database.connectionString
});
const initDB = async () => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      email VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(50) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      age INT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`);
        console.log("Database initialized successfully");
    }
    catch (error) {
        console.log(error);
    }
};
initDB();
app.get('/', (req, res) => {
    res.status(200).json({
        "message": "Success",
        "author": "Sabbir Ahmed Jony"
    });
});
app.post('/api/users', async (req, res) => {
    // console.log(req.body)
    // const body =req.body
    const { name, email, password, age } = req.body;
    try {
        const result = await pool.query(`INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4)RETURNING *`, [name, email, password, age]);
        // console.log(result)
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT * FROM users;
      `);
        res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            data: result.rows
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});
app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
      SELECT * FROM users WHERE id = $1
      `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, password, is_active } = req.body;
    console.log(id, name, age, password, is_active);
    try {
        const result = await pool.query(`
        UPDATE users SET name = COALESCE($1, name), age = COALESCE($2, age), password = COALESCE($3, password), is_active = COALESCE($4, is_active) WHERE id = $5 RETURNING *;  
        `, [name, age, password, is_active, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
        DELETE FROM users WHERE id = $1 RETURNING *;  
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=server.js.map