import { AlertProps as MuiAlertProps } from "@mui/material";
import { ReactNode } from "react";

export type DesignTypeVariant = "default" | "primary";

export type AlertProps = Pick<
  MuiAlertProps,
  | "action"
  | "classes"
  | "closeText"
  | "color"
  | "icon"
  | "severity"
  | "onClose"
  | "variant"
  | "sx"
> & {
  designType?: DesignTypeVariant;
  title?: string;
  text?: string;
  children?: ReactNode;
};
