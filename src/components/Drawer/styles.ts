import { Drawer, alpha, modalClasses } from "@mui/material";
import styled from "@emotion/styled";

export const StyledMuiDrawer = styled(Drawer)(({ theme }) => ({
  [`& .${modalClasses.backdrop}`]: {
    backgroundColor: alpha(theme.palette.primary.dark, 0.6),
  },
}));
