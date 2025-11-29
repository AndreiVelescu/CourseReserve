import styled from "@emotion/styled";
import { Paper } from "@mui/material";

export const Wrapper = styled.div(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(6, 3),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4.5, 0),
  },
  [theme.breakpoints.down("xs")]: {
    padding: theme.spacing(2),
  },
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4.5),
  marginBottom: theme.spacing(4.5),
  maxWidth: "564px",
  width: "100%",
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(3),
  },
  [theme.breakpoints.down("xs")]: {
    padding: theme.spacing(4.5, 2.25),
  },
}));
