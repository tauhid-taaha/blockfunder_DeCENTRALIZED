import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';

import { DisplayCampaigns, CampaignFilters } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns(contract);
    
    setCampaigns(data);
  
    // Ensure the newest campaigns (highest pId) come first
    setFilteredCampaigns([...data].sort((a, b) => b.pId - a.pId));
  
    setIsLoading(false);
    
    // Check if there's a campaign parameter in the URL
    const campaignId = searchParams.get('campaign');
    if (campaignId && data.length > 0) {
      // Find the campaign by ID
      const selectedCampaign = data.find(campaign => campaign.pId === parseInt(campaignId));
      
      if (selectedCampaign) {
        // Navigate to campaign details with the campaign data
        navigate(`/campaign-details/${selectedCampaign.title}`, { state: selectedCampaign });
      }
    }
  };
  
  

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  // Apply sorting whenever campaigns or sortOption changes
  useEffect(() => {
    if (campaigns.length === 0) return;
  
    let sortedCampaigns = [...campaigns];
  
    switch (sortOption) {
      case 'newest':
        sortedCampaigns.sort((a, b) => b.pId - a.pId); // Sort by index (newest first)
        break;
      case 'mostFunded':
        sortedCampaigns.sort((a, b) => parseFloat(b.amountCollected) - parseFloat(a.amountCollected));
        break;
      case 'leastFunded':
        sortedCampaigns.sort((a, b) => parseFloat(a.amountCollected) - parseFloat(b.amountCollected));
        break;
      case 'percentFunded':
        sortedCampaigns.sort((a, b) => {
          const percentA = (parseFloat(a.amountCollected) / parseFloat(a.target)) * 100;
          const percentB = (parseFloat(b.amountCollected) / parseFloat(b.target)) * 100;
          return percentB - percentA;
        });
        break;
      default:
        break;
    }
  
    setFilteredCampaigns(sortedCampaigns);
  }, [campaigns, sortOption]); // Runs every time campaigns change
  

  return (
    <div>
      <CampaignFilters 
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      
      <DisplayCampaigns 
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={filteredCampaigns}
      />
    </div>
  )
}

export default Home