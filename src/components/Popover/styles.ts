import styled from "@emotion/styled";
import { Paper, Theme } from "@mui/material";

import { PopoverSize } from "./types";

const getPaperSizes = (theme: Theme): Record<PopoverSize, string> => {
  return {
    auto: "none",
    small: theme.spacing(38),
    medium: theme.spacing(60),
    large: theme.spacing(120),
  };
};

export const TriggerContainer = styled.div(({ theme }) => ({
  cursor: "pointer",
  display: "inline-block",
  marginTop: "-1px",
  ["&:focus"]: {
    outline: "none",
  },
  ["&:focus > div"]: {
    background: theme.palette.background.secondary,
    paddingBottom: "3px",
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
}));

export const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => !["size"].includes(prop),
})<{
  size: PopoverSize;
}>(({ size, theme }) => ({
  padding: theme.spacing(2),
  maxWidth: getPaperSizes(theme)[size],
}));
