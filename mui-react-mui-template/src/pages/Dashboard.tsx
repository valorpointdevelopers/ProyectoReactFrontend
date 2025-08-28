import React from "react";
import { Container, Box, Typography } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Bienvenido al Panel de Control
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Aquí podrás gestionar tu sistema 🚀
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
