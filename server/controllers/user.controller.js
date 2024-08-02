import "dotenv/config";
import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return next(new AppError("All fields are required!", 400));
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(new AppError("Email ID already exists!", 400));
    }

    const user = await User.create({
      fullName,
      email,
      password,
      avatar: req.file ? {
        public_id: req.file.filename,
        secure_url: req.file.path,
      } : {
        public_id: email,
        secure_url: "https://res.cloudinary.com/dmcur395y/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1720752792/samples/cloudinary-icon.png",
      },
    });

    if (!user) {
      return next(
        new AppError("Unalbe to create user ! please try again"),
        500
      );
    }

    // Todo: file upload
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms',
          width: 250,
          height: 250,
          gravity: "faces",
          crop: 'fill',
        });
        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          // Remove file from server
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(
          new AppError(`unable to save avatar : ${error.message}`, 500)
        );
      }
    }

    await user.save();
    user.password = undefined;
    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOptions);
    console.log("sending cookie", res.get("Set-Cookie"));

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return next(new AppError("Unable to create user!", 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("All fields are required!", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Email or password doesn't match", 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      user,
    });
  } catch (error) {
    return next(new AppError("Unable to login!", 500));
  }
};

const logout = (req, res) => {
  res.cookie("token", null, {
    maxAge: 0,
    secure: true,
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    return res.status(200).json({
      success: true,
      message: "Your profile will be displayed below",
      user,
    });
  } catch (error) {
    return next(new AppError("Unable to get user profile", 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is required !", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Given email id doesn't exist !", 400));
  }

  const resetToken = await user.generatePasswordResetToken();
  await user.save();
  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = "Reset Password";
  const message = `${resetPasswordURL}`;
  // function to send email
  try {
    await sendEmail(email, subject, message);
    res.status(200).json({
      success: true,
      message: `Reset password token send to ${email} successfully `,
    });
  } catch (error) {
    user.forgetPasswordExpiry = undefined;
    user.forgetPasswordToken = undefined;
    await user.save();

    return next(new AppError("Unable to send email  !", 400));
  }
};

const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;

  const password = req.body;

  const forgetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = User.findOne({
    forgetPasswordToken,
    forgetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or Expired ! Try again", 404));
  }

  user.password = password;
  user.forgetPasswordExpiry = undefined;
  user.forgetPasswordToken = undefined;

  await user.save();

  return res.status(200).json({
    success: false,
    message: "Your Password has been successfully changed",
  });
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user;
  if (!oldPassword || !newPassword) {
    return next(new AppError("All fields are mendotary !", 404));
  }
  if (oldPassword === newPassword) {
    return next(new AppError("Same as old password  ! ", 404));
  }

  const user = User.findById(id);
  if (!user) {
    return next(new AppError("User doen't exist !", 400));
  }

  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    return next(new AppError("Incorrect old password !", 400));
  }

  user.password = newPassword;
  await user.save();

  user.password = undefined;

  return res.send(200).json({
    success: false,
    message: "Password changed sucessfully",
  });
};

const updateProfile = async (req, res, next) => {
  const { fullName } = req.body;
  const id = req.user.id;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User doesn't exist !", 404));
  }
  if (req.fullName) {
    user.fullName = fullName;
  }
  if (req.file) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: fill,
      });
      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // Remove file from server
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(`unable to save avatar : ${error.message}`, 500)
      );
    }
    await user.save();
    return res.status(200).json({
      success : true,
      message : "Your profile has been updated successfully"
    })
  }
};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
};
