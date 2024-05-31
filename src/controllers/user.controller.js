import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudianary } from "../utils/uploadOnCloudianary.js";
import { ApiResponse } from "../utils/ApiRespnse.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessTokenAndRefreshToken = async (user_id) => {
  try {
    const user = await User.findById(user_id);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "error occured while genrating the access and refresh Token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // req body me se info nikalenge
  // then we have to validate that all fieilds are present or not
  // then we have to search for the current info that the user is present for them

  const { username, fullname, email, password } = req.body;

  if (
    [username, fullname, email, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "all fields are required");
  }

  const user = await User.findOne({
    $or: [{ fullname }, { email }],
  });

  if (user) {
    throw new ApiError(400, "User already exists");
  }

  const avatarLocalPath = req.file?.path;

  //   console.log(req)

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required");
  }

  const avatar = await uploadOnCloudianary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "avatar cannot uploaded on clodinary");
  }

  const userCreated = await User.create({
    username: username.toLowerCase(),
    fullname,
    avatar: avatar.url,
    email,
    password,
  });

  const userFound = await User.findById(userCreated._id).select(
    "-password -refreshToken"
  );

  res
    .status(201)
    .json(new ApiResponse(201, userFound, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email must be required to login");
  }

  if (!password) {
    throw new ApiError(400, "Password is required to login");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { refreshToken, accessToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");

  // these code is for secure cookies

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "user logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    _id: req.user._id,
  });

  user.refreshToken = undefined;
  user.save({
    validateBeforeSave: false,
  });

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, user, "user loggedOut successfully"));
});

const refreshAndAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "refresh token is not found");
  }

  const decodedRefreshToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedRefreshToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid Authorization requirest");
  }

  if (!(incomingRefreshToken === user.refreshToken)) {
    throw new ApiError(401, "refreshToken Expired or used");
  }

  const { refreshToken, accessToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  user.refreshToken = refreshToken;

  user.save({
    validateBeforeSave: false,
  });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "user logged in successfully"));
});

export { registerUser, loginUser, logoutUser, refreshAndAccessToken };
