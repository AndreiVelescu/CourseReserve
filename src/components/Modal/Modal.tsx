import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

import * as S from "./styles";
import { ModalCloseReason, ModalProps } from "./types";

export const Modal = ({
  children,
  open,
  onClose,
  size = "small",
  ...rest
}: ModalProps) => {
  return (
    <S.StyledModal {...rest} open={open} onClose={onClose}>
      <S.ModalContainer size={size}>
        <S.ExitContainer>
          <IconButton
            size="small"
            aria-label="close modal"
            onClick={(e) => {
              onClose && onClose(e, ModalCloseReason.exitButtonClick);
            }}
          >
            <CloseIcon />
          </IconButton>
        </S.ExitContainer>
        {children}
      </S.ModalContainer>
    </S.StyledModal>
  );
};
