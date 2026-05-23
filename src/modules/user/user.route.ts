
import { Router } from "express";
import { userController } from "./user.controller.js";
import auth from "../../middleweare/auth.js";
import { USER_ROLE } from "../../types/index.js";



const router = Router()


router.post('/', userController.createUser);

router.get('/', auth(USER_ROLE.admin, USER_ROLE.agent), userController.getAllUsers );

router.get('/:id', userController.getSingleUser );

router.put('/:id', userController.updateUser );

router.delete('/:id', userController.deleteUser )

export const userRouter = router;
