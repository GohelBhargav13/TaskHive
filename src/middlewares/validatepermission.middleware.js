import { ApiError } from "../utills/api-error.js"
import { ProjectMember } from "../models/projectmember.models.js";
import mongoose from "mongoose";
import { User } from "../models/users.models.js";
import { Task } from "../models/task.models.js"
import { Project } from "../models/project.models.js";
import { ApiResponse } from "../utills/api-response.js";

export const validateProjectPermission = (roles = []) => { return async(req,res) => {
    try {

        const { projectId } = Number(req.params);

        if(!projectId){
            throw new ApiError(401,"Project Not Found");
        }

        const projectMember = await ProjectMember.findOne({ 
            project:mongoose.Types.ObjectId(projectId),
            user:mongoose.Types.ObjectId(req.user.id)
        })

         if(!projectMember){
            throw new ApiError(404,"Invalid Project");
        }

        const givenRole = projectMember?.role;
        console.log(givenRole);

        req.user.role = givenRole;

        if(!roles.includes(givenRole)){
            throw new ApiError(403,"You do not have permission to perform this action")
        }
        
    } catch (error) {
        return res.status(500).json(new ApiError(500,"Internal error here"))
    }

}
}

export const validateProjectCreate = (roles = []) => { return async(req,res,next) => {
    try {
        
       const user =  await User.findById(req.user.id);
       if(!user){
        return res.status(404).json(new ApiError(404,"User not found"));
       }

       const userRole = user.role;

       if(!roles.includes(userRole)){
        return res.status(400).json(new ApiError(400,"You have not permission to create project"))
       }

       next();

    } catch (error) {
        next(error)
        return res.status(500).json(new ApiError(500,"internal Error in server Here"))
    }
}
}

export const validateMemAdd = (roles = []) => { return async(req,res,next) => {
    const { projectId } = req.params;
    try {

        if(!projectId){
           return res.status(404).json(new ApiError(404,"Project not found"))
        }

        const findMember = await ProjectMember.findOne({
            project:projectId,
            user:req.user.id
        })

        console.log(findMember);

         if(!findMember){
            return res.status(404).json(new ApiError(404,"Member not found"))
        }

        const givenRoles = findMember.role
        console.log(givenRoles);

        if(!roles.includes(givenRoles)){
            return res.status(400).json(new ApiError(400,"You have not a permission to add or remove members"))
        }
        next();
    } catch (error) {
         return res.status(500).json(new ApiError(500,"Internal error here",error))
    }

}
}

export const validateTaskAdd = (roles = []) => {
    return async(req,res,next) => {
        const { projectId } = req.params;
        try {

            const project = await Project.findById(projectId);
            if(!project){
                return res.status(404).json(new ApiError(404,"Project not found"))
            }

            const projectmember = await ProjectMember.find({
                project:projectId
            })

            const filterRoles = projectmember.filter((user) => (roles.includes(user.role) && user.user == req.user.id))
            console.log(filterRoles);

            if(filterRoles.length == 0){
                return res.status(400).json(new ApiError(400,"You have not part of this project"))
            }

            next();
        } catch (error) {
           return res.status(500).json(new ApiError(500,"Internal Error in validate roles")) 
        }
    }
}
