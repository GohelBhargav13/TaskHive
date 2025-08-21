import { Router } from "express"
import IsLoggedIn from "../middlewares/user.middleware.js"
import { createSubTask, deletesubtask, getsubtask, subTaskFetchById, updatesubTask } from "../controllers/subtask.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createSubTaskVal } from "../validators/index.js"

const subtaskRoutes = Router();

subtaskRoutes.post("/newsubtask/:taskId",IsLoggedIn,createSubTaskVal(),validate,createSubTask)
subtaskRoutes.get("/getall/:taskId",IsLoggedIn,getsubtask)
subtaskRoutes.get("/fetchbyid/:subtaskId",IsLoggedIn,subTaskFetchById)
subtaskRoutes.post("/updatesubtask/:subtaskId",IsLoggedIn,updatesubTask)
subtaskRoutes.post("/deletesubtask/:subtaskId",IsLoggedIn,deletesubtask)

export default subtaskRoutes