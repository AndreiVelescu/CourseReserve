import { DrawerProps as MuiDrawerProps } from "@mui/material";

export type DrawerProps = Pick<
  MuiDrawerProps,
  | "anchor"
  | "children"
  | "elevation"
  | "hideBackdrop"
  | "className"
  | "onClose"
  | "open"
  | "sx"
  | "transitionDuration"
  | "variant"
  | "ModalProps"
>;
