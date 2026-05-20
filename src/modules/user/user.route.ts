
import { Router } from "express";
import { userController } from "./user.controller.js";
import auth from "../../middleweare/auth.js";



const router = Router()


router.post('/', userController.createUser);

router.get('/', auth(), userController.getAllUsers );

router.get('/:id', userController.getSingleUser );

router.put('/:id', userController.updateUser );

router.delete('/:id', userController.deleteUser )

export const userRouter = router;
