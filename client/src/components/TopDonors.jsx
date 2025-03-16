import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  LinearProgress,
  Tooltip,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { ethers } from "ethers";

const getAvatar = (address) => {
  return `https://robohash.org/${address}?set=set5&size=150x150`;
};

const TopDonors = () => {
  const { getTopDonors } = useStateContext();
  const [topDonors, setTopDonors] = useState([]);

  useEffect(() => {
    const fetchTopDonors = async () => {
      const donors = await getTopDonors();
      setTopDonors(donors);
    };
    fetchTopDonors();
  }, [getTopDonors]);

  const maxDonation = topDonors.length > 0 ? Math.max(...topDonors.map(d => parseFloat(d.total))) : 1;

  return (
    <Card
      className="p-6 bg-[#1a1b2f] rounded-xl shadow-lg w-full max-w-3xl mx-auto"
      style={{
        border: "2px solid transparent",
        backgroundImage:
          "linear-gradient(180deg, #1a1b2f, #1e1f3b), radial-gradient(circle at top left, #9b73d3, #FFD700)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <CardContent>
        <Typography variant="h5" className="text-[#FFD700] text-center mb-6 flex items-center">
          🏆 <span className="ml-2">Top Donors</span>
        </Typography>

        {topDonors.length > 0 ? (
          <List>
            {topDonors.map((donor, index) => (
              <ListItem
                key={index}
                className="bg-[#23233d] rounded-lg mb-3 p-4 shadow-lg flex items-center hover:scale-105 transition-transform duration-300"
              >
                {/* Rank Badge */}
                <Chip
                  label={`#${index + 1}`}
                  sx={{
                    backgroundColor: index === 0 ? "#FFD700" : "#9b73d3",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    padding: "5px 10px",
                    marginRight: "10px",
                  }}
                />

                {/* Donor Avatar with Tooltip */}
                <Tooltip title={donor.donor} arrow>
                  <ListItemAvatar>
                    <Avatar
                      src={getAvatar(donor.donor)}
                      sx={{
                        width: 60,
                        height: 60,
                        border: index === 0 ? "3px solid #FFD700" : "2px solid #9b73d3",
                      }}
                    />
                  </ListItemAvatar>
                </Tooltip>

                {/* Donor Address & Donation Amount */}
                <ListItemText
                  primary={
                    <Typography variant="h6" className="text-white font-bold">
                      {donor.donor.substring(0, 6)}...{donor.donor.slice(-4)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" className="text-gray-400">
                      {parseFloat(donor.total).toFixed(3)} ETH
                    </Typography>
                  }
                  sx={{ flex: "1 1 auto", marginLeft: "10px" }}
                />

                {/* Progress Bar (Larger & Better Styled) */}
                <div className="w-56">
                  <LinearProgress
                    variant="determinate"
                    value={(parseFloat(donor.total) / maxDonation) * 100}
                    className="bg-gray-700 rounded-full"
                    sx={{
                      height: 12,
                      borderRadius: "8px",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: index === 0 ? "#FFD700" : "#9b73d3",
                      },
                    }}
                  />
                </div>

                {/* Donation Amount in Large Font */}
                <Typography
                  variant="h6"
                  className="text-white font-bold ml-4"
                  sx={{ color: index === 0 ? "#FFD700" : "#9b73d3" }}
                >
                  {parseFloat(donor.total).toFixed(3)} ETH
                </Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography className="text-gray-400 text-center text-lg">No donations yet.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TopDonors;


