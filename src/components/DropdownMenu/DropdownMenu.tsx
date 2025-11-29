"use client";

import { useId, useRef } from "react";

import * as S from "./styles";
import { DropdownMenuItemProps, DropdownMenuProps } from "./types";

export const DropdownMenu = ({
  triggerComponent,
  open,
  onClose,
  onOpen,
  children,
  verticalPosition = "bottom",
  horizontalPosition = "left",
  horizontalOrientation = "left",
  gap,
  disabled,
  ariaLabel,
  ...rest
}: DropdownMenuProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const generatedButtonId = useId();
  const generatedMenuId = useId();

  const buttonId = `button-${generatedButtonId}`;
  const menuId = `menu-${generatedMenuId}`;

  return (
    <>
      <S.ResetButton
        ref={buttonRef}
        id={buttonId}
        aria-controls={open ? `${menuId}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={onOpen}
        disabled={disabled}
        type="button"
        aria-label={ariaLabel}
      >
        {triggerComponent}
      </S.ResetButton>
      <S.StyledMenu
        {...rest}
        id={menuId}
        anchorEl={buttonRef.current}
        open={open}
        MenuListProps={{
          "aria-labelledby": buttonId,
        }}
        onClose={onClose}
        anchorOrigin={{
          vertical: verticalPosition,
          horizontal: horizontalPosition,
        }}
        transformOrigin={{
          vertical: gap ?? 0,
          horizontal: horizontalOrientation,
        }}
      >
        {children}
      </S.StyledMenu>
    </>
  );
};

const DropdownMenuItem = ({
  children,
  icon,
  ...rest
}: DropdownMenuItemProps) => {
  return (
    <S.StyledMenuItem {...rest}>
      {icon && <S.IconWrapper>{icon}</S.IconWrapper>}
      {children}
    </S.StyledMenuItem>
  );
};

const DropdownMenuContent = ({
  children,
  ...rest
}: Omit<DropdownMenuItemProps, "disabled" | "icon">) => {
  return (
    <S.StyledMenuItemContent {...rest} disabled>
      {children}
    </S.StyledMenuItemContent>
  );
};

DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Content = DropdownMenuContent;
