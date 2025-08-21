import {ApiError} from "./api-error.js"
const asyncHandlerFunction = (requestHandler) => {
    return function(req,res,next){
        Promise.resolve(() => {
            requestHandler(req,res,next)
        })
        .catch((err) => { throw new ApiError(400,"There is some error in asynchandler",err) } )
    }
}

export { asyncHandlerFunction }