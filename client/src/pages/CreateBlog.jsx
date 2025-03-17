import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { addBlog } from '../utils/blogStorage';

const CreateBlog = () => {
  const { isDarkMode } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get username from localStorage if available
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setAuthor(userData.username || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!content.trim()) {
      setError('Content is required');
      return;
    }
    
    if (!author.trim()) {
      setError('Author name is required');
      return;
    }
    
    // Create new blog
    const newBlog = addBlog({
      title,
      content,
      author
    });
    
    // Redirect to the new blog
    navigate(`/blog/${newBlog.id}`);
  };

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
          } p-6`}
        >
          <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Create a New Blog Post
          </h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label 
                htmlFor="author" 
                className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Your Username
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white border-gray-700 focus:border-[#00A86B]' 
                    : 'bg-white text-gray-800 border-gray-300 focus:border-[#00A86B]'
                } border focus:ring-2 focus:ring-[#00A86B]/50 outline-none transition-colors`}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="mb-6">
              <label 
                htmlFor="title" 
                className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white border-gray-700 focus:border-[#00A86B]' 
                    : 'bg-white text-gray-800 border-gray-300 focus:border-[#00A86B]'
                } border focus:ring-2 focus:ring-[#00A86B]/50 outline-none transition-colors`}
                placeholder="Enter a catchy title"
                required
              />
            </div>
            
            <div className="mb-6">
              <label 
                htmlFor="content" 
                className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Blog Content
              </label>
              <textarea
                id="content"
                rows="12"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white border-gray-700 focus:border-[#00A86B]' 
                    : 'bg-white text-gray-800 border-gray-300 focus:border-[#00A86B]'
                } border focus:ring-2 focus:ring-[#00A86B]/50 outline-none transition-colors`}
                placeholder="Write your blog content here... You can use multiple paragraphs."
                required
              ></textarea>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Tip: Use line breaks to separate paragraphs.
              </p>
            </div>
            
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#00A86B] to-[#008F5B] text-white rounded-lg font-medium"
              >
                Publish Blog
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate('/blogs')}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateBlog; 