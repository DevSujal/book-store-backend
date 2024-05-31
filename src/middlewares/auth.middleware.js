import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken || req.header("Authorization")?.split(" ")[2];

    if (!accessToken) {
      throw new ApiError(400, "Unauthorized request");
    }

    const decodedToken =  jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    // we know decoded Token has some sort of id

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "soomething went wrong while validating access Token"
    );
  }
});
