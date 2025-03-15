import React from "react";
import { Route, Routes } from "react-router-dom";

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
  ChatbotPage

} from "./pages";

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      {/* Sidebar */}
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/ai" element={<ChatbotPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchResults />} /> {/* Add this route */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donated-campaigns" element={<DonatedCampaignsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          <Route path="/chatbot" element={<Chatbot_Assistant />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
