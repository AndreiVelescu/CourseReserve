"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

import { LoginFormType, useLoginForm } from "@/hooks/useLoginForm";
import { useRoutes } from "@/hooks/useRoutes";
import { Link } from "@/i18n/routing";

import { AuthenticationForm } from "../AuthenticationForm/AuthenticationForm";
import { Button } from "../Button";

import * as S from "./styles";
import { useTranslations } from "next-intl";

export const LoginForm = ({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);

  const [isLoginDisabled, setIsLoginDisabled] = useState(false);
  const rootRoutes = useRoutes();
  const translateContent = useTranslations("SignUpPage");

  const {
    handleSubmit,
    formState: { isValid },
    control,
    setValue,
    trigger,
    // setError: setFieldError,
    clearErrors,
  } = useLoginForm();

  useEffect(() => {
    // Set the values to empty string when the component is mounted because of Chrome autofill bug
    setValue("email", "");
    setValue("password", "");
  }, [setValue]);

  const onSubmit = async (data: LoginFormType) => {
    const email = data.email.toLowerCase();

    setLoading(true);

    await signIn("credentials", {
      username: email,
      password: data.password,
      redirect: false,
    }).then((res) => {
      if (!res?.ok && res?.error) {
        setError(res?.error);
      } else if (res?.ok) {
        setError(null);
        onLoginSuccess();
      }
      setLoading(false);
    });
  };

  const onFinish = () => {
    setTimerEnabled(false);
    clearErrors("email");
    setError("");
  };

  // The button should NOT be disabled if resendVerificationLinkEnabled is true, this will only happen if user has not already verified their email (from BE => email_verified: false)
  const buttonDisabled = !isValid || Boolean(error);

  return (
    <AuthenticationForm
      onSubmit={handleSubmit(onSubmit)}
      control={control}
      trigger={trigger}
      error={error}
      onFormChange={() => setError(null)}
    >
      <S.StyledButton
        disabled={timerEnabled || buttonDisabled}
        loading={loading}
        fullWidth
        variant="contained"
        type="submit"
      >
        {translateContent("Log in")}
      </S.StyledButton>
    </AuthenticationForm>
  );
};
