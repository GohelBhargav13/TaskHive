import mongoose from "mongoose";
import { AvailableTask, TaskAre } from "../utills/constant.js";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    assignTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    assignBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:TaskAre,
        default:AvailableTask.TODO
    },
    attachments:{
        type:[
        {
            url:String,
            mimeType:String,
            size:Number
        }
    ],
    default:[]
    }
},{ timestamps:true });

export const Task = mongoose.model("Task",taskSchema);