import React, { useState } from "react";
import { Box, Typography, TextField, Button, Container } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./Footer.css"; // استيراد ملف CSS الخاص بالمكون

function Footer() {
  // تم تغيير اسم المكون إلى Footer
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // هنا يمكنك إضافة منطق إرسال البريد الإلكتروني إلى الخادم
    console.log("Subscribing with email:", email);
    // يمكنك إضافة رسالة نجاح أو خطأ للمستخدم هنا
    alert(`Thank you for subscribing, ${email}!`);
    setEmail(""); // مسح حقل البريد الإلكتروني بعد الاشتراك
  };

  return (
    <Box className="app-footer">
      {" "}
      {/* تم تغيير الكلاس الأساسي إلى app-footer */}
      <Container maxWidth="lg" className="footer-container">
        {" "}
        {/* تم تغيير الكلاس إلى footer-container */}
        <Box className="footer-content">
          {" "}
          {/* تم تغيير الكلاس إلى footer-content */}
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            sx={{ color: "#fff", mb: 2 }}
          >
            Find your next great opportunity!
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#fff", opacity: 0.8, mb: { xs: 4, md: 0 } }}
          >
            Join our newsletter and receive the best job openings every week on
            your inbox.
          </Typography>
        </Box>
        <Box className="footer-form" component="form" onSubmit={handleSubmit}>
          {" "}
          {/* تم تغيير الكلاس إلى footer-form */}
          <TextField
            fullWidth
            type="email"
            placeholder="Enter your email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "5px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "5px",
                paddingRight: "0",
              },
              "& input": {
                padding: "12px 15px",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            sx={{
              ml: 1,
              bgcolor: "#4640DE",
              color: "#fff",
              px: 4,
              py: 1.5,
              borderRadius: "5px",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#3832B5",
              },
              whiteSpace: "nowrap",
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 2, sm: 0 },
            }}
          >
            SUBSCRIBE
          </Button>
        </Box>
      </Container>
      <Box className="footer-bottom-text">
        {" "}
        {/* تم تغيير الكلاس إلى footer-bottom-text */}
        <Typography variant="body2" sx={{ color: "#fff", opacity: 0.7 }}>
          Join 15,000+ users already on the newsletter!
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer; // تصدير المكون باسم Footer
