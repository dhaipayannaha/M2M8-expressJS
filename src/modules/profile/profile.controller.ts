import type { Request, Response } from "express";
import { ProfileService } from "./profile.service.js";

const createProfile = async (req: Request, res: Response) => {
    try {
        const result = await ProfileService.createProfileIntoDB(req.body);
        res.status(201).json({
            success: true,
            message: "Profile created successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
        message: error.message,
        error: error
      })
    }
}



export const ProfileController = {
    createProfile
}