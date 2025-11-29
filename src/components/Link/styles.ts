import styled from "@emotion/styled";

import { Link } from "@/i18n/routing";

export const StyledLink = styled(Link, {
  shouldForwardProp: (prop) =>
    !["light", "bold", "showUnderline", "size"].includes(prop),
})<{
  light?: boolean;
  bold?: boolean;
  showUnderline?: boolean;
  size?: "small" | "regular";
}>(({ theme, light, bold, showUnderline, size }) => ({
  color: light ? theme.palette.primary.light : theme.palette.primary.main,
  ...(bold && { fontWeight: 600 }),
  textDecoration: showUnderline ? "underline" : "none",
  fontSize: size === "small" ? theme.typography.pxToRem(14) : "inherit",
  "&:hover": {
    textDecoration: "underline",
  },
}));
