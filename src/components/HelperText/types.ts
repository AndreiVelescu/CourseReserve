import { FormHelperTextProps } from "@mui/material";

export type HelperTextProps = Pick<
  FormHelperTextProps,
  | "children"
  | "classes"
  | "disabled"
  | "filled"
  | "focused"
  | "margin"
  | "required"
  | "sx"
  | "variant"
  | "className"
> & {
  error?: boolean;
  success?: boolean;
  textSecondary?: boolean;
};
