import styled from "@emotion/styled";
import { FormHelperText } from "@mui/material";

export const StyledHelperText = styled(FormHelperText)<{
  textSecondary?: boolean;
}>(({ theme, textSecondary }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(0.5),
  marginLeft: 0,
  color: textSecondary
    ? theme.palette.text.secondary
    : theme.palette.text.primary,
}));

export const IconWrapper = styled.span(() => ({
  marginTop: 2,
  "& svg": {
    fontSize: 13,
  },
}));
