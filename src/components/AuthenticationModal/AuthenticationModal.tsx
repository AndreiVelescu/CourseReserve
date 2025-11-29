"use client";

import { Authentication } from "../Authentication/Authentication";

import * as S from "./styles";
import { AuthenticationModalProps } from "./types";

export const AuthenticationModal = ({
  open,
  onClose,
  onLoginSuccess,
}: AuthenticationModalProps) => {
  return (
    <S.StyledModal open={open} onClose={onClose}>
      <S.ModalContainer>
        <Authentication onLoginSuccess={onLoginSuccess} />
      </S.ModalContainer>
    </S.StyledModal>
  );
};
