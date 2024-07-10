import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";


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
    //   avatar: {
    //     public_id: email,
    //     secure_url: "",
    //   },
    });

    // Todo: file upload

    user.password = undefined;
    console.log('Going to generate token ');
    const token = await user.generateJWTToken();
    console.log('Token generated', token);
    res.cookie("token", token, cookieOptions);
    console.log('sending cookie', res.get('Set-Cookie'));

    
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

export { register, login, logout, getProfile };
