import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {AvailableUserRole,UsersRoles} from "../utills/constant.js"
import crypto from "crypto";

const userSchema = new mongoose.Schema({

    email:{
        type:String,
        unique:true,
        required:[true,"Email is Required"],
        trim:true
    },
      username:{
        type:String,
        unique:true,
        required:[true,"username is Required"],
        trim:true,
        index:true
    },
      password:{
        type:String,
        required:[true,"Password is Required"],
        trim:true
    },
    role:{
        type:String,
        enum:UsersRoles,
        default:AvailableUserRole.PROJECT_MEMBER
    },
      IsVerified:{
        type:Boolean,
        default:false
    },
    emailVerificationToken:{
        type:String,
    },
    emailVerificationExpiry:{
        type:Date,
    },
    forgetpasswordToken:{
        type:String
    },
    forgetpassworexpiry:{
        type:Date
    },
    refreshtoken:{
        type:String
    },
    refreshtokeexpiry:{
        type:Date,
    }

},{ timestamps:true })

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({ 
        id:this._id
    },process.env.JWT_SECRET,{ expiresIn:process.env.EXPIRESIN }) 
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({ 
        id:this._id
    },process.env.JWT_SECRET_REFRESH,{ expiresIn:process.env.EXPIRESIN_REFRESH }) 
}

userSchema.methods.generateEmailToken = function(){
   const unHashedToken = crypto.randomBytes(32).toString("hex");
   const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
   const TokenExpiry = Date.now() + (20*60*1000);

   return { unHashedToken,hashedToken,TokenExpiry };
}
export const User = mongoose.model("User",userSchema);
