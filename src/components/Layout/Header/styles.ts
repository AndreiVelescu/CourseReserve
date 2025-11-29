import styled from "@emotion/styled";
import { AppBar } from "@mui/material";

import { Link } from "@/i18n/routing";

export const Wrapper = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  minHeight: 76,

  [theme.breakpoints.down("xl")]: {
    minHeight: 62,
  },
}));

export const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => !["emptyDesign", "isLightTheme"].includes(prop),
})<{ isLightTheme?: boolean }>(({ theme }) => ({
  backgroundColor: "#fafafa",
  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
  minHeight: 76,
  [theme.breakpoints.down("xl")]: {
    // used to get the drawer under the app bar
    minHeight: 62,
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export const MinimalDesignWrapper = styled.div(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const MainContainer = styled.div(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
}));

export const LeftContainer = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 14,
  color: "white",
}));

export const MenuButtonLink = styled(Link, {
  shouldForwardProp: (prop) => !["active"].includes(prop),
})<{ active?: boolean }>(({ theme, active }) => ({
  fontSize: theme.typography.pxToRem(14),
  fontWeight: 500,
  textTransform: "uppercase",
  padding: theme.spacing(1),
  textShadow: active ? ".15px 0px .1px, -.15px 0px .1px" : "none",
  textDecoration: "none",
  color: theme.palette.text.primary,
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(0, 1),
  },
  "&:hover": {
    backgroundColor: "transparent",
    textDecoration: "none",
  },
}));

export const MenuItemsContainer = styled.nav(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0),
}));

export const RightContainer = styled.div(() => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  justifyContent: "end",
  flex: 1,
}));
