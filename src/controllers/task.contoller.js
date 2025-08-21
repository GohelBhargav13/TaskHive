import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { ApiError } from "../utills/api-error.js";
import {ApiResponse} from "../utills/api-response.js"

const gettasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    if (!projectId) {
      return res.status(404).json(new ApiError(404, "project id was missing"));
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    const tasks = await Task.find({
      project: projectId,
    }).populate("assignTo", "username");

    if (tasks.length == 0) {
      return res.status(400).json(new ApiError(400, "no task are available"));
    }

    return res.status(200).json(
      new ApiResponse(200, {
        message: "tasks are Found Successfully",
        tasks,
      }),
    );
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal error in fetching tasks"));
  }
};

const gettaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json(new ApiError(404, "Task are not found"));
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, { message: "Task Fetched Successfully", task }),
      );
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal error in fetching task"));
  }
};

const createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignTo,status } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    const newTask = await Task.create({
      title,
      description,
      project: projectId,
      assignBy: req.user.id,   // ✅ fixed typo
      assignTo,
      status
    });

    req.task = newTask._id;
    console.log(req.task);

    // console.log(newTask);

    return res.status(201).json(
      new ApiResponse(201, {
        newTask,
        message: "Task Created Successfully",
      }),
    );
  } catch (error) {
    console.error(error); // ✅ log the error
    res.status(500).json(new ApiError(500, "Internal error while creating task"));
  }
};

const updatetask = async (req, res) => {
  const { taskId} = req.params;
  const { title, description, status } = req.body;

  try {
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json(new ApiError(404, "tasks not found"));
    }

    const Updatedtask = await Task.findByIdAndUpdate(
      taskId,
      { title, description,status },
      { new: true },
    ).populate("assignBy", "username");

    return res
      .status(200)
      .json(new ApiResponse(200, Updatedtask, "Tasks Updated Successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Error to update note");
  }
};

const deletetask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      throw new ApiError(404, "Task not found");
    }

    console.log(deletedTask);
    return res
      .status(201)
      .json(new ApiResponse(201, deletedTask, "Task Deleted Successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal error to deleting note"));
  }
};

export { gettasks, gettaskById, createTask, updatetask, deletetask };
