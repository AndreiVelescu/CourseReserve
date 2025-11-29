import { OutlinedInputProps } from "@mui/material";
import {
  Control,
  FieldValues,
  Path,
  UseFormGetFieldState,
  UseFormTrigger,
} from "react-hook-form";
import { ReactNode } from "react";

import { ChecklistItem } from "../Checklist";

export type PasswordFieldProps = Pick<
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
  | "onBlur"
  | "autoComplete"
> & {
  value: string | null;
  onChange: (value: string) => void;
  id: string;
  label?: string;
  ariaLabelVisibility?: string;
  helperText?: ReactNode;
  defaultVisibility?: boolean;
};

export type UsePasswordChecklist = <FormType extends FieldValues>(props: {
  emailId: Path<FormType>;
  passwordId: Path<FormType>;
  confirmPasswordId: Path<FormType>;
  control: Control<FormType>;
  trigger: UseFormTrigger<FormType>;
  getFieldState: UseFormGetFieldState<FormType>;
}) => {
  passwordChecklist: ChecklistItem[];
  onBlurPassword: () => void;
  onBlurConfirmPassword: () => void;
};
