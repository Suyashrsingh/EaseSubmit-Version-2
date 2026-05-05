import mongoose from 'mongoose'
import User from '../models/users.model.js';
import {asyncHandler} from '../utils/async-handler.js'
import {ApiError} from '../utils/api-error.js'; 
import {ApiResponse} from "../utils/api-response.js"



export const registerUser = asyncHandler(async(req,res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        throw new ApiError(400,"All fields are required")
    }
    const existingUser = await User.findOne({email})
    if(existingUser) {
        throw new ApiError(409,"User already exists")
    }
    const user = await User.create({
        name,
        email,
        password,
        className: req.body.className? req.body.className : "null",
        division: req.body.division? req.body.division : "null",
        role: req.body.role? req.body.role : "Teacher"
    })
    if(!user){
        throw new ApiError(500,"Error while creating user")
    }
    const userData = await User.findById(user._id).select("-password")
    return res.status(201).json(new ApiResponse(201,userData,"User registered successfully"))
})

export const login = asyncHandler(async(req,res) => {
    const { email, password } = req.body;
    console.log(email, password)
    if(!email || !password) {
        throw new ApiError(400,"Email and password are required")
    }   
    const user = await User.findOne({email})
    console.log(user)
    if(!user) {
        throw new ApiError(404,"User not found")
    }
    const isMatched = await user.comparePassword(password)
    if(!isMatched) {
        throw new ApiError(401,"Invalid credentials")
    }
    const accessToken = user.generateAccessToken()
    const userData = await User.findById(user._id).select("-password")
    return res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    }).
    status(200).json(new ApiResponse(200,userData, "User logged in successfully"))
})

export const changePassword = asyncHandler(async (req, res) => {
  if(req.user.role === "student") {
    throw new ApiError(400, "Students are not allowed to change password")
  }
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;
  if (!userId || !oldPassword || !newPassword) {
    throw new ApiError(401, "All fields are required");
  }
  const user = await User.findById( userId );
  if (!user) {
    throw new ApiError(404, "No User found");
  }
  const isMatched = await user.comparePassword(oldPassword);
  if (!isMatched) {
    throw new ApiError(401, "You have entered wrong Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  const user1 = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user1, "Password Changed Succesfully"));
});