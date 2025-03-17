import postModel from "../models/postModel.js";
import commentModel from "../models/commentModel.js";
import userModel from "../models/userModel.js";
import multer from "multer";
import path from "path";

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
});

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Get author info from Auth0 if it exists
    let author = req.user._id;
    
    // Special handling for Auth0 users
    if (author === 'auth0user' && req.headers['x-auth0-user-email']) {
      // Try to find an existing user with this email
      const email = req.headers['x-auth0-user-email'];
      const name = req.headers['x-auth0-user-name'] || 'Auth0 User';
      
      // Find or create user
      let user = await userModel.findOne({ email });
      
      if (!user) {
        // Create a temporary user for this Auth0 account
        user = new userModel({
          name,
          email,
          password: 'auth0-' + Math.random().toString(36).substring(2),
          phone: '0000000000',
          address: {},
          answer: 'auth0',
          picture: req.headers['x-auth0-user-picture'] || ''
        });
        await user.save();
      }
      
      author = user._id;
    }

    // Create a new post
    const post = new postModel({
      title,
      content,
      author,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
    });

    // If there's an image, save its path
    if (req.file) {
      post.image = req.file.path;
    }

    await post.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in creating post",
      error: error.message,
    });
  }
};

// Upload post image
export const uploadPostImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find({ status: "active" })
      .populate("author", "name email picture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching posts",
      error: error.message,
    });
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await postModel
      .findById(req.params.id)
      .populate("author", "name email picture");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching post",
      error: error.message,
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Get author info from Auth0 if it exists
    let userId = req.user._id;
    
    // Special handling for Auth0 users
    if (userId === 'auth0user' && req.headers['x-auth0-user-email']) {
      const email = req.headers['x-auth0-user-email'];
      const user = await userModel.findOne({ email });
      
      if (user) {
        userId = user._id;
      }
    }
    
    // Check if user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image || post.image;
    post.tags = tags ? tags.split(",").map(tag => tag.trim()) : post.tags;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating post",
      error: error.message,
    });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Get author info from Auth0 if it exists
    let userId = req.user._id;
    
    // Special handling for Auth0 users
    if (userId === 'auth0user' && req.headers['x-auth0-user-email']) {
      const email = req.headers['x-auth0-user-email'];
      const user = await userModel.findOne({ email });
      
      if (user) {
        userId = user._id;
      }
    }
    
    // Check if user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    await postModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting post",
      error: error.message,
    });
  }
};

// Like/Unlike post
export const togglePostLike = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Get author info from Auth0 if it exists
    let userId = req.user._id;
    
    // Special handling for Auth0 users
    if (userId === 'auth0user' && req.headers['x-auth0-user-email']) {
      const email = req.headers['x-auth0-user-email'];
      const user = await userModel.findOne({ email });
      
      if (user) {
        userId = user._id;
      } else {
        // Create a temporary user for this Auth0 account
        const name = req.headers['x-auth0-user-name'] || 'Auth0 User';
        const newUser = new userModel({
          name,
          email,
          password: 'auth0-' + Math.random().toString(36).substring(2),
          phone: '0000000000',
          address: {},
          answer: 'auth0',
          picture: req.headers['x-auth0-user-picture'] || ''
        });
        await newUser.save();
        userId = newUser._id;
      }
    }
    
    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Add like
      post.likes.push(userId);
    } else {
      // Remove like
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: likeIndex === -1 ? "Post liked successfully" : "Post unliked successfully",
      likes: post.likes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in toggling post like",
      error: error.message,
    });
  }
}; 