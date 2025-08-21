import { ApiError } from "../utills/api-error.js";
import { ApiResponse } from "../utills/api-response.js";
import { asyncHandlerFunction } from "../utills/async-handler.js";

const healthCheck = async (req, res) => {
  try {
    console.log("HealthChecked");
    res.status(200).json(new ApiResponse(200, { message: "App is Running" }));
  } catch (error) {
    throw new ApiError(500, "Internal Error in server");
  }
};

export { healthCheck };
