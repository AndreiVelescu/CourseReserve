"use client";

import { CircularProgress, useMediaQuery, useTheme } from "@mui/material";

import { AvatarDropdownMenu } from "../AvatarDropdownMenu";
import { LoginButton } from "../LoginButton";

import { AuthButtonsProps } from "./types";

export const AuthButtons = ({
  isLogged,
  isAuthLoading,
  isLightTheme,
  forceShowCloseIcon,
  showDrawer,
  onDrawerOpen,
  onDrawerClose,
}: AuthButtonsProps) => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (isAuthLoading) {
    return <CircularProgress size={38} />;
  }

  if (isLogged) {
    return <AvatarDropdownMenu />;
  }

  return (
    <LoginButton
      isLightTheme={isLightTheme}
      isMobileScreen={isMobileScreen}
      ariaLabel="Log in/Register"
    />
  );
};
