import { Router } from "express";
import { AvailableUserRole } from "../utills/constant.js";
import { validateProjectPermission } from "../middlewares/validatepermission.middleware.js";
import IsLoggedIn from "../middlewares/user.middleware.js"
import { createdNote, deletenote, getnotById, getnotes, updatenote } from "../controllers/note.controller.js";
import { createNoteVal } from "../validators/index.js";

const notesRoute = Router()

notesRoute.get("/:projectId",IsLoggedIn,getnotes);
notesRoute.post("/:projectId",IsLoggedIn,createNoteVal(),createdNote)
notesRoute.get("/:noteId",IsLoggedIn,getnotById)
notesRoute.put("/:noteId",IsLoggedIn,createNoteVal(),updatenote);
notesRoute.delete("/:noteId",IsLoggedIn,deletenote);


export default notesRoute;

//TODO: routes of all updated notes controller