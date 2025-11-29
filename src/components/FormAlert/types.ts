import { AlertProps } from "../Alert";

export type FormAlertProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  variant?: AlertProps["color"];
};
