import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from "@mui/material";

const RecentProjects = () => {
  const { getRecentProjects } = useStateContext();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const recentProjects = await getRecentProjects();
      setProjects(recentProjects);
    };

    fetchProjects();
  }, []);

  // 🔗 Handle Navigation to Campaign Details Page
  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  return (
    <Card sx={{ backgroundColor: "#23233d", color: "white", borderRadius: 2, p: 2 }}>
      <CardContent>
        <h2 className="text-lg font-semibold text-[#ff5252] flex items-center">
          📌 Recent Projects
        </h2>

        <TableContainer>
          <Table>
            {/* Table Head */}
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1b1e2d" }}>
                <TableCell sx={{ color: "#f1c40f", fontWeight: "bold" }}>🔹 Image</TableCell>
                <TableCell sx={{ color: "#f1c40f", fontWeight: "bold" }}>📌 Title</TableCell>
                <TableCell sx={{ color: "#f1c40f", fontWeight: "bold" }}>🎯 Target</TableCell>
                <TableCell sx={{ color: "#f1c40f", fontWeight: "bold" }}>💰 Collected</TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {projects.map((project, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": { backgroundColor: "#292b3e", cursor: "pointer" },
                  }}
                  onClick={() => handleNavigate(project)} // Navigate on click
                >
                  <TableCell>
                    <Avatar src={project.image} sx={{ width: 40, height: 40, border: "2px solid #ff5252" }} />
                  </TableCell>
                  <TableCell sx={{ color: "#f1c40f", fontWeight: "bold", textDecoration: "underline" }}>
                    {project.title}
                  </TableCell>
                  <TableCell sx={{ color: "#f1c40f" }}>{project.target} ETH</TableCell>
                  <TableCell sx={{ color: "#4caf50", fontWeight: "bold" }}>{project.collected} ETH</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentProjects;

