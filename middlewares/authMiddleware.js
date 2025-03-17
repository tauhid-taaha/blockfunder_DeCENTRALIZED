import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
    }

    // Extract the token
    const authHeader = req.headers.authorization;
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    // For Auth0 tokens, we'll just pass them through
    // This is a temporary solution until proper Auth0 validation is implemented
    if (token.includes('.') && token.split('.').length === 3) {
      // Check if this is an Auth0 user
      if (req.headers['x-auth0-user-email']) {
        console.log("Auth0 user detected:", req.headers['x-auth0-user-email']);
        // Set a basic user object for Auth0 users
        req.user = { _id: 'auth0user', role: 0 };
        return next();
      }
    }

    // Fall back to our normal JWT verification
    try {
      const decode = JWT.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (error) {
      console.log("JWT verification error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Invalid token",
        error: error.message
      });
    }
  } catch (error) {
    console.log("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};