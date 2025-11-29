"use client";
import { Stack } from "@mui/material";
import { Controller } from "react-hook-form";

import { useRoutes } from "@/hooks/useRoutes";
import { useRouter } from "@/i18n/routing";

import { FormError } from "../FormError";
import { InputField } from "../InputField";
import { PasswordField } from "../PasswordField";

import * as S from "./styles";
import { AuthenticationFormProps } from "./types";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const AuthenticationForm = ({
  children,
  onSubmit,
  control,
  trigger,
  error,
  onFormChange,
  onWrapperModalClose,
}: AuthenticationFormProps) => {
  const rootRoutes = useRoutes();
  const router = useRouter();

  const translateContent = useTranslations("SignUpPage");

  return (
    <form onChange={onFormChange} onSubmit={onSubmit}>
      <Stack mb={2}>
        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <InputField
              id="email"
              value={value || null} // to solve chrome autofill issue
              onChange={onChange}
              onBlur={() => trigger("email")}
              placeholder="eg: name@email.com"
              label={translateContent("Email")}
              fullWidth
              error={Boolean(error)}
              helperText={error?.message || ""}
            />
          )}
        />
      </Stack>
      <Stack mb={2}>
        <Controller
          name="password"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <PasswordField
              value={value || null} // to solve chrome autofill issue
              id={"password"}
              placeholder="Enter password"
              label={translateContent("Password")}
              fullWidth
              error={Boolean(error)}
              helperText={error?.message}
              onChange={onChange}
              onBlur={() => trigger("password")}
            />
          )}
        />
      </Stack>
      <FormError error={error} />
      {children}
      <S.InfoContainer>
        {/* <S.StyledLink
          underline="hover"
          tabIndex={0}
          role="link"
          onClick={handleResetPasswordLink}
        >
          {translateContent("Forgot password?")}
        </S.StyledLink>
          Forgot password?
        </S.StyledLink> */}
      </S.InfoContainer>
    </form>
  );
};
