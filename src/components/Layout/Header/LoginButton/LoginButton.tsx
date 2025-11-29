"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/Button";
import { useRouteHelpers } from "@/utils/routerHelpers";

import * as S from "./styles";
import { LoginButtonProps } from "./types";
import { useTranslations } from "next-intl";

// Dynamically import modal
const DynamicAuthenticationModal = dynamic(
  () =>
    import("@/components/AuthenticationModal/AuthenticationModal").then(
      (mod) => mod.AuthenticationModal,
    ),
  { ssr: false },
);

export const LoginButton = ({
  isLightTheme,
  isMobileScreen,
  ariaLabel,
}: LoginButtonProps) => {
  const searchParams = useSearchParams();
  const isModalOpen = searchParams.get("loginModal") === "true";

  const [authenticationModal, setAuthenticationModal] = useState(isModalOpen);

  const { pushSearchParamsOnly, removeSearchParamsOnly } = useRouteHelpers();
  const translateContent = useTranslations("SignUpPage");

  const onClickLoginRegister = () => {
    pushSearchParamsOnly({ name: "loginModal", value: "true" });
  };

  const onClose = () => {
    removeSearchParamsOnly({ name: "loginModal" });
  };

  const onLoginSuccess = () => {
    removeSearchParamsOnly({ name: "loginModal" });
  };

  useEffect(() => {
    if (isModalOpen) {
      setAuthenticationModal(true);
    } else {
      setAuthenticationModal(false);
    }
  }, [isModalOpen]);

  return (
    <>
      <S.StyledLoginBtnWrapper
        isLightTheme={isLightTheme}
        isMobileScreen={isMobileScreen}
      >
        <Button
          variant="outlined"
          onClick={onClickLoginRegister}
          color={isLightTheme ? "inheritWhite" : "primary"}
          fullWidth={isMobileScreen}
          ariaLabel={ariaLabel}
        >
          {translateContent("Log in")}/{translateContent("Register")}
        </Button>
      </S.StyledLoginBtnWrapper>
      {authenticationModal && (
        <DynamicAuthenticationModal
          open={authenticationModal}
          onClose={onClose}
          onLoginSuccess={onLoginSuccess}
        />
      )}
    </>
  );
};
