"use client";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import * as S from "./styles";
import { HelperTextProps } from "./types";

export const HelperText = ({
  children,
  error,
  success,
  ...rest
}: HelperTextProps) => {
  const renderIcon = () => {
    if (error) {
      return <ErrorOutlineIcon color="error" />;
    }

    if (success) {
      return <CheckCircleOutlineIcon color="success" />;
    }
  };

  return (
    <S.StyledHelperText {...rest}>
      <S.IconWrapper>{renderIcon()}</S.IconWrapper>
      <span>{children}</span>
    </S.StyledHelperText>
  );
};
