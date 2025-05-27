import React, { useEffect, useState } from "react";
import useJobStore from "../../store/useJobsStore";
import useUserStore from "../../store/User.store";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  Box,
  Button,
  Chip,
  CircularProgress,
  Modal,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Link,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import { useParams } from "react-router-dom";

function JobDetailsPage() {
  const { user, getUser } = useUserStore();
  const { selectedJob, loading, fetchJobDetails } = useJobStore();
  const { id } = useParams();

  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    firstName: user?.userName.split(" ")[0] || "",
    lastName: user?.userName.split(" ")[1] || "",
    availability: "",
    ExpectedSalary: "",
  });

  useEffect(() => {
    fetchJobDetails(id);
  }, [fetchJobDetails, id]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (user) {
      setApplicationData((prevData) => ({
        ...prevData,
        firstName: user.userName.split(" ")[0] || "",
        lastName: user.userName.split(" ")[1] || "",
        ExpectedSalary:
          user.aboutMe?.expectedSalary?.split(" ")[0].replace(/,/g, "") || "",
      }));
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleOpenApplyModal = () => {
    if (!user) {
      alert("Please login to apply for this job.");
      return;
    }
    if (!user.cv) {
      alert("Please upload your CV in your profile to apply.");
      return;
    }

    setOpenApplyModal(true);
  };

  const handleCloseApplyModal = () => {
    setOpenApplyModal(false);
  };

  const handleApplicationInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob || !user) {
      alert("Job or user data is missing.");
      return;
    }

    const payload = {
      resume: user.cv,
      ExpectedSalary: parseFloat(applicationData.ExpectedSalary),
    };

    try {
      let token = localStorage.getItem("UserToken");
      if (!token) {
        token = sessionStorage.getItem("UserToken");
      }
      const response = await axios.post(
        `https://iti-jobhunter-node-production-ccbd.up.railway.app/api/application/${selectedJob._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        handleCloseApplyModal();
      } else {
        alert("Failed to submit application.");
      }
    } catch (error) {
      console.error(
        "Error submitting application:",
        error.response?.data || error.message
      );
      alert(
        `An error occurred while submitting your application: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 450 },
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: "none",
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!selectedJob) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Job not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ p: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {selectedJob.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              <BusinessIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              {selectedJob.company?.name || "N/A"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedJob.location}
              {selectedJob.experienceLevel}
            </Typography>
          </Box>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#1A75E8",
                color: "#fff",
                px: 4,
                py: 1,
                borderRadius: 1,
                width: { xs: "100%", sm: "auto" },
                "&:hover": { bgcolor: "#0F1137" },
              }}
              onClick={handleOpenApplyModal}
            >
              Apply Now
            </Button>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
          Job Description
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {selectedJob.description}
        </Typography>

        {selectedJob.skills && selectedJob.skills.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skills Required
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedJob.skills.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" />
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Job Details
          </Typography>
          <Typography variant="body2">
            Posted Date: {formatDate(selectedJob.createdAt)}
          </Typography>
          <Typography variant="body2">
            Salary Range: {selectedJob.salary_range.min} -{" "}
            {selectedJob.salary_range.max} $
          </Typography>
        </Box>
      </Card>

      <Modal
        open={openApplyModal}
        onClose={handleCloseApplyModal}
        aria-labelledby="apply-job-modal-title"
        aria-describedby="apply-job-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="apply-job-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Apply for {selectedJob.title}
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={applicationData.firstName}
              onChange={handleApplicationInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={applicationData.lastName}
              onChange={handleApplicationInputChange}
              margin="normal"
            />

            {user?.cv && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Your CV:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label="CV Attached"
                    color="success"
                    variant="outlined"
                    sx={{ px: 1 }}
                  />
                  <Link
                    href={user.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: "none" }}
                  >
                    <Button variant="outlined" size="small">
                      View/Download CV
                    </Button>
                  </Link>
                </Box>
              </Box>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel id="availability-label">Availability</InputLabel>
              <Select
                labelId="availability-label"
                id="availability-select"
                name="availability"
                value={applicationData.availability}
                label="Availability"
                onChange={handleApplicationInputChange}
              >
                <MenuItem value="">Select Availability</MenuItem>
                <MenuItem value="immediately">Immediately</MenuItem>
                <MenuItem value="1-2_weeks">1-2 Weeks</MenuItem>
                <MenuItem value="2-4_weeks">2-4 Weeks</MenuItem>
                <MenuItem value="1_month+">1 Month+</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Expected Salary"
              type="number"
              name="ExpectedSalary"
              value={applicationData.ExpectedSalary}
              onChange={handleApplicationInputChange}
              margin="normal"
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitApplication}
              sx={{ mt: 2, mr: 1 }}
              disabled={
                !applicationData.firstName ||
                !applicationData.lastName ||
                !applicationData.availability ||
                !applicationData.ExpectedSalary ||
                !user?.cv
              }
            >
              Submit Application
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseApplyModal}
              sx={{ mt: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}

export default JobDetailsPage;
