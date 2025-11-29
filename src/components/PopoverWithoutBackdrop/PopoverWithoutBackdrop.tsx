"use client";

import { ReactNode } from "react";
import { ClickAwayListener } from "@mui/base";

import * as S from "./styles";

export const PopoverWithoutBackdrop = ({
  children,
  triggerComponent,
  open,
  handelClose,
}: {
  children: ReactNode;
  triggerComponent: ReactNode;
  open: boolean;
  handelClose: () => void;
}) => {
  return (
    <ClickAwayListener onClickAway={handelClose}>
      <div>
        {triggerComponent}
        {open && (
          <S.StyledPaperPopoverContainer elevation={8} square>
            {children}
          </S.StyledPaperPopoverContainer>
        )}
      </div>
    </ClickAwayListener>
  );
};
