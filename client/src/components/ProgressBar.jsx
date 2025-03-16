import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ProgressBar = ({ current, target }) => {
  const { isDarkMode } = useTheme();
  
  // Calculate percentage with a maximum of 100%
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between mb-1">
        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {percentage.toFixed(0)}% Funded
        </span>
        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Goal: {target} ETH
        </span>
      </div>
      <div className={`w-full h-2.5 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div 
          className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-green-500" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar; 