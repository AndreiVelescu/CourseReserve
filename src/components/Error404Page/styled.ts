import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: "6rem",
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

export const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  fontSize: "1rem",
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius,
}));
