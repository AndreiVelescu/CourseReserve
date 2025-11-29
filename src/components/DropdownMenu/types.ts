import { MenuItemProps, MenuProps } from "@mui/material";
import { MouseEventHandler, ReactNode } from "react";

export type DropdownMenuProps = Pick<
  MenuProps,
  | "open"
  | "autoFocus"
  | "children"
  | "classes"
  | "disableAutoFocusItem"
  | "onClose"
  | "sx"
  | "transitionDuration"
  | "variant"
> & {
  triggerComponent: React.ReactNode;
  onOpen: MouseEventHandler<HTMLButtonElement>;
  verticalPosition?: "top" | "center" | "bottom";
  horizontalPosition?: "left" | "center" | "right";
  horizontalOrientation?: "left" | "center" | "right";
  gap?: number;
  disabled?: boolean;
  ariaLabel?: string;
};

export type DropdownMenuItemProps = Pick<
  MenuItemProps,
  | "autoFocus"
  | "children"
  | "classes"
  | "dense"
  | "disableGutters"
  | "divider"
  | "selected"
  | "value"
  | "sx"
  | "onClick"
  | "disabled"
> & {
  icon?: ReactNode;
};
