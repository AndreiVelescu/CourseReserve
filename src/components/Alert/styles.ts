import styled from "@emotion/styled";
import { Alert, AlertTitle, Typography, alertClasses } from "@mui/material";

import { DesignTypeVariant } from "./types";

export const StyledAlert = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "designType",
})<{
  designType?: DesignTypeVariant;
}>(({ theme, designType }) => ({
  fontWeight: 500,
  fontSize: "1rem",
  ...(designType === "primary" && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.light,
    [`& .${alertClasses.icon}`]: {
      color: theme.palette.text.light,
    },
  }),
}));

export const StyledAlertTitle = styled(AlertTitle)(() => ({
  marginTop: 0,
  marginBottom: 0,
  paddingBottom: 0,
}));

export const StyledTypographyDescription = styled(Typography)(({ theme }) => ({
  paddingBottom: 0,
  fontSize: theme.typography.pxToRem(14),
  lineHeight: 1.43,
  fontWeight: 500,
  letterSpacing: 0.15,
}));
