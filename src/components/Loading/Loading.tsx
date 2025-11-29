"use client";

import { CircularProgress } from "@mui/material";

import * as S from "./styles";
import { LoadingProps } from "./types";

export const Loading = ({ topPadding, bottomPadding }: LoadingProps) => {
  return (
    <S.Container topPadding={topPadding} bottomPadding={bottomPadding}>
      <CircularProgress size="50px" aria-label="circular loading" />
    </S.Container>
  );
};
