import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaHeart, FaRegHeart, FaComment, FaTrash, FaEdit } from "react-icons/fa";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: "", content: "", image: null });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { isAuthenticated, user, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/community/posts");
      console.log("Posts data:", data);
      if (data.success && data.posts) {
        setPosts(data.posts);
      } else {
        setPosts([]);
        console.log("No posts found or unexpected response format", data);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching posts:", error);
      toast.error("Error fetching posts");
      setPosts([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle post creation
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to create posts");
      loginWithRedirect();
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      console.log("Auth0 user info:", user);
      
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("content", newPost.content);
      if (newPost.image) {
        formData.append("image", newPost.image);
      }

      const response = await axios.post(
        "http://localhost:8080/api/v1/community/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "X-Auth0-User-Email": user.email,
            "X-Auth0-User-Name": user.name || user.nickname,
            "X-Auth0-User-Picture": user.picture || ""
          },
        }
      );

      console.log("Create post response:", response.data);
      toast.success("Post created successfully");
      setShowCreatePost(false);
      setNewPost({ title: "", content: "", image: null });
      fetchPosts();
    } catch (error) {
      console.log("Error creating post:", error);
      console.log("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Error creating post");
    }
  };

  // Handle post like
  const handleLike = async (postId) => {
    try {
      if (!isAuthenticated) {
        toast.error("Please login to like posts");
        loginWithRedirect();
        return;
      }
      
      const token = await getAccessTokenSilently();
      await axios.post(
        `http://localhost:8080/api/v1/community/posts/${postId}/like`,
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
      fetchPosts();
    } catch (error) {
      console.log("Error liking post:", error);
      toast.error("Error liking post");
    }
  };

  // Handle post edit
  const handleEdit = (post) => {
    navigate(`/edit-post/${post._id}`);
  };

  // Handle post delete
  const handleDelete = async (postId) => {
    if (!isAuthenticated) {
      toast.error("Please login to delete posts");
      loginWithRedirect();
      return;
    }
    
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        const token = await getAccessTokenSilently();
        await axios.delete(
          `http://localhost:8080/api/v1/community/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Auth0-User-Email": user.email,
              "X-Auth0-User-Name": user.name,
              "X-Auth0-User-Picture": user.picture
            },
          }
        );
        toast.success("Post deleted successfully");
        fetchPosts();
      }
    } catch (error) {
      console.log("Error deleting post:", error);
      toast.error("Error deleting post");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community</h1>
        <button
          onClick={() => isAuthenticated ? setShowCreatePost(true) : loginWithRedirect()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPlus /> Create Post
        </button>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {newPost.editingId ? "Edit Post" : "Create New Post"}
            </h2>
            <form onSubmit={handleCreatePost}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-2 border rounded h-32"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image (optional)</label>
                <input
                  type="file"
                  onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {newPost.editingId ? "Update Post" : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="grid gap-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="text-gray-600">
                    Posted by {post.author?.name || "Anonymous"} on{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {isAuthenticated && user && post.author && user.sub === post.author._id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              {post.image && (
                <img
                  src={`http://localhost:8080/${post.image}`}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/640x360?text=Image+Not+Available";
                    console.log("Error loading image:", post.image);
                  }}
                />
              )}
              <p className="text-gray-700 mb-4">{post.content}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                >
                  {post.likes && isAuthenticated && user && post.likes.includes(user.sub) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{post.likes ? post.likes.length : 0}</span>
                </button>
                <button
                  onClick={() => navigate(`/community/post/${post._id}`)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
                >
                  <FaComment />
                  <span>{post.comments ? post.comments.length : 0}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 mb-4">No posts yet. Be the first to create a post!</p>
            <button
              onClick={() => isAuthenticated ? setShowCreatePost(true) : loginWithRedirect()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community; 