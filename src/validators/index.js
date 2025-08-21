import { body } from "express-validator";
import { ApiError } from "../utills/api-error.js";
import {User} from "../models/users.models.js";

const userRegisterationValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is Required")
      .isEmail().withMessage("Invalid Email")
      .custom(async (value) => {
        // Custom more check in validation
        const exsistingUser = await User.findOne({ email: value });
        if (exsistingUser) {
          throw new ApiError(400, "This Email is Already exists");
        }
      }),
    body("username")
      .trim()
      .notEmpty().withMessage("username is required")
      .isLength({ min: 3, max: 10 }).withMessage("Username should be with 3 to 10 char"),

    body("password")
      .trim()
      .notEmpty().withMessage("Password Field is Required")
      .isLength({ min:8,max:8 }).withMessage("Password Should be exactly 8 letters")
  ];
};

const userLoginValidation = () => {
    return [

        body("email")
            .trim()
            .notEmpty().withMessage("Email Field is required")
            .isEmail().withMessage("Inavalid Email"),
        body("password")
            .trim()
            .notEmpty().withMessage("Password Field is Required")
            .isLength({ min:8,max:8 }).withMessage("Password Should be exactly 8 letters")


    ]
}

const createProjectVal = () => {
  return [
      body("name")
        .trim()
        .notEmpty().withMessage("Name Field is Required")
        .isLength({ min:3,max:50 }).withMessage("Name of Project is should be 3 to 10 char range"),

      body("description")
          .trim()
          .notEmpty().withMessage("Sescription Field is Required")
  ]
}

const createNoteVal = () => {
  return [
    body("content")
      .trim()
      .notEmpty().withMessage("Content is required for creating a note")
  ]
}

const createTask = () => {
  return[
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required for creating task")
        .isLength({ min:5,max:100 }).withMessage("title should be between min char of 5 and maxmum of 100"),
    body("description")
          .trim()
          .notEmpty().withMessage("description is required for the creating a task"),
    body("status")
        .trim()
        .isEmpty()
  ]
}

const createSubTaskVal = () => {
  return [
      body("title")
          .trim()
          .notEmpty().withMessage("Title is required Field")
          .isLength({ min:5,max:100 }).withMessage("title should be between min char of 5 and maxmum of 100")
  ]
} 

export { userRegisterationValidation,userLoginValidation,createProjectVal,createNoteVal,createTask,createSubTaskVal };
