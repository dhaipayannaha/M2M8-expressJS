
import type {Request, Response } from "express";
import { authService } from "./auth.service.js";


const loginUser = async (req:Request, res:Response) => {
    try {
        const result = await authService.loginUserIntoDB(req.body);

        const {refreshTokn} = result;
        res.cookie("refreshToken", refreshTokn , {
            secure : false,
            httpOnly : true,
            sameSite: "lax"
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: result,
        })
    } catch (error:any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
    
}

const refreshToken = async (req:Request, res:Response) => {
     try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken;
        const result = await authService.generateFreshToken(token);

        res.status(200).json({
            success: true,
            message: "Access token genarate",
            data: result,
        })
    } catch (error:any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}

export const authController = {
    loginUser,
    refreshToken
}