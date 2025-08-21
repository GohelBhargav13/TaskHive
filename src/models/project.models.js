import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{ timestamps:true })

export const Project = mongoose.model("Project",ProjectSchema);