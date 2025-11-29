"use client";

import { useTranslations } from "next-intl";

import { Stack, Typography } from "@mui/material";

import { Button } from "@/components/Button";
import { FormAlert } from "@/components/FormAlert/FormAlert";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import { useRoutes } from "@/hooks/useRoutes";
import { Link } from "@/i18n/routing";

import * as S from "./styles";
import { AuthenticationProps } from "./types";

export const Authentication = ({
  alertMessage,
  onCloseAlert,
  isAlertError,
  onLoginSuccess,
}: AuthenticationProps) => {
  const rootRoutes = useRoutes();
  const translateContent = useTranslations("SignUpPage");

  return (
    <S.StyledPaper elevation={1}>
      <S.FlexContainer>
        <Stack mb={2}>
          <Typography variant="h4" textAlign="left">
            {translateContent("Log in")}
          </Typography>
        </Stack>
        {alertMessage && onCloseAlert && (
          <FormAlert
            isOpen={Boolean(alertMessage)}
            onClose={onCloseAlert}
            title={alertMessage}
            variant={isAlertError ? "error" : "success"}
          />
        )}
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </S.FlexContainer>

      <S.FlexContainer>
        <Stack mb={2}>
          <Typography variant="h4" textAlign="left">
            {translateContent("Register")}
          </Typography>
        </Stack>
        <Stack mb={2}>
          <Typography variant="body1" color={"textPrimary"}>
            {translateContent("Create account")}
          </Typography>
        </Stack>
        <Button
          fullWidth
          variant="outlined"
          component={Link}
          href={rootRoutes.signUp}
        >
          {translateContent("Register")}
        </Button>
      </S.FlexContainer>
    </S.StyledPaper>
  );
};
