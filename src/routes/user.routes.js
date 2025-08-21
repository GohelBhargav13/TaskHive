import {Router} from "express"
import { userLoginValidation, userRegisterationValidation } from "../validators/index.js"
import { validate } from "../middlewares/validate.middleware.js"
import { getMe, loginuser, logoutUser, userRegister, verifyUser } from "../controllers/auth.controller.js"
import IsLoggedIn from "../middlewares/user.middleware.js"

const userRoutes = Router()

//factory pattern is here for the express-validator
userRoutes.post("/register",userRegisterationValidation(),validate,userRegister)
userRoutes.get("/verify/:token",verifyUser);
userRoutes.post("/login",userLoginValidation(),validate,loginuser)
userRoutes.get("/me",IsLoggedIn,getMe)
userRoutes.get("/logout",IsLoggedIn,logoutUser)

export default userRoutes;