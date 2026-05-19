import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";
import jwt from "jsonwebtoken";
import config from "../../config/index.js";

const loginUserIntoDB = async (payload:{email:string, password:string}) => {
    const {email, password} = payload;

    //1. caheck if the user exists
    //2. Compare the password
    //3 Genarate token

    const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if(userData.rows.length === 0){
        throw new Error("User not found");
    }
    
    const user = userData.rows[0];
    

    const matchPassword = await bcrypt.compare(password, user.password);
    console.log(matchPassword)

    if(!matchPassword){
        throw new Error("Invalid password");
    }


    const jwtpayload = {
        id : user.id,
        name: user.name,
        is_active: user.is_active,
        email: user.email,
    }

    // genarate tocken
    const accessTokn = jwt.sign(jwtpayload, config.database.secret as string, {expiresIn: "1d"})

    return {accessTokn};
    // 
}

export const authService = {
    loginUserIntoDB
}