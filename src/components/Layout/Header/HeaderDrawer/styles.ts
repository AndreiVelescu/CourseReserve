import styled from "@emotion/styled";
import { backdropClasses, drawerClasses, paperClasses } from "@mui/material";

import { Drawer } from "@/components/Drawer";
import { TOOLBAR_HEIGHT_DESKTOP, TOOLBAR_HEIGHT_MOBILE } from "@/theme";

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  [`&.${drawerClasses.root}`]: {
    position: "inherit",
  },
  [`&.${drawerClasses.root} > .${paperClasses.root}`]: {
    top: TOOLBAR_HEIGHT_DESKTOP,
    backgroundColor: "transparent",
    boxShadow: "none",
    // The bottom padding is added as a safe margin to make sure the content is not hidden by the bottom mobile navigation
    paddingBottom: "120px",
    [theme.breakpoints.down("sm")]: {
      top: TOOLBAR_HEIGHT_MOBILE,
    },
  },
  [`.${backdropClasses.root}`]: {
    top: TOOLBAR_HEIGHT_DESKTOP,
    [theme.breakpoints.down("sm")]: {
      top: TOOLBAR_HEIGHT_MOBILE,
    },
    zIndex: theme.zIndex.drawer,
  },
}));
