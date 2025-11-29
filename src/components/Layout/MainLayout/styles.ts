import styled from "@emotion/styled";
import { Container } from "@mui/material";

export const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(9.5),
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(4.5),
  },
  [theme.breakpoints.down("xxs")]: {
    paddingTop: theme.spacing(2.25),
  },
}));
