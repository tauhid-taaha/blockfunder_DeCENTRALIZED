import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

const EditPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    currentImage: null,
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/v1/community/posts/${id}`);
        if (data.success && data.post) {
          setPost(data.post);
          setFormData({
            title: data.post.title,
            content: data.post.content,
            image: null,
            currentImage: data.post.image,
          });
        } else {
          toast.error("Post not found");
          navigate("/community");
        }
        setLoading(false);
      } catch (error) {
        console.log("Error fetching post:", error);
        toast.error("Error fetching post details");
        setLoading(false);
        navigate("/community");
      }
    };

    if (isAuthenticated) {
      fetchPost();
    }
  }, [id, isAuthenticated]);

  // Check if user is authorized to edit
  useEffect(() => {
    if (!loading && post && isAuthenticated && user) {
      if (post.author && post.author._id !== user.sub) {
        toast.error("You are not authorized to edit this post");
        navigate(`/community/post/${id}`);
      }
    }
  }, [loading, post, isAuthenticated, user, id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      
      // If there's a new image, upload it first
      let imageUrl = formData.currentImage;
      if (formData.image) {
        const formDataImg = new FormData();
        formDataImg.append("image", formData.image);
        
        const imageResponse = await axios.post(
          "http://localhost:8080/api/v1/community/posts/upload-image",
          formDataImg,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        if (imageResponse.data.success) {
          imageUrl = imageResponse.data.imageUrl;
        }
      }
      
      // Update the post
      await axios.put(
        `http://localhost:8080/api/v1/community/posts/${id}`,
        {
          title: formData.title,
          content: formData.content,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Post updated successfully");
      navigate(`/community/post/${id}`);
    } catch (error) {
      console.log("Error updating post:", error);
      toast.error(error.response?.data?.message || "Error updating post");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image change
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
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
      {/* Back button */}
      <button
        onClick={() => navigate(`/community/post/${id}`)}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-4"
      >
        <FaArrowLeft /> Back to Post
      </button>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Image</label>
            {formData.currentImage && (
              <div className="mb-2">
                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                <img
                  src={`http://localhost:8080/${formData.currentImage}`}
                  alt="Current post image"
                  className="w-48 h-48 object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=Image+Not+Available";
                    console.log("Error loading image:", formData.currentImage);
                  }}
                />
              </div>
            )}
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to keep the current image
            </p>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/community/post/${id}`)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost; 