import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utills/api-error.js";
import { ApiResponse } from "../utills/api-response.js";
import { UsersRoles } from "../utills/constant.js";

const addMember = async (req, res) => {
  const { projectId } = req.params;
  const { userId, role } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    if (!UsersRoles.includes(role)) {
      return res
        .status(404)
        .json(new ApiError(404, "This role is not available"));
    }

    const newProjectMem = await ProjectMember.create({
      project: projectId,
      user: userId,
      role,
    });

    res
      .status(200)
      .json(new ApiResponse(200, newProjectMem, "Member Added Sucessfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal Error to add member"));
  }
};

const removeMember = async (req, res) => {
  const { projectId } = req.params;
  const { userId, role } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    if (!UsersRoles.includes(role)) {
      return res
        .status(404)
        .json(new ApiError(404, "This role is not available"));
    }

    const deletedUser = await ProjectMember.findByIdAndDelete(userId);

    res
      .status(200)
      .json(new ApiResponse(200, deletedUser, "Member deleted Sucessfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal Error to remove member"));
  }
};

const showAllMembers = async (req, res) => {
  const { projectId } = req.params;

  try {

    const project = await Project.findById(projectId);
    if(!project){
        return res.status(404).json(new ApiError(404,"Project not found"));
    }

    const allUser = await ProjectMember.find({
        project:projectId
    }).select("-createdAt -updatedAt -__v -_id").populate("user","username")

    res.status(200).json(new ApiResponse(200,"Member's fetched successfully",allUser))

  } catch (error) {
    return res.status(500).json(new ApiError(500,"Internal Error to fetch members"))
  }
};

export { addMember, removeMember,showAllMembers };
