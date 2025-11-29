"use client";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

import { NotFoundContainer, StyledButton, Subtitle, Title } from "./styled";

export const Error404Page: React.FC = () => {
  const router = useRouter();
  const translate = useTranslations("Error404");

  return (
    <NotFoundContainer>
      <Title>{translate("404")}</Title>
      <Subtitle>
        {translate("Oops The page youre looking for doesnt exist")}
      </Subtitle>
      <Box
        component="img"
        src="/404-illustration.svg"
        alt={translate("404 Illustration")}
        width={300}
        height={200}
      />
      <StyledButton
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
      >
        {translate("Go Home")}
      </StyledButton>
    </NotFoundContainer>
  );
};
