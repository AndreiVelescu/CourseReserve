"use client";

import { MouseEventHandler, useEffect, useId, useRef, useState } from "react";
import { Popover as MuiPopover } from "@mui/material";

import { PopoverProps } from "./types";
import * as S from "./styles";

export const Popover = ({
  children,
  open,
  onClose,
  onOpen,
  size = "auto",
  verticalPosition = "bottom",
  horizontalPosition = "left",
  triggerComponent,
  sxPaperContainer,
  triggerOnKeyDown,
  onKeyDown,
  ...rest
}: PopoverProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [openState, setOpenState] = useState(false);
  const generatedId = useId();

  // sync internal state with external state
  useEffect(() => {
    if (open === undefined) {
      return;
    }
    setOpenState(open);
  }, [open]);

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    setOpenState(true);
    onOpen?.(event);
  };

  const handleClose: PopoverProps["onClose"] = (event, reason) => {
    setOpenState(false);
    onClose?.(event, reason);
  };

  const id = open ? `popover-${generatedId}` : undefined;

  return (
    <>
      <S.TriggerContainer
        ref={triggerRef}
        aria-describedby={id}
        onClick={handleClick}
        onKeyDown={triggerOnKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={openState}
        aria-haspopup="listbox"
      >
        {triggerComponent}
      </S.TriggerContainer>
      <MuiPopover
        id={id}
        anchorEl={triggerRef.current}
        open={openState}
        onClose={handleClose}
        anchorOrigin={{
          vertical: verticalPosition,
          horizontal: horizontalPosition,
        }}
        onKeyDown={onKeyDown}
        {...rest}
      >
        <S.StyledPaper elevation={8} sx={sxPaperContainer} size={size}>
          {children}
        </S.StyledPaper>
      </MuiPopover>
    </>
  );
};
