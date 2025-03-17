import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart, FaTrash, FaEdit, FaReply, FaArrowLeft } from "react-icons/fa";

const PostDetails = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, getAccessTokenSilently, loginWithRedirect } = useAuth0();

  // Fetch post details
  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/v1/community/posts/${id}`);
      console.log("Post data:", data);
      if (data.success && data.post) {
        setPost(data.post);
      } else {
        console.log("Post not found or unexpected response format", data);
        toast.error("Post not found");
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching post:", error);
      toast.error("Error fetching post details");
      setLoading(false);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/v1/community/posts/${id}/comments`);
      console.log("Comments data:", data);
      if (data.success && data.comments) {
        setComments(data.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.log("Error fetching comments:", error);
      toast.error("Error fetching comments");
      setComments([]);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // Handle post like
  const handleLike = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please login to like posts");
        loginWithRedirect();
        return;
      }

      const token = await getAccessTokenSilently();
      await axios.post(
        `http://localhost:8080/api/v1/community/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPost();
    } catch (error) {
      console.log("Error liking post:", error);
      toast.error(error.response?.data?.message || "Error liking post");
    }
  };

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to comment");
      loginWithRedirect();
      return;
    }
    
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    try {
      const token = await getAccessTokenSilently();
      const { data } = await axios.post(
        `http://localhost:8080/api/v1/community/posts/${id}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Auth0-User-Email": user.email,
            "X-Auth0-User-Name": user.name,
            "X-Auth0-User-Picture": user.picture
          },
        }
      );
      
      if (data.success) {
        toast.success("Comment added successfully");
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.log("Error adding comment:", error);
      toast.error("Error adding comment");
    }
  };

  // Add reply
  const handleAddReply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to reply");
      loginWithRedirect();
      return;
    }
    
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    try {
      const token = await getAccessTokenSilently();
      const { data } = await axios.post(
        `http://localhost:8080/api/v1/community/posts/${id}/comments`,
        { 
          content: replyContent,
          parentComment: replyingTo 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Auth0-User-Email": user.email,
            "X-Auth0-User-Name": user.name,
            "X-Auth0-User-Picture": user.picture
          },
        }
      );
      
      if (data.success) {
        toast.success("Reply added successfully");
        setReplyContent("");
        setReplyingTo(null);
        fetchComments();
      }
    } catch (error) {
      console.log("Error adding reply:", error);
      toast.error("Error adding reply");
    }
  };

  // Like a comment
  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) {
      toast.error("Please login to like comments");
      loginWithRedirect();
      return;
    }
    
    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        `http://localhost:8080/api/v1/community/comments/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Auth0-User-Email": user.email,
            "X-Auth0-User-Name": user.name,
            "X-Auth0-User-Picture": user.picture
          },
        }
      );
      fetchComments();
    } catch (error) {
      console.log("Error liking comment:", error);
      toast.error("Error liking comment");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) {
      toast.error("Please login to delete comments");
      loginWithRedirect();
      return;
    }
    
    try {
      if (window.confirm("Are you sure you want to delete this comment?")) {
        const token = await getAccessTokenSilently();
        await axios.delete(
          `http://localhost:8080/api/v1/community/comments/${commentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Auth0-User-Email": user.email,
              "X-Auth0-User-Name": user.name,
              "X-Auth0-User-Picture": user.picture
            },
          }
        );
        toast.success("Comment deleted successfully");
        fetchComments();
      }
    } catch (error) {
      console.log("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please login to delete posts");
        return;
      }
      
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:8080/api/v1/community/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Post deleted successfully");
      navigate("/community");
    } catch (error) {
      console.log("Error deleting post:", error);
      toast.error(error.response?.data?.message || "Error deleting post");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="text-gray-600 mb-4">This post may have been deleted or doesn't exist.</p>
          <button 
            onClick={() => navigate("/community")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/community")}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-4"
      >
        <FaArrowLeft /> Back to Community
      </button>
      
      {/* Post */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p className="text-gray-600">
              Posted by {post.author?.name || "Anonymous"} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          {isAuthenticated && user && post.author && user.sub === post.author._id && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/community/edit/${id}`)}
                className="text-blue-500 hover:text-blue-700"
                title="Edit post"
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:text-red-700"
                title="Delete post"
              >
                <FaTrash size={20} />
              </button>
            </div>
          )}
        </div>
        {post.image && (
          <img
            src={`http://localhost:8080/${post.image}`}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-4"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Available";
              console.log("Error loading image:", post.image);
            }}
          />
        )}
        <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-gray-600 hover:text-red-500"
          >
            {post.likes && isAuthenticated && user && post.likes.includes(user.sub) ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart />
            )}
            <span>{post.likes ? post.likes.length : 0}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        
        {/* New Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded-lg h-24 mb-2"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg mb-8">
            <p className="text-gray-700 mb-2">Please log in to comment.</p>
            <button
              onClick={() => loginWithRedirect()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Log In
            </button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{comment.author?.name || "Anonymous"}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {isAuthenticated && user && comment.author && user.sub === comment.author._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete comment"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 mb-2 whitespace-pre-line">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                  >
                    {comment.likes && isAuthenticated && user && comment.likes.includes(user.sub) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                    <span>{comment.likes ? comment.likes.length : 0}</span>
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={() => setReplyingTo(comment._id)}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
                    >
                      <FaReply />
                      Reply
                    </button>
                  )}
                </div>

                {/* Reply Form */}
                {replyingTo === comment._id && (
                  <form onSubmit={handleAddReply} className="mt-4">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-2 border rounded-lg h-20 mb-2"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Post Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="border-l-2 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{reply.author?.name || "Anonymous"}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {isAuthenticated && user && reply.author && user.sub === reply.author._id && (
                            <button
                              onClick={() => handleDeleteComment(reply._id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete reply"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2 whitespace-pre-line">{reply.content}</p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLikeComment(reply._id)}
                            className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                          >
                            {reply.likes && isAuthenticated && user && reply.likes.includes(user.sub) ? (
                              <FaHeart className="text-red-500" />
                            ) : (
                              <FaRegHeart />
                            )}
                            <span>{reply.likes ? reply.likes.length : 0}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-4">No comments yet. Be the first to comment!</p>
              {!isAuthenticated && (
                <button
                  onClick={() => loginWithRedirect()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Log In to Comment
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails; 