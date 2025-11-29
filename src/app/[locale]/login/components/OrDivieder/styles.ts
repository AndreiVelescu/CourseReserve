import styled from "@emotion/styled";
import { Divider, Typography } from "@mui/material";

export const OrDividerContainer = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    flexDirection: "row",
  },
}));

export const StyledDivider = styled(Divider)(() => ({
  flex: 1,
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(0, 1),
  },
}));
