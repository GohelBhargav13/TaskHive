import express from "express";
import { validateMemAdd } from "../middlewares/validatepermission.middleware.js";
import { AvailableUserRole } from "../utills/constant.js";
import IsLoggedIn from "../middlewares/user.middleware.js";
import { addMember, removeMember, showAllMembers } from "../controllers/projectmemeber.controller.js";


const projectmem = express.Router();


projectmem.post("/:projectId",IsLoggedIn,validateMemAdd([AvailableUserRole.PROJECT_LEAD]),addMember);
projectmem.post("/:projectId",IsLoggedIn,validateMemAdd([AvailableUserRole.PROJECT_LEAD]),removeMember);
projectmem.get("/:projectId",IsLoggedIn,showAllMembers);

export default projectmem;