
import { Note } from "../models/notes.models.js";
import {Project} from "../models/project.models.js";
import { ApiError } from "../utills/api-error.js";
import { ApiResponse } from "../utills/api-response.js";

const getnotes = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    console.log(projectId);

    if (!project) {
      throw new ApiError(404, "Project not Found");
    }

    const notes = await Note.find({
      project: projectId,
    }).populate("createdBy", "username fullName avatar").select("-createdAt -updatedAt -__v");

    if(notes.length == 0){
      throw new ApiError(404,"notes not found from this project");
    }

   return res.status(200).json(
        new ApiResponse(200, { message: "Notes Found Successfully", notes }),
      );

  } catch (error) {
    throw new ApiError(500,"Internal Server Error to fetch a notes")
  }
};

const getnotById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId).populate(
      "createdBy",
      "username fullName avatar",
    );

    if (!note) {
      throw new ApiError(404, "note not Found");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, { message: "Note Fetched Successfully" }));
  } catch (error) {
    throw new ApiError(500, "internal Error in fetch note by id");
  }
};

const createdNote = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content } = req.body;


    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project not Found");
    }

    const newNote = await Note.create({
      project: projectId,
      createdBy: req.user.id,
      content,
    });

    const findUser = await Note.findById(newNote._id).populate(
      "createdBy",
      "fullName username avatar",
    );

 res.status(201).json(
      new ApiResponse(201, {
        findUser,
        message: "Note Created Successfully",
      }),
    );
  } catch (error) {
    throw new ApiError(500, "Internal Error in creating Note",error);
  }
};

const updatenote = async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;

  try {
    const existingNote = await Note.findById(noteId);
    if (!existingNote) {
     return res.status(404).json(new ApiError(404,"notes not found"))
    }

    const Updatednote = await Note.findByIdAndUpdate(
      noteId,
      { content },
      { new: true },
    ).populate("createdBy", "username");

    return res
      .status(200)
      .json(new ApiResponse(200, updatenote,Updatednote, "Note Updated Successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Error to update note");
  }
};

const deletenote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      throw new ApiError(404, "Note not found");
    }
  
    console.log(deletedNote);
    return res
      .status(201)
      .json(new ApiResponse(201, deletedNote, "Note Deleted Successfully"));
  } catch (error) {
      return res.status(500).json(500,"Internal Error to delete notes")
  } 
};

export { getnotes, createdNote, getnotById, updatenote, deletenote };
