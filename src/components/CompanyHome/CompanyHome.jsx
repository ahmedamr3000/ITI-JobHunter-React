import React, { useEffect, useState } from "react";
import "./CompanyHome.css";
import image from "../../assets/Artboard 1.svg";
import useCompanyStore from "../../store/UseCompanyStore";
import useUserStore from "../../store/User.store";

import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import axios from "axios";
import { Link } from "react-router-dom";

export default function CompanyHome() {
  const { user, getUser } = useUserStore();
  const { getAllCompanies, companies, isLoading, error } = useCompanyStore();

  // State for Create Company Modal
  const [openCreateCompanyModal, setOpenCreateCompanyModal] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({
    name: "",
    industry: "",
    website: "",
  });

  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [companyToDeleteId, setCompanyToDeleteId] = useState(null);

  const [openEditCompanyModal, setOpenEditCompanyModal] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [editCompanyData, setEditCompanyData] = useState({
    name: "",
    industry: "",
    website: "",
  });

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    getAllCompanies();
    getUser();
  }, []);

  // --- Message Handling ---
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 5000);
  };

  // --- Create Company Handlers ---
  const handleOpenCreateCompanyModal = () => {
    if (!user) {
      showMessage("Please login to create a company.", "error");
      return;
    }
    if (user.role !== "employer") {
      showMessage("You must be an employer to create a company.", "error");
      return;
    }
    setOpenCreateCompanyModal(true);
  };

  const handleCloseCreateCompanyModal = () => {
    setOpenCreateCompanyModal(false);
    setNewCompanyData({ name: "", industry: "", website: "" });
  };

  const handleNewCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitCreateCompany = async () => {
    if (!user) {
      showMessage("User data is missing. Please login.", "error");
      return;
    }
    if (user.role !== "employer") {
      showMessage("You must be an employer to create a company.", "error");
      return;
    }

    if (
      !newCompanyData.name ||
      !newCompanyData.industry ||
      !newCompanyData.website
    ) {
      showMessage("Please fill in all company fields.", "error");
      return;
    }

    try {
      let token = localStorage.getItem("UserToken");
      if (!token) {
        token = sessionStorage.getItem("UserToken");
      }
      const response = await axios.post(
        "https://iti-jobhunter-node-production-ccbd.up.railway.app/api/companies/register",
        newCompanyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        showMessage("Company created successfully!", "success");
        handleCloseCreateCompanyModal();
        getAllCompanies();
      } else {
        showMessage("Failed to create company.", "error");
      }
    } catch (error) {
      console.error(
        "Error creating company:",
        error.response?.data || error.message
      );
      showMessage(
        `Error: ${
          error.response?.data?.message || "Failed to create company."
        }`,
        "error"
      );
    }
  };

  // --- Delete Company Handlers ---
  const handleOpenConfirmDeleteModal = (companyId) => {
    if (!user) {
      showMessage("Please login to delete a company.", "error");
      return;
    }
    setCompanyToDeleteId(companyId);
    setOpenConfirmDeleteModal(true);
  };

  const handleCloseConfirmDeleteModal = () => {
    setOpenConfirmDeleteModal(false);
    setCompanyToDeleteId(null);
  };

  const confirmDeleteCompany = async () => {
    if (!companyToDeleteId) return;

    handleCloseConfirmDeleteModal();

    try {
      let token = localStorage.getItem("UserToken");
      if (!token) {
        token = sessionStorage.getItem("UserToken");
      }
      const response = await axios.delete(
        `https://iti-jobhunter-node-production-ccbd.up.railway.app/api/companies/delete/${companyToDeleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        showMessage("Company deleted successfully!", "success");
        getAllCompanies();
      } else {
        showMessage("Failed to delete company.", "error");
      }
    } catch (error) {
      console.error(
        "Error deleting company:",
        error.response?.data || error.message
      );
      showMessage(
        `Error: ${
          error.response?.data?.message || "Failed to delete company."
        }`,
        "error"
      );
    }
  };

  // --- Edit Company Handlers ---
  const handleOpenEditCompanyModal = (company) => {
    setAnchorEl(null);
    if (!user) {
      showMessage("Please login to edit a company.", "error");
      return;
    }
    if (user.role !== "employer") {
      showMessage("You must be an employer to edit a company.", "error");
      return;
    }
    setCompanyToEdit(company);
    setEditCompanyData({
      name: company.name,
      industry: company.industry,
      website: company.website,
    });
    setOpenEditCompanyModal(true);
  };

  const handleCloseEditCompanyModal = () => {
    setOpenEditCompanyModal(false);
    setCompanyToEdit(null);
    setEditCompanyData({ name: "", industry: "", website: "" });
  };

  const handleEditCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setEditCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitUpdateCompany = async () => {
    if (!user || !companyToEdit) {
      showMessage(
        "User or company data is missing. Please login or select a company.",
        "error"
      );
      return;
    }
    if (user.role !== "employer") {
      showMessage("You must be an employer to update a company.", "error");
      return;
    }
    if (
      !editCompanyData.name ||
      !editCompanyData.industry ||
      !editCompanyData.website
    ) {
      showMessage("Please fill in all company fields.", "error");
      return;
    }

    try {
      let token = localStorage.getItem("UserToken");
      if (!token) {
        token = sessionStorage.getItem("UserToken");
      }
      const response = await axios.put(
        `https://iti-jobhunter-node-production-ccbd.up.railway.app/api/companies/update/${companyToEdit._id}`,
        editCompanyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        showMessage("Company updated successfully!", "success");
        handleCloseEditCompanyModal();
        getAllCompanies();
      } else {
        showMessage("Failed to update company.", "error");
      }
    } catch (error) {
      console.error(
        "Error updating company:",
        error.response?.data || error.message
      );
      showMessage(
        `Error: ${
          error.response?.data?.message || "Failed to update company."
        }`,
        "error"
      );
    }
  };

  // --- MoreVertIcon Menu Handlers ---
  const handleMenuClick = (event, company) => {
    setAnchorEl(event.currentTarget);
    setCompanyToEdit(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCompanyToEdit(null);
  };

  // --- Modal Styles ---
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

  // --- Render Logic ---
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const companiesToDisplay = companies?.foundedCompany || [];

  return (
    <>
      <div className="container my-5 ">
        <div className="d-flex justify-content-between">
          <h1 style={{ fontSize: "50px" }} className="mb-4 ">
            Explore All <span style={{ color: "#26A4FF" }}>Companies </span>{" "}
          </h1>
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
              onClick={handleOpenCreateCompanyModal}
            >
              Create Your Company now
            </Button>
          </Box>
        </div>

        {message && (
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              mb: 2,
              textAlign: "center",
              color: messageType === "error" ? "error.main" : "success.main",
              fontWeight: "bold",
            }}
          >
            {message}
          </Typography>
        )}

        <div className="row">
          {companiesToDisplay.length > 0 ? (
            companiesToDisplay.map((company) => (
              <div className="col-md-3 d-flex" key={company._id}>
                <div className="card company-card p-3 border-0 rounded-4 shadow-sm w-100 d-flex flex-column">
                  <div className="card-body d-flex flex-column">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="shadow-sm p-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "25%",
                          backgroundColor: "#4640DE",
                        }}
                      >
                        <img
                          src={image}
                          alt="Company Logo"
                          style={{ maxWidth: "120%" }}
                        />
                      </div>

                      {user && user._id === company.createdBy && (
                        <>
                          <IconButton
                            aria-label="more"
                            aria-controls={`long-menu-${company._id}`}
                            aria-haspopup="true"
                            onClick={(event) => handleMenuClick(event, company)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            id={`long-menu-${company._id}`}
                            MenuListProps={{ "aria-labelledby": "long-button" }}
                            anchorEl={anchorEl}
                            open={
                              openMenu && companyToEdit?._id === company._id
                            }
                            onClose={handleMenuClose}
                            PaperProps={{
                              style: {
                                maxHeight: 48 * 4.5,
                                width: "120px",
                              },
                            }}
                          >
                            <MenuItem
                              onClick={() =>
                                handleOpenEditCompanyModal(companyToEdit)
                              }
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleOpenConfirmDeleteModal(company._id)
                              }
                            >
                              Delete
                            </MenuItem>
                          </Menu>
                        </>
                      )}
                    </Box>

                    <h2
                      className="card-title my-3 fw-bold text-dark"
                      style={{ fontSize: "1.5rem" }}
                    >
                      {company.name}
                    </h2>

                    <h5
                      className="card-subtitle my-2 text-muted"
                      style={{ fontSize: "1.3rem" }}
                    >
                      {company.industry}
                    </h5>

                    <p
                      className="card-text my-3 text-secondary"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {company.website}
                    </p>

                    <div className="mt-auto">
                      <Link
                        to={`/Companydetails/${company._id}`}
                        className="btn btn-primary my-2 w-100 fw-semibold text text-decoration-none"
                      >
                        View Company
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ width: "100%", textAlign: "center", mt: 4 }}
            >
              No companies found. Create one now!
            </Typography>
          )}
        </div>
      </div>

      <Modal
        open={openCreateCompanyModal}
        onClose={handleCloseCreateCompanyModal}
        aria-labelledby="create-company-modal-title"
        aria-describedby="create-company-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="create-company-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Create New Company
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Company Name"
              name="name"
              value={newCompanyData.name}
              onChange={handleNewCompanyInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Industry"
              name="industry"
              value={newCompanyData.industry}
              onChange={handleNewCompanyInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={newCompanyData.website}
              onChange={handleNewCompanyInputChange}
              margin="normal"
              required
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitCreateCompany}
              sx={{ mt: 2, mr: 1 }}
              disabled={
                !newCompanyData.name ||
                !newCompanyData.industry ||
                !newCompanyData.website
              }
            >
              Create Company
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseCreateCompanyModal}
              sx={{ mt: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openConfirmDeleteModal}
        onClose={handleCloseConfirmDeleteModal}
        aria-labelledby="confirm-delete-modal-title"
        aria-describedby="confirm-delete-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="confirm-delete-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Confirm Deletion
          </Typography>
          <Typography id="confirm-delete-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this company? This action cannot be
            undone.
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseConfirmDeleteModal}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDeleteCompany}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openEditCompanyModal}
        onClose={handleCloseEditCompanyModal}
        aria-labelledby="edit-company-modal-title"
        aria-describedby="edit-company-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="edit-company-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Edit Company Details
          </Typography>
          {companyToEdit && (
            <Box component="form" noValidate autoComplete="off">
              <TextField
                fullWidth
                label="Company Name"
                name="name"
                value={editCompanyData.name}
                onChange={handleEditCompanyInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Industry"
                name="industry"
                value={editCompanyData.industry}
                onChange={handleEditCompanyInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={editCompanyData.website}
                onChange={handleEditCompanyInputChange}
                margin="normal"
                required
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitUpdateCompany}
                sx={{ mt: 2, mr: 1 }}
                disabled={
                  !editCompanyData.name ||
                  !editCompanyData.industry ||
                  !editCompanyData.website
                }
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseEditCompanyModal}
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
