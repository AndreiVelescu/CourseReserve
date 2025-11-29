"use client";
import { forwardRef, Ref } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { AlertProps } from "./types";
import * as S from "./styles";

export const Alert = forwardRef(
  (
    { children, title, text, icon, designType, ...rest }: AlertProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    return (
      <S.StyledAlert
        ref={ref}
        icon={icon ?? <CheckCircleOutlineIcon />}
        designType={designType}
        {...rest}
      >
        {title && <S.StyledAlertTitle>{title}</S.StyledAlertTitle>}
        <S.StyledTypographyDescription>{text}</S.StyledTypographyDescription>
      </S.StyledAlert>
    );
  },
);
