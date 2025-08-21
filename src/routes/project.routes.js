import { Router } from "express";
import { createProjectVal } from "../validators/index.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProject, deleteProject, onlyUserProjectFetched, projectFetchByName, updateProjctDetails } from "../controllers/project.controller.js"
import IsLoggedIn from "../middlewares/user.middleware.js";
import { validateProjectCreate } from "../middlewares/validatepermission.middleware.js";
import { AvailableUserRole } from "../utills/constant.js";

const projectRoutes = Router()

projectRoutes.post("/newproject",IsLoggedIn,createProjectVal(),validate,validateProjectCreate([AvailableUserRole.PROJECT_LEAD]),createProject) // factory Function used
projectRoutes.get("/findproject/:projectname",IsLoggedIn,projectFetchByName) 
projectRoutes.get("/myproject",IsLoggedIn,onlyUserProjectFetched)
projectRoutes.get("/deleteproject/:projectname",IsLoggedIn,deleteProject)
projectRoutes.get("/updateproject/:projectname",IsLoggedIn,updateProjctDetails)

export default projectRoutes;