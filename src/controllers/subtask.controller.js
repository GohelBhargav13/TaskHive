import { subTask } from "../models/subtask.models.js";
import { Task } from "../models/task.models.js";
import { ApiError } from "../utills/api-error.js";
import { ApiResponse } from "../utills/api-response.js";

const createSubTask = async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json(new ApiError(404, "Task not found"));
    }

    const newSubTask = await subTask.create({
      title,
      task: taskId,
      createdBy: req.user.id,
    });

    await newSubTask.save();

    const createUser = await subTask
      .findById(newSubTask._id)
      .populate("createdBy", "username");

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { createUser, newSubTask },
          "SubTask Created Successfully",
        ),
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error to creating subTask"));
  }
};

const getsubtask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const subtasks = await Task.findById(taskId);
    if (!subtasks) {
      return res.status(404).json(new ApiError(404, "Task is not found"));
    }

    const allsubtasks = await subTask
      .find({ task: taskId })
      .select("-__v -_id -createdAt -updatedAt -task");
    if (!allsubtasks) {
      return res
        .status(404)
        .json(new ApiError(404, "Subtasks are not available"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allsubtasks,
          "All Subtasks are fetched Successfully",
        ),
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error to fetch all subtasks"));
  }
};

const subTaskFetchById = async (req, res) => {
  const { subtaskId } = req.params;
  try {
    const subtasks = await subTask
      .findById(subtaskId)
      .select("-__v -_id -createdAt -updatedAt -task");
    if (!subtasks) {
      return res.status(404).json(new ApiError(404, "SubTasks is not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, subtasks, "Subtask fetch Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal error to fetch subtask by id"));
  }
};

const updatesubTask = async (req, res) => {
  const { subtaskId } = req.params;
  const { title, isCompleted } = req.body;
  try {
    const subtask = await subTask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json(new ApiError(404, "SubTask is not found"));
    }

    const updatedsubTask = await subTask
      .findByIdAndUpdate(subtaskId, { title, isCompleted }, { new: true })
      .select("-__v -createdAt -updatedAt -task");

      const finduser = await updatedsubTask.populate("createdBy","username");

      res.status(200).json(new ApiResponse(200,{finduser},"SubTask is updated Successfully"))
  } catch (error) {
        res.status(500).json(new ApiError(500,"Internal Error in updating subtasks"))
  }
};

const deletesubtask = async(req,res) => {
    const { subtaskId } = req.params
    
    try {

        const subtask = await subTask.findById(subtaskId);
        if(!subtask){
            return res.status(404).json(new ApiError(404,"Subtask is not found"))
        }

        const deletedSubTask = await subTask.findByIdAndDelete(subtaskId).select("- _id -__v -task -createdAt -updatedAt")

        res.status(200).json(new ApiResponse(200,deletedSubTask,"SubTask Deleted Successfully"))
        
    } catch (error) {
        res.status(500).json(new ApiError(500,"Internal Error in deleting subTask"))
    }
}

export { createSubTask, getsubtask, subTaskFetchById ,updatesubTask,deletesubtask};
