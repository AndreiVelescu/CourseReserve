import { FormEventHandler, ReactNode } from "react";
import { useForm } from "react-hook-form";

import { LoginFormType } from "@/hooks/useLoginForm";

export type AuthenticationFormProps = {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  control: ReturnType<typeof useForm<LoginFormType>>["control"];
  trigger: ReturnType<typeof useForm<LoginFormType>>["trigger"];
  error?: string | null;
  onFormChange?: () => void;
  onWrapperModalClose?: () => void;
};
