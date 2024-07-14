import AppError from "../utils/error.util.js"; // Ensure this path is correct
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
  let token;

  // Check if the token is in the cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Alternatively, check if the token is in the authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Token not received ! please login again", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new AppError("Invalid token, please log in again", 401));
  }
};

const authorizedRoles = (...roles) => async(req,res,next) => {
    const currentUserRole  =  req.user.role;
    if(!roles.includes(currentUserRole)){
      return next(new AppError("You don't have access for this !",400))
    }

    next();
}

export{
  isLoggedIn,
authorizedRoles
}