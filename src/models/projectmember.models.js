import mongoose from "mongoose";
import {AvailableUserRole,UsersRoles} from "../utills/constant.js"
const ProjectMemSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    role:{
        type:String,
        enum:UsersRoles,
        default:AvailableUserRole.PROJECT_MEMBER
    }
},{ timestamps:true });

export const ProjectMember = mongoose.model("ProjectMember",ProjectMemSchema);