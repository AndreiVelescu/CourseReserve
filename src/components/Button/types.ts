import { ButtonProps as MuiButtonProps } from "@mui/material";

export type ButtonProps = Pick<
  MuiButtonProps,
  | "children"
  | "disabled"
  | "variant"
  | "color"
  | "endIcon"
  | "fullWidth"
  | "href"
  | "size"
  | "startIcon"
  | "onFocusVisible"
  | "onFocus"
  | "onBlur"
  | "onClick"
  | "onDoubleClick"
  | "onMouseDown"
  | "onMouseEnter"
  | "onMouseLeave"
  | "onMouseMove"
  | "onMouseOut"
  | "onMouseOver"
  | "onMouseUp"
  | "onTouchCancel"
  | "onTouchEnd"
  | "onTouchMove"
  | "onTouchStart"
  | "type"
  | "sx"
> & {
  loading?: boolean;
  loadingPosition?: "start" | "end" | "center";
  component?: React.ElementType;
  target?: HTMLAnchorElement["target"];
  ariaLabel?: string;
  fullHeight?: boolean;
  capitalize?: boolean;
};
