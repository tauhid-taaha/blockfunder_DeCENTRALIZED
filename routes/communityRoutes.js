import express from "express";
import multer from "multer";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  togglePostLike,
  uploadPostImage
} from "../controller/postController.js";
import {
  createComment,
  getCommentsByPost,
  getComment,
  updateComment,
  deleteComment,
  toggleCommentLike
} from "../controller/commentController.js";

const router = express.Router();

// Configure multer storage for post images
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Post routes
router.post("/posts", requireSignIn, upload.single("image"), createPost);
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);
router.put("/posts/:id", requireSignIn, updatePost);
router.delete("/posts/:id", requireSignIn, deletePost);
router.post("/posts/:id/like", requireSignIn, togglePostLike);
router.post("/posts/upload-image", requireSignIn, upload.single("image"), uploadPostImage);

// Comment routes
router.post("/posts/:postId/comments", requireSignIn, createComment);
router.get("/posts/:postId/comments", getCommentsByPost);
router.get("/comments/:commentId", getComment);
router.put("/comments/:commentId", requireSignIn, updateComment);
router.delete("/comments/:commentId", requireSignIn, deleteComment);
router.post("/comments/:commentId/like", requireSignIn, toggleCommentLike);

export default router; 