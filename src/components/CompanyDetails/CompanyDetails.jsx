import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import "./CompanyDetails.css";

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `https://iti-jobhunter-node-production-ccbd.up.railway.app/api/companies/display/${id}`
        );
        setCompany(response.data.company);
        setJobs(response.data.jobs);
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError("Failed to load company details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: "center", mt: 4 }}
      >
        {error}
      </Typography>
    );
  }

  if (!company) {
    return (
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ textAlign: "center", mt: 4 }}
      >
        Company not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
      <Button
        onClick={() => navigate("/CompanyHome")}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, textTransform: "none" }}
      >
        Back to Companies
      </Button>

      <Paper
        sx={{
          height: { xs: 150, sm: 250, md: 300 },

          backgroundImage: `url('/cover-image.jpg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          mb: { xs: 4, md: 6 },
          position: "relative",
          overflow: "hidden",
        }}
      ></Paper>

      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          mt: { xs: -10, md: -12 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "20%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: { xs: 0, sm: 3 },
              mb: { xs: 2, sm: 0 },
              boxShadow: 3,
              flexShrink: 0,
            }}
          >
            <img
              src="../../../public/company-logo-design-template-e089327a5c476ce5c70c74f7359c5898_screen.jpg"
              alt={`${company.name} Logo`}
              style={{ maxWidth: "80%", maxHeight: "80%", borderRadius: "15%" }}
            />
          </Box>
          <Box sx={{ textAlign: { xs: "center", sm: "left" }, flexGrow: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              {company.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              display="flex"
              alignItems="center"
              justifyContent={{ xs: "center", sm: "flex-start" }}
              flexWrap="wrap"
            >
              <BusinessIcon sx={{ mr: 0.5, fontSize: "1.1rem" }} />{" "}
              {company.industry}
              {company.employees && (
                <>
                  &nbsp; &nbsp;{" "}
                  <PeopleIcon sx={{ mr: 0.5, fontSize: "1.1rem" }} /> Employees:{" "}
                  {company.employees}
                </>
              )}
            </Typography>
            <Box
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              {company.website && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LanguageIcon />}
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 1, textTransform: "none" }}
                >
                  Website
                </Button>
              )}
              {company.facebook && (
                <IconButton
                  href={company.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  <FacebookIcon />
                </IconButton>
              )}
              {company.twitter && (
                <IconButton
                  href={company.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  <TwitterIcon />
                </IconButton>
              )}
              {company.instagram && (
                <IconButton
                  href={company.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  <InstagramIcon />
                </IconButton>
              )}
              {company.linkedin && (
                <IconButton
                  href={company.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  <LinkedInIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
          About {company.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {company.about || "No detailed description available."}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {company.mission || "No mission statement provided."}
        </Typography>

        {(company.aboutImage1 || company.aboutImage2) && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 3,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {company.aboutImage1 && (
              <Box
                sx={{
                  width: { xs: "100%", sm: "48%" },
                  height: 200,
                  backgroundImage: `url(${company.aboutImage1})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              />
            )}
            {company.aboutImage2 && (
              <Box
                sx={{
                  width: { xs: "100%", sm: "48%" },
                  height: 200,
                  backgroundImage: `url(${company.aboutImage2})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              />
            )}
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          Jobs at {company.name}
        </Typography>
        {jobs.length > 0 ? (
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} key={job._id}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "20%",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        boxShadow: 1,
                      }}
                    >
                      <img
                        src="../../../public/company-logo-design-template-e089327a5c476ce5c70c74f7359c5898_screen.jpg"
                        alt={`${company.name} Logo`}
                        style={{
                          maxWidth: "70%",
                          maxHeight: "70%",
                          borderRadius: "10%",
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <BusinessIcon
                          sx={{
                            fontSize: "1rem",
                            verticalAlign: "middle",
                            mr: 0.5,
                          }}
                        />{" "}
                        {company.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <WorkOutlineIcon
                          sx={{
                            fontSize: "1rem",
                            verticalAlign: "middle",
                            mr: 0.5,
                          }}
                        />{" "}
                        {job.job_type} • {job.location}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "row", sm: "column" },
                      alignItems: { xs: "center", sm: "flex-end" },
                      mt: { xs: 2, sm: 0 },
                    }}
                  >
                    {job.isFeatured && (
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "warning.main",
                          color: "white",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: "bold",
                          mr: { xs: 1, sm: 0 },
                          mb: { xs: 0, sm: 1 },
                        }}
                      >
                        FEATURED
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {new Date(job.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <br />

                      <Button
                        variant="contained"
                        component={Link}
                        to={`/job/${job._id}`}
                        sx={{
                          bgcolor: "#1A75E8",
                          color: "#fff",
                          px: 4,
                          py: 1,
                          borderRadius: 1,
                          width: { xs: "100%", sm: "auto" },
                          "&:hover": { bgcolor: "#0F1137" },
                        }}
                      >
                        {job.job_status}
                      </Button>
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 2 }}
          >
            No jobs posted by this company yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
