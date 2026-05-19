import type { NextFunction, Response, Request } from "express";

const auth = () => {
    return async (req:Request, res:Response, next:NextFunction) => {
    // console.log("this is protector");
    // console.log(req.headers.authorization)
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "You are not Authorized"
        })
    }
    next()
}

}
export default auth