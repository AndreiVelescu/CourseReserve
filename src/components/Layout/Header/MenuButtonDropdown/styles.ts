import styled from "@emotion/styled";
import { paperClasses } from "@mui/material";

import { Button } from "@/components/Button";
import { Popover } from "@/components/Popover";
import { Link } from "@/i18n/routing";

export const StyledPopover = styled(Popover)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [`& .${paperClasses.root}`]: { width: theme.spacing(35), borderRadius: 0 },
}));
export const DropdownButton = styled(Button)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
  fontWeight: 500,
  color: theme.palette.text.primary,
  textTransform: "uppercase",
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  display: "block",
  textDecoration: "none",
  padding: theme.spacing(1, 2, 0.25),
  "&:last-child": {
    marginBottom: 0,
  },
}));
