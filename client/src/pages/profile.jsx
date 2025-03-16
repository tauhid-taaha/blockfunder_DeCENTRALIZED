import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { DisplayCampaigns, CampaignFilters } from "../components";
import { useStateContext } from "../context";

const Profile = () => {
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [sortOption, setSortOption] = useState('newest');

  const { address, contract, getUserCampaigns } = useStateContext();
  const { user, isAuthenticated } = useAuth0();

  const fetchCampaigns = async () => {
    setIsLoadingCampaigns(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setFilteredCampaigns(data);
    setIsLoadingCampaigns(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  // Apply sorting whenever campaigns or sortOption changes
  useEffect(() => {
    if (campaigns.length === 0) return;
    
    let result = [...campaigns];
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        // Sort by deadline (newest first)
        result.sort((a, b) => parseInt(b.deadline) - parseInt(a.deadline));
        break;
      case 'endingSoon':
        // Sort by deadline (ending soon first)
        result.sort((a, b) => parseInt(a.deadline) - parseInt(b.deadline));
        break;
      case 'mostFunded':
        // Sort by amount collected (highest first)
        result.sort((a, b) => parseFloat(b.amountCollected) - parseFloat(a.amountCollected));
        break;
      case 'leastFunded':
        // Sort by amount collected (lowest first)
        result.sort((a, b) => parseFloat(a.amountCollected) - parseFloat(b.amountCollected));
        break;
      case 'percentFunded':
        // Sort by percentage funded (highest first)
        result.sort((a, b) => {
          const percentA = (parseFloat(a.amountCollected) / parseFloat(a.target)) * 100;
          const percentB = (parseFloat(b.amountCollected) / parseFloat(b.target)) * 100;
          return percentB - percentA;
        });
        break;
      default:
        break;
    }
    
    setFilteredCampaigns(result);
  }, [campaigns, sortOption]);

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Profile Section */}
      {isAuthenticated && user && (
        <div
          className="profile-container p-6 rounded-lg shadow-md relative"
          style={{
            backgroundImage: "linear-gradient(135deg, #1c1c24, #2a2d35)",
            boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Profile Heading */}
          <h1 className="text-3xl font-bold text-center text-[#1dc071] mb-6">
            User Profile
          </h1>

          {/* Profile Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user.picture}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-[#1dc071]"
              />
              <div
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#1dc071] flex items-center justify-center"
                title="Active"
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl text-[#1dc071] font-bold">{user.name}</h2>
              <div className="flex items-center gap-2">
                <img
                  src="/path-to-email-icon.png"
                  alt="Email Icon"
                  className="w-5 h-5"
                />
                <p className="text-sm text-[#b3b3c0]">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Section */}
      <div className="mt-6">
        <CampaignFilters 
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        
        <DisplayCampaigns
          title="Your Campaigns"
          isLoading={isLoadingCampaigns}
          campaigns={filteredCampaigns}
        />
      </div>
    </div>
  );
};

export default Profile;
