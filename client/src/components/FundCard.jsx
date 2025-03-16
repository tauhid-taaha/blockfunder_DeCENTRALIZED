import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { tagType, thirdweb } from '../assets';
import { daysLeft } from '../utils';
import { ProgressBar, BookmarkButton } from './index';

const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, handleClick, pId }) => {
  const remainingDays = daysLeft(deadline);
  const { isDarkMode } = useTheme();
  
  return (
    <div
      className={`sm:w-[288px] w-full rounded-[15px] ${
        isDarkMode 
          ? 'bg-[#1c1c24] hover:bg-[#6a0dad]' 
          : 'bg-white hover:bg-purple-100 border border-gray-200'
      } cursor-pointer transition-transform transform hover:scale-110 duration-300 ease-in-out shadow-md relative`} 
      onClick={handleClick}
    >
      {/* Bookmark Button */}
      <BookmarkButton campaignId={pId} title={title} image={image} />
      
      <img src={image} alt="fund" className="w-full h-[158px] object-cover rounded-t-[15px]" />

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain" />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]"></p>
        </div>

        <div className="block">
          <h3 className={`font-epilogue font-semibold text-[16px] ${isDarkMode ? 'text-white' : 'text-gray-800'} text-left leading-[26px] truncate`}>{title}</h3>
          <p className={`mt-[5px] font-epilogue font-normal ${isDarkMode ? 'text-[#808191]' : 'text-gray-600'} text-left leading-[18px] truncate`}>{description}</p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className={`font-epilogue font-semibold text-[14px] ${isDarkMode ? 'text-[#b2b3bd]' : 'text-gray-700'} leading-[22px]`}>{amountCollected}</h4>
            <p className={`mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] ${isDarkMode ? 'text-[#808191]' : 'text-gray-500'} sm:max-w-[120px] truncate`}>Raised of {target}</p>
          </div>
          <div className="flex flex-col">
            <h4 className={`font-epilogue font-semibold text-[14px] ${isDarkMode ? 'text-[#b2b3bd]' : 'text-gray-700'} leading-[22px]`}>{remainingDays}</h4>
            <p className={`mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] ${isDarkMode ? 'text-[#808191]' : 'text-gray-500'} sm:max-w-[120px] truncate`}>Days Left</p>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar current={parseFloat(amountCollected)} target={parseFloat(target)} />

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className={`w-[30px] h-[30px] rounded-full flex justify-center items-center ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-100'}`}>
            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain" />
          </div>
          <p className={`flex-1 font-epilogue font-normal text-[12px] ${isDarkMode ? 'text-[#808191]' : 'text-gray-500'} truncate`}>by <span className={isDarkMode ? 'text-[#b2b3bd]' : 'text-gray-700'}>{owner}</span></p>
        </div>
      </div>
    </div>
  )
}

export default FundCard