import { ModalProps as MuiModalProps } from "@mui/material";
import { MouseEvent, ReactNode } from "react";

export type ModalSize = "small" | "medium" | "large";
export enum ModalCloseReason {
  backdropClick = "backdropClick",
  escapeKeyDown = "escapeKeyDown",
  exitButtonClick = "exitButtonClick",
}

export type ModalProps = Pick<
  MuiModalProps,
  | "open"
  | "classes"
  | "closeAfterTransition"
  | "disableAutoFocus"
  | "disableEnforceFocus"
  | "disableEscapeKeyDown"
  | "disablePortal"
  | "disableRestoreFocus"
  | "disableScrollLock"
  | "hideBackdrop"
  | "keepMounted"
  | "sx"
> & {
  size?: ModalSize;
  children: ReactNode;
  // `${ModalCloseReason}` => get the values of ModalCloseReason enum as a union type
  onClose: (
    event: MouseEvent<HTMLElement>,
    reason: `${ModalCloseReason}`,
  ) => void;
};

export type ModalContainerProps = {
  size: ModalSize;
};
