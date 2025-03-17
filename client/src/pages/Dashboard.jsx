import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import Widget from "../components/Widget";
import TopDonors from "../components/TopDonors";
import RecentProjects from "../components/RecentProjects";

const Dashboard = () => {
  const { getTotalDonations } = useStateContext();
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setTotalDonations(await getTotalDonations());
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-[#1b1e2d] text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#f1c40f]">📊 Dashboard</h1>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Widget title="Total Donations" amount={totalDonations} icon="💰" color="yellow" />
        <div className="lg:col-span-2">
          <TopDonors />
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="mt-6">
        <RecentProjects />
      </div>
    </div>
  );
};

export default Dashboard;






