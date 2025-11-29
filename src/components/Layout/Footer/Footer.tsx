"use client";

import { Container, Typography } from "@mui/material";

import { Logo } from "@/components/Logo";
import { Link } from "@/components/Link";

import * as S from "./styles";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const translateContent = useTranslations("Navigation");
  return (
    <>
      <S.Footer>
        <Container>
          <S.InfoContainerGrid>
            <Typography variant="caption" p={0}>
              © {currentYear} Andrew Nicu Madalina
            </Typography>
            <Logo
              variant="light"
              ariaLabel="logo, link to home page"
              role="img"
            />
          </S.InfoContainerGrid>
        </Container>
      </S.Footer>
    </>
  );
};
