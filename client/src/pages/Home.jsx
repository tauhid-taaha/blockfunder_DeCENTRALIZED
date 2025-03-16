import React, { useState, useEffect } from 'react'

import { DisplayCampaigns, CampaignFilters } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [sortOption, setSortOption] = useState('newest');

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setFilteredCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
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