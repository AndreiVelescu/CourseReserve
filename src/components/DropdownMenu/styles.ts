import styled from "@emotion/styled";
import {
  Divider,
  Menu,
  MenuItem,
  menuClasses,
  dividerClasses,
  menuItemClasses,
} from "@mui/material";

export const ResetButton = styled.button(() => ({
  border: "none",
  margin: 0,
  padding: 0,
  width: "auto",
  overflow: "visible",
  background: "transparent",
  cursor: "pointer",
}));

export const StyledDivider = styled(Divider)(() => ({
  [`&.${dividerClasses.root}`]: {
    marginTop: 0,
    marginBottom: 0,
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

export const StyledMenuItemContent = styled(StyledMenuItem)((props) => ({
  [`&.${menuItemClasses.disabled}`]: {
    opacity: 1,
    pointerEvents: "all",
    userSelect: "auto",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

export const IconWrapper = styled.div(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: "flex",
}));

export const StyledMenu = styled(Menu)(() => ({
  [`& .${menuClasses.paper}`]: {
    borderRadius: 0,
    minWidth: "220px",
  },
}));
