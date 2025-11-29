import styled, { StyledOptions } from "@emotion/styled";

export const Footer = styled("footer")(({ theme }) => ({
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(0, 1),
  },
}));

export const InfoContainerGrid = styled.div(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  borderTop: "1px solid rgba(175, 175, 175)",
  [theme.breakpoints.down("md")]: {
    gap: theme.spacing(2),
    flexDirection: "column",
  },
  [theme.breakpoints.down("xs")]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

export const LinkContainer = styled.span(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  [theme.breakpoints.down("xs")]: {
    flexDirection: "column",
    flexWrap: "nowrap",
    gap: theme.spacing(1),
    a: {
      color: theme.palette.text.primary,
    },
  },
}));

export const LinkedInIconWrapper = styled.a(() => ({
  display: "flex",
  "& svg path": {
    fill: "#0077B5",
  },
}));

export const ButtonAsLink = styled("button")(({ theme }) => ({
  padding: 0,
  textAlign: "left",
  border: "none",
  background: "none",
  color: theme.palette.primary.light,
  fontSize: theme.typography.pxToRem(16),
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
}));
