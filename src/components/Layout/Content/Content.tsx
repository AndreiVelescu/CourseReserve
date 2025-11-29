"use client";

import * as S from "./styles";
import { ContentProps } from "./types";

export const Content = ({ children }: ContentProps) => {
  return <S.Container>{children}</S.Container>;
};
