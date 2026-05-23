import type { NextFunction, Response, Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/index.js";
import { pool } from "../db/index.js";
import type { ROLES } from "../types/index.js";

const auth = (...roles : ROLES[]) => {
    console.log(roles)
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(roles)
       try {
         // console.log("this is protector");
        // console.log(req.headers.authorization)

        // 4 type of validation
        //1 check if the token exists
        //2 verify the token
        //3 find the user in db
        //4 check if the user is active

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

        if (!user?.is_active) {
            return res.status(403).json({
                success: false,
                message: "Your account is not active"
            })
        }

        if(roles.length && !roles.includes(user.role)){
             return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource"
             })
        }


        req.user = decoded

        next()
       } catch (error) {
        next(error)
       }
    }

}
export default auth