import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const BookmarkButton = ({ campaignId, title, image }) => {
  const { isDarkMode } = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Check if campaign is already bookmarked on component mount
  useEffect(() => {
    const checkBookmarkStatus = () => {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedCampaigns')) || [];
      setIsBookmarked(bookmarks.some(bookmark => bookmark.id === campaignId));
    };
    
    checkBookmarkStatus();
  }, [campaignId]);
  
  const toggleBookmark = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to parent elements
    
    // Get existing bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedCampaigns')) || [];
    
    if (isBookmarked) {
      // Remove from bookmarks
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== campaignId);
      localStorage.setItem('bookmarkedCampaigns', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      // Add to bookmarks
      const newBookmark = {
        id: campaignId,
        title,
        image,
        timestamp: new Date().toISOString()
      };
      
      const updatedBookmarks = [...bookmarks, newBookmark];
      localStorage.setItem('bookmarkedCampaigns', JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
    }
  };
  
  return (
    <button
      onClick={toggleBookmark}
      className={`absolute top-2 right-2 p-2 rounded-full ${
        isDarkMode 
          ? 'bg-gray-800 bg-opacity-70 hover:bg-gray-700' 
          : 'bg-white bg-opacity-70 hover:bg-gray-100'
      } transition-colors z-10`}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      {isBookmarked ? (
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
    </button>
  );
};

export default BookmarkButton; 