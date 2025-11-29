"use client";

import { Ref, forwardRef } from "react";

import * as S from "./styles";
import { LinkProps } from "./types";

export const Link = forwardRef(
  (
    { children, ariaLabel, ...rest }: LinkProps,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    return (
      <S.StyledLink ref={ref} {...rest} aria-label={ariaLabel}>
        {children}
      </S.StyledLink>
    );
  },
);
