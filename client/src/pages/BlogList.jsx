import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getAllBlogs, generateSampleBlogs } from '../utils/blogStorage';

const BlogList = () => {
  const { isDarkMode } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load blogs from localStorage or generate sample blogs if none exist
    const loadBlogs = () => {
      setLoading(true);
      const blogData = generateSampleBlogs();
      setBlogs(blogData);
      setLoading(false);
    };

    loadBlogs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
          >
            Community Blog
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create-blog')}
            className="px-4 py-2 bg-gradient-to-r from-[#00A86B] to-[#008F5B] text-white rounded-lg font-medium"
          >
            Write a Blog
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A86B]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className={`rounded-lg overflow-hidden shadow-lg ${
                  isDarkMode ? 'bg-[#1c1c24] border border-gray-800' : 'bg-white border border-gray-100'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                        {blog.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {blog.author}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <Link to={`/blog/${blog.id}`}>
                    <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'} hover:text-[#00A86B] transition-colors`}>
                      {blog.title}
                    </h2>
                  </Link>
                  
                  <p className={`mb-4 line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {blog.content}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-red-500 mr-1"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {blog.likes}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={`mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {blog.comments.length}
                      </span>
                    </div>
                    
                    <Link 
                      to={`/blog/${blog.id}`}
                      className="text-sm text-[#00A86B] hover:underline"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList; 