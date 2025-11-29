import { PopoverProps as MuiPopoverProps } from "@mui/material";
import { SxProps } from "@mui/system";
import { KeyboardEventHandler, MouseEventHandler, ReactNode } from "react";

import { Theme } from "@/theme";

export type PopoverSize = "auto" | "small" | "medium" | "large";

export type PopoverProps = Pick<
  MuiPopoverProps,
  | "anchorEl"
  | "anchorPosition"
  | "anchorReference"
  | "children"
  | "classes"
  | "elevation"
  | "sx"
  | "transformOrigin"
  | "transitionDuration"
  | "slotProps"
> & {
  size?: PopoverSize;
  verticalPosition?: "top" | "center" | "bottom";
  horizontalPosition?: "left" | "center" | "right";
  triggerOnKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  /**
   * open, onClose, onOpen to be used for controlled popovers
   */
  open?: boolean;
  onClose?: MuiPopoverProps["onClose"];
  onOpen?: MouseEventHandler<HTMLDivElement>;
  triggerComponent: ReactNode;
  sxPaperContainer?: SxProps<Theme>;
};
