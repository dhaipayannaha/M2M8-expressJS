import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
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
        role : user.role,
        is_active: user.is_active,
        email: user.email,
    }

    // genarate tocken
    const accessTokn = jwt.sign(jwtpayload, config.database.secret as string, {expiresIn: "1d"})
    

    const refreshTokn = jwt.sign(jwtpayload, config.database.refresh_secret as string, {expiresIn: "10d"})

    return {accessTokn, refreshTokn};
    // 
}

const generateFreshToken = async(token: string) => {

        if (!token) {
            throw new Error("Forbidden")
        }

        const decoded = jwt.verify(token as string, config.database.refresh_secret as string) as JwtPayload;
        const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1;
        `, [decoded.email]);



        const user = userData.rows[0];
        console.log(user);

        if(userData.rows.length === 0){
            throw new Error("User not Found")
        }

        if (!user?.is_active) {
           throw new Error("Forbidden")
        }


        const jwtpayload = {
        id : user.id,
        name: user.name,
        role : user.role,
        is_active: user.is_active,
        email: user.email,
    }

    // genarate tocken
    const accessTokn = jwt.sign(jwtpayload, config.database.secret as string, {expiresIn: "10d"})
    //ai expairy day asbe .env thake

    return accessTokn
}

export const authService = {
    loginUserIntoDB,
    generateFreshToken
}