import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getBlogById, addComment, likeBlog } from '../utils/blogStorage';

const BlogDetail = () => {
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadBlog = () => {
      setLoading(true);
      const blogData = getBlogById(id);
      
      if (!blogData) {
        navigate('/blogs');
        return;
      }
      
      setBlog(blogData);
      setLoading(false);
    };

    loadBlog();
    
    // Get username from localStorage if available
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUsername(userData.username || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, [id, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLike = () => {
    const updatedLikes = likeBlog(id);
    if (updatedLikes !== null) {
      setBlog({ ...blog, likes: updatedLikes });
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }
    
    const newComment = addComment(id, {
      author: username,
      content: comment
    });
    
    if (newComment) {
      // Update the blog state with the new comment
      setBlog({
        ...blog,
        comments: [...blog.comments, newComment]
      });
      
      // Clear the form
      setComment('');
      setError('');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-50'} flex justify-center items-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A86B]"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          to="/blogs" 
          className={`flex items-center mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-[#00A86B] transition-colors`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Blogs
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-lg overflow-hidden shadow-lg ${
            isDarkMode ? 'bg-[#1c1c24] border border-gray-800' : 'bg-white border border-gray-100'
          } p-6 mb-8`}
        >
          <div className="flex items-center mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                {blog.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4">
              <p className={`font-medium text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {blog.author}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatDate(blog.createdAt)}
              </p>
            </div>
          </div>
          
          <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {blog.title}
          </h1>
          
          <div className={`mb-6 whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <div className="flex items-center justify-between border-t border-b py-4 mb-6 border-gray-200/20">
            <button 
              onClick={handleLike}
              className="flex items-center gap-2 hover:text-[#00A86B] transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-red-500"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {blog.likes} likes
              </span>
            </button>
            
            <div className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {blog.comments.length} comments
              </span>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Comments
            </h2>
            
            {blog.comments.length === 0 ? (
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {blog.comments.map((comment) => (
                  <div 
                    key={comment.id}
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          {comment.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-2">
                        <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {comment.author}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Comment Form */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Leave a Comment
            </h3>
            
            <form onSubmit={handleSubmitComment}>
              {error && (
                <p className="text-red-500 mb-4">{error}</p>
              )}
              
              <div className="mb-4">
                <label 
                  htmlFor="username" 
                  className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Your Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 text-white border-gray-700 focus:border-[#00A86B]' 
                      : 'bg-white text-gray-800 border-gray-300 focus:border-[#00A86B]'
                  } border focus:ring-2 focus:ring-[#00A86B]/50 outline-none transition-colors`}
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor="comment" 
                  className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Your Comment
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 text-white border-gray-700 focus:border-[#00A86B]' 
                      : 'bg-white text-gray-800 border-gray-300 focus:border-[#00A86B]'
                  } border focus:ring-2 focus:ring-[#00A86B]/50 outline-none transition-colors`}
                  placeholder="Write your comment here..."
                  required
                ></textarea>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[#00A86B] to-[#008F5B] text-white rounded-lg font-medium"
              >
                Post Comment
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail; 