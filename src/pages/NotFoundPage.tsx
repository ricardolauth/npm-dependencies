import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navigate to the homepage
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: "bold" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: "2rem" }}>
        Oops! The package or it's version you're looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
        sx={{ padding: "10px 20px", fontSize: "1.2rem" }}
      >
        Try again
      </Button>
    </Box>
  );
};

export default NotFoundPage;
