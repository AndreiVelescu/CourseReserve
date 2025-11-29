"use client";

import { Container } from "@mui/material";

import * as S from "./styles";
import { HeroSectionResourceProps } from "./types";

export const HeroSectionResource = ({ children }: HeroSectionResourceProps) => {
  return (
    <S.HeroSection>
      <Container>{children}</Container>
    </S.HeroSection>
  );
};
