"use client";

import * as S from "./styles";
import { LogoProps } from "./types";

export const Logo = ({ ariaLabel, role }: LogoProps) => {
  return (
    <S.LogoLink href={`/`} ariaLabel={ariaLabel}>
      CourseReserve
    </S.LogoLink>
  );
};
