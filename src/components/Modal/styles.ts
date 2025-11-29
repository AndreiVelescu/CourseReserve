import styled from "@emotion/styled";
import { Modal, alpha, modalClasses } from "@mui/material";

import { ModalContainerProps } from "./types";

const sizes = {
  small: "460px",
  medium: "620px",
  large: "950px",
};

export const ModalContainer = styled("div", {
  shouldForwardProp: (prop) => !["size"].includes(prop),
})<ModalContainerProps>(({ size, theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // 6 * base spacing from padding and another 4 * base for spacing at the sides of the screen when modal maxWidth is smaller than window size
  width: `calc(100% - ${theme.spacing(3 * 2)} - ${theme.spacing(4)})`,
  maxWidth: sizes[size],
  backgroundColor: "white",
  maxHeight: "80%",
  overflowY: "auto",
  padding: size === "large" ? theme.spacing(6) : theme.spacing(3),
  paddingTop: size === "large" ? theme.spacing(5.5) : theme.spacing(3),
  borderRadius: theme.spacing(1),
  "&:focus-visible": {
    outline: "none",
  },

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
  },

  [theme.breakpoints.down("xxs")]: {
    width: `calc(100% - ${theme.spacing(2 * 2)})`,
  },
}));

export const StyledModal = styled(Modal)(({ theme }) => ({
  [`& .${modalClasses.backdrop}`]: {
    backgroundColor: alpha(theme.palette.primary.dark, 0.6),
  },
}));

export const ExitContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: -5,
  paddingBottom: theme.spacing(0.5),
  svg: {
    color: theme.palette.inheritWhite.contrastText,
  },
}));
