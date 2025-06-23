import { useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";

import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import leftIllustration from "../../assets/3D Icon for Financial Startup 1.png";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Snackbar,
  CssBaseline,
  Box,
  Typography,
  Alert as MuiAlert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useAuthStore from "../../store/useAuthStore";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  async function login(values, { setSubmitting }) {
    try {
      setEmailNotFound(false);
      const { email, password, rememberMe } = values;
      const response = await axios.post(
        "https://iti-jobhunter-node-production-2ae5.up.railway.app/api/auth/login",
        { email, password }
      );

      if (response.status === 200) {
        setSnackbarMessage("🎉 Login successful! Redirecting...");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setToken(response.data.token, rememberMe);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      let message = "An error occurred. Please try again.";
      if (error.response) {
        if (error.response.status === 400) {
          message = "Incorrect email or password.";
        } else if (error.response.status === 404) {
          message = "Email not found. Please register.";
          setEmailNotFound(true);
        } else {
          message = error.response.data?.message || message;
        }
      } else {
        message = "Network error. Please check your connection.";
      }

      setSnackbarMessage("⚠️ " + message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  }

  const loginForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: login,
  });

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          overflow: "hidden",
          backgroundColor: "#f5f7ff",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f7ff",
          }}
        >
          <img
            src={leftIllustration}
            alt="Illustration"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f9f9fb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 10,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 800 }}>
            <form onSubmit={loginForm.handleSubmit}>
              <Typography
                variant="h5"
                fontWeight="500"
                mb={7}
                sx={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                  color: "#0062FF",
                }}
              >
                Log in to your account
              </Typography>
              <TextField
                placeholder="Email Address"
                variant="standard"
                fullWidth
                name="email"
                value={loginForm.values.email}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                error={
                  loginForm.touched.email && Boolean(loginForm.errors.email)
                }
                helperText={loginForm.touched.email && loginForm.errors.email}
                sx={{ mb: 4 }}
                InputProps={{ disableUnderline: false }}
              />
              <TextField
                placeholder="Password"
                variant="standard"
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                value={loginForm.values.password}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                error={
                  loginForm.touched.password &&
                  Boolean(loginForm.errors.password)
                }
                helperText={
                  loginForm.touched.password && loginForm.errors.password
                }
                InputProps={{
                  disableUnderline: false,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 4 }}
              />
              <span className="d"> Don’t have an account? </span>
              <Link
                to="/register"
                className="text-primary text-decoration-none"
              >
                Register here
              </Link>
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={loginForm.values.rememberMe}
                    onChange={loginForm.handleChange}
                    color="primary"
                  />
                }
                label="Remember Me"
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loginForm.isSubmitting}
                sx={{
                  backgroundColor: "#4640DE",
                  color: "#fff",
                  borderRadius: "9px",
                  fontWeight: "bold",
                  py: 1.5,
                  fontSize: "18px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#3a3ad1",
                  },
                }}
              >
                {loginForm.isSubmitting ? "Logging in…" : "Login"}
              </Button>
            </form>

            {emailNotFound && (
              <Box mt={3} textAlign="center" minHeight="60px"></Box>
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
