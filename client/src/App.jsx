import React from "react";
import { Routes, Route } from 'react-router-dom';
import { useTheme } from "./context/ThemeContext";

import { Sidebar, Navbar } from "./components";
import {
  CampaignDetails,
  CreateCampaign,
  Home,
  Profile,
  DonatedCampaignsPage,
  Homepage,
  Chatbot_Assistant,
  Dashboard,
  Register,
  SearchResults,
  Login,
  ChatbotPage,
  BookmarkedCampaigns,
  CryptoRates,
  CryptoNews,
  ForgotPassword,
  ResetPassword,
  Community,
  PostDetails,
  EditPost,
} from "./pages";

const App = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`relative sm:-8 p-4 ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-100'} min-h-screen flex flex-row`}>
      {/* Sidebar */}
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 max-sm:w-full max-w-[1600px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/ai" element={<ChatbotPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donated-campaigns" element={<DonatedCampaignsPage />} />
          <Route path="/bookmarks" element={<BookmarkedCampaigns />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          <Route path="/chatbot" element={<Chatbot_Assistant />} />
          <Route path="/crypto-rates" element={<CryptoRates />} />
          <Route path="/crypto-news" element={<CryptoNews />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/post/:id" element={<PostDetails />} />
          <Route path="/community/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
