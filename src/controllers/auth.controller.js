import { ApiResponse } from "../utills/api-response.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utills/api-error.js";
import { emailVerificationMailGenContent, sendMail } from "../utills/mail.js";


const userRegister = async (req, res) => {
  //get user data
  const { email, password, username } = req.body;

  try {
    //fetch user for existing user or note
    const existinguser = await User.findOne({ email });

    if (existinguser) {
      return res.status(400).json(new ApiError(400, "User is Already Exist"));
    }

    //create a new User
    const newUser = await User.create({
      email,
      username,
      password,
    });

    if (!newUser) {
      return res.status(400).json(new ApiError(400, "user not created"));
    }

    //email verification
    const { unHashedToken, hashedToken, TokenExpiry } = newUser.generateEmailToken();
    newUser.emailVerificationToken = hashedToken;
    newUser.emailVerificationExpiry = TokenExpiry;

    await newUser.save();

    // console.log(newUser);

    await sendMail({
      email: newUser.email,
      subject: "Email Verification",
      mailgenContent: emailVerificationMailGenContent(username, unHashedToken),
    });

    res
      .status(200)
      .json(
        new ApiResponse(201, {
          user: { email, username },
          message: "User Registration Successfully",
        }),
      );
  } catch (error) {
    res.status(401).json(new ApiError(401, { message: "user not registerd" }));
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.params;
  //    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json(new ApiError(404, "Token Not Found"));
    }

    user.IsVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save();

    res
      .status(201)
      .json(
        new ApiResponse(201, { message: "Email Verification Successfull" }),
      );
  } catch (error) {
    res.status(404).json(new ApiError(404, "Token not Found", error));
  }
};

const loginuser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    //If user found than check password
    const isMatched = await user.isPasswordCorrect(password);
    if (!isMatched) {
      return res.status(401).json(new ApiError(401, "Password not matched"));
    }

    //set the access token into the user-model
    const accessToken = await user.generateAccessToken();
    res.cookie("accesstoken", accessToken, { httpOnly: true });

    //set the refresh token into the user-model

    const refreshToken = await user.generateRefreshToken();
    res.cookie("refreshtoken", refreshToken, { httpOnly: true }); // OPTIONAL(WE HAVE A FIELD IN DB)
    user.refreshtoken = refreshToken;

    await user.save();

    return res
      .status(201)
      .json(new ApiResponse(201, { message: "User LoggedIn SuccessFully" }));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Invalid Credatial", error));
  }
};

const getMe = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).select("-password -IsVerified -createdAt -updatedAt -refreshtoken -_id -__v");
    if (!user) {
      return res
        .status(404)
        .json(new ApiError(404, "User not Found"));
    }

    res.status(201).json(new ApiResponse(201,user))

  } catch (error) {
        res.status(400).json(new ApiError(400,"You're not LoggedIn"))
  }
}


const logoutUser = async (req, res) => {
 try {
   const clearedCookieAcc = res.cookie('accesstoken','',{ httpOnly:true});
   const clearedCookieRef = res.cookie('refreshtoken','',{ httpOnly:true});
  //  console.log(clearedCookie);

   if(!clearedCookieAcc || !clearedCookieRef){
     return res.status(400).json({
       success:false,
       message:"Cookie is not cleared"
     })
   }
 
   res.status(200).json({
     sucess:true,
     message:"Logout sucessfully"
   })
 } catch (error) {
    res.status(500).json({
      sucess:false,
      message:"Internal Error"
    })
 }
};
export { userRegister, verifyUser, loginuser, getMe,logoutUser };
