import styled from "@emotion/styled";
import { Link } from "@mui/material";

export const InfoContainer = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  textTransform: "uppercase",
  fontWeight: 500,
  letterSpacing: "0.5px",
  marginTop: theme.spacing(1),
  gap: theme.spacing(1),
}));

export const StyledLink = styled(Link)(() => ({
  cursor: "pointer",
}));
