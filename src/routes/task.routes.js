import { Router } from "express";
import { validateTaskAdd } from "../middlewares/validatepermission.middleware.js";
import { AvailableUserRole } from "../utills/constant.js";
import { createTask, deletetask, gettaskById, gettasks, updatetask } from "../controllers/task.contoller.js";
import IsLoggedIn from "../middlewares/user.middleware.js";

const taskRoute = Router()

taskRoute.post("/:projectId",IsLoggedIn,validateTaskAdd([AvailableUserRole.PROJECT_LEAD,AvailableUserRole.PROJECT_MEMBER]),createTask)
taskRoute.post("/updatetask/:projectId/:taskId",IsLoggedIn,validateTaskAdd([AvailableUserRole.PROJECT_LEAD,AvailableUserRole.PROJECT_MEMBER]),updatetask)
taskRoute.get("/deletetask/:projectId/:taskId",IsLoggedIn,validateTaskAdd([AvailableUserRole.PROJECT_LEAD,AvailableUserRole.PROJECT_MEMBER]),deletetask)
taskRoute.get("/getalltask/:projectId",IsLoggedIn,gettasks)
taskRoute.get("/gettask/:taskId",IsLoggedIn,gettaskById)

export default taskRoute;