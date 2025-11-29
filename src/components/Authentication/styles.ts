import styled from "@emotion/styled";
import { Paper } from "@mui/material";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(7.5, 15),
  display: "flex",
  gap: theme.spacing(9),
  width: "100%",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: theme.spacing(3),
    padding: theme.spacing(4.5, 9),
    maxWidth: "492px",
  },
  [theme.breakpoints.down("xs")]: {
    padding: theme.spacing(1.5, 3),
  },
}));

export const FlexContainer = styled.div(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3, 0, 4.5, 0),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2, 0, 3, 0),
  },
  [theme.breakpoints.down("xs")]: {
    padding: theme.spacing(1.2, 0, 2.25, 0),
  },
}));
