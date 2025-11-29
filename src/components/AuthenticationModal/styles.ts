import styled from "@emotion/styled";
import { Modal, alpha, modalClasses } from "@mui/material";

export const StyledModal = styled(Modal)(({ theme }) => ({
  [`& .${modalClasses.backdrop}`]: {
    backgroundColor: alpha(theme.palette.primary.dark, 0.6),
  },
}));

export const ModalContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 1152,
  // 6 * base spacing from padding and another 4 * base for spacing at the sides of the screen when modal maxWidth is smaller than window size
  width: `calc(100% - ${theme.spacing(3 * 2)} - ${theme.spacing(4)})`,
  display: "flex",
  justifyContent: "center",
  overflowY: "auto",
  overflowX: "hidden", // added this because modal overflows because of captcha
  "&:focus-visible": {
    outline: "none",
  },

  [theme.breakpoints.down("xxs")]: {
    width: `calc(100% - ${theme.spacing(2 * 2)})`,
    padding: theme.spacing(2),
  },
}));
