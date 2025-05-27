import Grid from "@mui/material/Grid2";
import { Box, Button, Typography } from "@mui/material";

export default function CardCompanies() {
  return (
    <>
      <Grid container sx={{ margin: 10 }} spacing={8}>
        <Grid item size={{ xs: 2, md: 4 }} sx={{ display: "flex" }}>
          <Box sx={{ backgroundColor: "#1A75E8", width: 60, height: 300 }}>
            <img src="" alt="" />
          </Box>

          <Box sx={{ backgroundColor: "#F1F1F1", width: 400, padding: 4 }}>
            <Typography sx={{ fontSize: 37, fontWeight: 780 }}>
              Company Name : Samsung
            </Typography>
            <br />

            <Typography sx={{ fontSize: 27 }}>www.Samsung.com</Typography>
            <br />
            <Button
              variant="contained"
              sx={{
                width: 320,
                height: 50,
                fontSize: 20,
                backgroundColor: "#1A75E8",
              }}
            >
              {" "}
              Company Details
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
