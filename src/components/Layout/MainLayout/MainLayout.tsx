"use client";

import * as S from "./styles";
import { MainLayoutProps } from "./types";

export const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <S.StyledContainer className={className}>{children}</S.StyledContainer>
  );
};
