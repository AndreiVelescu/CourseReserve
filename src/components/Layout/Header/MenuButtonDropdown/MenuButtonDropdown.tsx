"use client";

import { useState } from "react";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { PopoverWithoutBackdrop } from "@/components/PopoverWithoutBackdrop";

import { MenuButtonDropdownProps } from "./types";
import * as S from "./styles";

export const MenuButtonDropdown = ({
  links,
  children,
  isLightTheme,
}: MenuButtonDropdownProps) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const isTabletScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <PopoverWithoutBackdrop
      open={open}
      handelClose={onClose}
      triggerComponent={
        <S.DropdownButton
          endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          color={isLightTheme ? "inheritText" : "inheritWhite"}
          size={isTabletScreen ? "medium" : "large"}
          ariaLabel={children.toLowerCase()}
          onClick={onOpen}
        >
          {children}
        </S.DropdownButton>
      }
    >
      {links.map((link) => (
        <S.StyledLink
          onClick={() => setOpen(false)}
          href={link.href}
          key={link.href}
          aria-label={link.label}
        >
          <Typography variant="body1" color="text.primary">
            {link.label}
          </Typography>
        </S.StyledLink>
      ))}
    </PopoverWithoutBackdrop>
  );
};
