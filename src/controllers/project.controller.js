import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utills/api-error.js";
import { ApiResponse } from "../utills/api-response.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { AvailableUserRole } from "../utills/constant.js";

//creating a new Project
const createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const exsistingProject = await Project.findOne({ name });
  
    if (exsistingProject) {
      return res
        .status(401)
        .json(new ApiError(401, "This Project is Already Exsist"));
    }

    const newProject = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });

   const projectmem = await  ProjectMember.create({
      project:newProject._id,
      user:req.user.id,
      role:AvailableUserRole.PROJECT_LEAD
    })

    console.log({newProject,projectmem});

    if (!newProject) {
      return res.status(400).json(new ApiError(400, "Project Not Created"));
    }
     if (!projectmem) {
      return res.status(400).json(new ApiError(400, "Projectmember not added"));
    }
    await newProject.save();
    await projectmem.save();

    res.status(201).json(
      new ApiResponse(201, {
        message: "New Project is Created Successfully",
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Project not created by server", error));
  }
};

//project fetched by a name
const projectFetchByName = async (req, res) => {
  const { projectname } = req.params;
  try {
    if (!projectname) {
      return res.status(404).json(new ApiError(404, "Project Name not Found"));
    }

    const project = await Project.findOne({ name: projectname });
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not Found"));
    }

    res.status(201).json(
      new ApiResponse(201, {
        project: { projectname, description: project.description },
        message: "Project Found",
      }),
    );
  } catch (error) {
    res.status(400).json(new ApiError(400, "This Project is not exsist"));
  }
};

//Only User-Project fetched
const onlyUserProjectFetched = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userProjectFetched = await Project.find({ createdBy: userId }).select(
      "-createdBy -_id -createdAt -updatedAt -__v",
    );
    if (userProjectFetched.length == 0) {
      return res.status(400).json(new ApiError(400, "Sorry! No Project Here"));
    }

    //    userProjectFetched.map((lines) => console.log(lines.name) ) --> It returns a array
    res
      .status(201)
      .json(
        new ApiResponse(201, {
          userProjectFetched,
          message: "Project Fetched Successfully",
        }),
      );
  } catch (error) {
    res.status(401).json(new ApiError(401, "You Have No Project", error));
  }
};

//Delete Project with name
const deleteProject = async (req, res) => {
  const { projectname } = req.params;

  try {
    if (!projectname) {
      return res.status(404).json(new ApiError(404, "Project Not Found"));
    }

    const project = await Project.findOneAndDelete({ name: projectname });
    if (!project) {
      return res
        .status(400)
        .json(new ApiError(400, "Internal Error to delete Project"));
    }

    res
      .status(201)
      .json(
        new ApiResponse(201, {
          project,
          message: "Project Deleted Successfully",
        }),
      );
  } catch (error) {
    res.status(400).json(new ApiError(400, "Project Deletion Failed"));
  }
};

//update a Project-Details
const updateProjctDetails = async (req, res) => {
  const { projectname } = req.params;
  const { name, description } = req.body;

  try {
    if (!projectname) {
      return res.status(404).json(new ApiError(404, "Project Not Found"));
    }

    const updatedDetails = await Project.findOneAndUpdate({
      name,
      description,
    });
    if (!updatedDetails) {
      return res.status(400).json(new ApiError(400, "Details not updated"));
    }

    res.status(201).json(new ApiResponse(201,{ updatedDetails,message:"Details Updated Successfully" }))
  } catch (error) {
    res.status(400).json(new ApiError(400,"Details Updation Failed"))
  }
};

export {
  createProject,
  projectFetchByName,
  onlyUserProjectFetched,
  deleteProject,
  updateProjctDetails,
};
