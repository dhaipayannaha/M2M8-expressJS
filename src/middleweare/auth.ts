import type { NextFunction, Response, Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/index.js";
import { pool } from "../db/index.js";
const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // console.log("this is protector");
        // console.log(req.headers.authorization)
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not Authorized"
            })
        }

        const decoded = jwt.verify(token as string, config.database.secret as string) as JwtPayload;
        const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1;
        `, [decoded.email]);



        const user = userData.rows[0];
        console.log(user);

        if(userData.rows.length === 0){
            return res.status(401).json({
                success: false,
                message: "You are not Authorized"
            })
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: "Your account is not active"
            })
        }

        next()
    }

}
export default auth