import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import Widget from "../components/Widget"; // Import the simplified Widget

const Dashboard = () => {
  const { getTotalDonations } = useStateContext();
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    const fetchTotalDonations = async () => {
      const total = await getTotalDonations();
      setTotalDonations(total);
    };
    fetchTotalDonations();
  }, [getTotalDonations]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#1e1e2d] via-[#23233d] to-[#181a21] text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#9b73d3]">Dashboard</h1>
      </div>

      {/* Grid Layout for the Widgets */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Donations Widget */}
        <Widget title="Total Donations" amount={totalDonations} />
      </div>
    </div>
  );
};

export default Dashboard;






