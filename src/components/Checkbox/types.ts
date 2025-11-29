import { CheckboxProps as MuiCheckboxProps } from "@mui/material";
import { ReactNode } from "react";

export type CheckboxSize = "medium" | "large";

export type CheckboxProps = Pick<
  MuiCheckboxProps,
  | "checked"
  | "classes"
  | "color"
  | "disabled"
  | "id"
  | "indeterminate"
  | "inputProps"
  | "inputRef"
  | "onChange"
  | "onBlur"
  | "required"
  | "sx"
  | "value"
  | "onClick"
> & {
  withLabel?: boolean;
  label: ReactNode;
  ariaLabel?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  size?: CheckboxSize;
};

export type WrapperCheckboxProps = {
  error?: boolean;
  size?: CheckboxSize;
};
