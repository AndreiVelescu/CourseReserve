import styled from "@emotion/styled";
import { svgIconClasses } from "@mui/material";

import { WrapperCheckboxProps } from "./types";

export const WrapperCheckbox = styled.span<WrapperCheckboxProps>(
  ({ error, theme, size }) => ({
    [`& .${svgIconClasses.root}`]: {
      color: error ? theme.palette.error.main : undefined,
      width: size === "large" ? "28px" : "24px",
      height: size === "large" ? "28px" : "24px",
    },
  }),
);
