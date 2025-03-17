import postModel from "../models/postModel.js";
import commentModel from "../models/commentModel.js";
import userModel from "../models/userModel.js";

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    const { postId } = req.params;
    
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

    // Create new comment
    const comment = new commentModel({
      content,
      author,
      post: postId,
      parentComment: parentComment || null,
    });

    await comment.save();

    // Update post to include this comment
    const post = await postModel.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    // If this is a reply, update parent comment too
    if (parentComment) {
      const parentCommentDoc = await commentModel.findById(parentComment);
      if (parentCommentDoc) {
        parentCommentDoc.replies.push(comment._id);
        await parentCommentDoc.save();
      }
    }

    // Return populated comment
    const populatedComment = await commentModel.findById(comment._id)
      .populate("author", "name email picture");

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in creating comment",
      error: error.message,
    });
  }
};

// Get comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Get all top-level comments
    const comments = await commentModel.find({ 
      post: postId, 
      parentComment: null,
      status: "active" 
    })
      .populate("author", "name email picture")
      .sort({ createdAt: -1 });
    
    // Get all replies for these comments
    const populatedComments = await Promise.all(comments.map(async (comment) => {
      const replies = await commentModel.find({ 
        parentComment: comment._id,
        status: "active" 
      })
        .populate("author", "name email picture")
        .sort({ createdAt: 1 });
      
      return {
        ...comment.toObject(),
        replies
      };
    }));

    res.status(200).json({
      success: true,
      comments: populatedComments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching comments",
      error: error.message,
    });
  }
};

// Get a single comment
export const getComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await commentModel.findById(commentId)
      .populate("author", "name email picture");
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching comment",
      error: error.message,
    });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    
    const comment = await commentModel.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
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
    
    // Check if user is the author of the comment
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this comment",
      });
    }

    // Update comment content
    comment.content = content;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating comment",
      error: error.message,
    });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await commentModel.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
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
    
    // Check if user is the author of the comment
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }

    // Instead of actually deleting, set status to hidden
    comment.status = "hidden";
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting comment",
      error: error.message,
    });
  }
};

// Like/Unlike comment
export const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await commentModel.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
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
    
    // Check if user already liked the comment
    const likeIndex = comment.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Add like
      comment.likes.push(userId);
    } else {
      // Remove like
      comment.likes.splice(likeIndex, 1);
    }
    
    await comment.save();
    
    res.status(200).json({
      success: true,
      message: likeIndex === -1 ? "Comment liked successfully" : "Comment unliked successfully",
      likes: comment.likes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in toggling comment like",
      error: error.message,
    });
  }
}; 