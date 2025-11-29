import { FormLabelProps, OutlinedInputProps } from "@mui/material";
import { ReactNode } from "react";

export type InputFieldProps = Pick<
  OutlinedInputProps,
  | "autoFocus"
  | "color"
  | "disabled"
  | "error"
  | "fullWidth"
  | "name"
  | "placeholder"
  | "readOnly"
  | "required"
  | "startAdornment"
  | "endAdornment"
  | "onFocus"
  | "onBlur"
  | "onKeyDown"
  | "onKeyPress"
  | "onKeyUp"
  | "autoComplete"
  | "inputProps"
  | "type"
  | "className"
  | "multiline"
  | "rows"
  | "size"
  | "sx"
> & {
  value: string | null;
  onChange?: (value: string) => void;
  id?: string;
  label?: ReactNode;
  clearable?: boolean;
  ariaLabelClear?: string;
  helperText?: ReactNode;
  invisible?: boolean;
  success?: boolean;
  labelColor?: FormLabelProps["color"];
};
