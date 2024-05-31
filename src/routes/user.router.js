import {Router} from "express"
import { loginUser, logoutUser, refreshAndAccessToken, registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
const router = Router()


router.route("/register").post(upload.single("avatar"), registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refresh-access-token").post(refreshAndAccessToken)

export default router

