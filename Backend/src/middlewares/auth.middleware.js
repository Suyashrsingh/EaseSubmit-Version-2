import {asyncHandler} from "../utils/async-handler.js"
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import User from "../models/users.model.js"; 

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new ApiError(404, "No token found");
  }

  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  req.user = user;
  next();
});
