import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import Widget from "../components/Widget"; 
import TopDonors from "../components/TopDonors";// Import the simplified Widget

const Dashboard = () => {
  const { getTotalDonations, getTopDonors } = useStateContext(); // Include getTopDonors
  const [totalDonations, setTotalDonations] = useState(0);
  const [topDonors, setTopDonors] = useState([]); // State for top donors

  useEffect(() => {
    const fetchDashboardData = async () => {
      const total = await getTotalDonations();
      setTotalDonations(total);

      const donors = await getTopDonors(); // Fetch top donors
      setTopDonors(donors);
    };

    fetchDashboardData();
  }, [getTotalDonations, getTopDonors]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#1e1e2d] via-[#23233d] to-[#181a21] text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#9b73d3]">Dashboard</h1>
      </div>

      {/* Grid Layout for the Widgets */}
      

        {/* Top Donors Widget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <Widget title="Total Donations" amount={totalDonations} />
  <div className="col-span-2">
    <TopDonors />
  </div>
</div>
      </div>
    
  );
};

export default Dashboard;







