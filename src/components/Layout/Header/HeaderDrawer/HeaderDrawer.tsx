"use client";

import * as S from "./styles";
import { HeaderDrawerProps } from "./types";

export const HeaderDrawer = ({
  children,
  open,
  onClose,
}: HeaderDrawerProps) => {
  return (
    <S.StyledDrawer anchor="top" open={open} onClose={onClose}>
      {children}
    </S.StyledDrawer>
  );
};
