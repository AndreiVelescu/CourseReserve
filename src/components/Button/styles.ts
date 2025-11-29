import styled from "@emotion/styled";
import { Button } from "@mui/material";

import { ButtonProps } from "./types";

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => !["fullHeight"].includes(prop),
})(({ size, fullHeight }: ButtonProps) => ({
  borderRadius: size === "small" ? 0 : "3px",
  ...(fullHeight && { height: "100%" }),
}));

export const HiddenContainer = styled("div")({
  visibility: "hidden",
});

export const CenteredContainer = styled("div")({
  display: "flex",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});
