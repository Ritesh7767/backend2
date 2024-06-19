import { Router } from "express";
import { userDelete, userLoggout, userLogin, userProfile, userRegister } from "../controllers/user.controller";
const router = Router()

router.route('/register').post(userRegister)
router.route('/login').post(userLogin)
router.route('/profile').post(userProfile)
router.route('/logout').post(userLoggout)
router.route('/delete').post(userDelete)

export default router