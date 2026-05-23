import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";
import type { IUser } from "./user.interface.js";



const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, age, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(`INSERT INTO users (name, email, password, age, role) VALUES ($1, $2, $3, $4, COALESCE($5, 'user'))RETURNING *`, [name, email, hashPassword, age, role]);
  delete result.rows[0].password;
  return result;
}

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
      SELECT * FROM users;
      `)
  return result;
}

const getSingleUserFromDB = async (id: number) => {
  const result = await pool.query(`
      SELECT * FROM users WHERE id = $1
      `, [id])
  return result
}

const updateUserFromDB = async (id: number, payload: IUser) => {
  const { name, email, password, age, is_active } = payload;
  const result = await pool.query(`
        UPDATE users SET name = COALESCE($1, name), age = COALESCE($2, age), password = COALESCE($3, password), is_active = COALESCE($4, is_active) WHERE id = $5 RETURNING *;  
        `,
    [name, age, password, is_active, id]
  )

  
  //in postmen when shows result then show without password
  return result
}

const deleteUserFromDB = async (id: number) => {
  const result = await pool.query(`
        DELETE FROM users WHERE id = $1 RETURNING *;  
        `,
    [id]
  )
  return result
}
export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB
}