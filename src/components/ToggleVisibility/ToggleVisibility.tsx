"use client";

import { ToggleVisibilityProps } from "./types";
import * as S from "./styles";

export const ToggleVisibility = ({
  children,
  showChildren,
  componentShowedFirst,
  className,
}: ToggleVisibilityProps) => {
  return (
    <S.Wrapper className={className}>
      <S.Hide hide={showChildren}>{componentShowedFirst}</S.Hide>
      <S.Hide hide={!showChildren}>{children}</S.Hide>
    </S.Wrapper>
  );
};
