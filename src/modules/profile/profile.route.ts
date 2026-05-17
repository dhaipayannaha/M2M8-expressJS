import { Router } from "express";
import { ProfileController } from "./profile.controller.js";

const router = Router()

router.post('/', ProfileController.createProfile)

export const profileRouter = router;
