"use client";

import { SxProps, Theme, useTheme } from "@mui/material";

import * as S from "./styles";
import { AvatarProps, AvatarSize } from "./types";

const getAvatarSizes = (theme: Theme): Record<AvatarSize, SxProps<Theme>> => {
  return {
    small: { width: 24, height: 24, fontSize: theme.typography.pxToRem(10) },
    medium: { width: 32, height: 32, fontSize: theme.typography.pxToRem(14) },
    large: { width: 40, height: 40, fontSize: theme.typography.pxToRem(16) },
    xlarge: { width: 80, height: 80, fontSize: theme.typography.pxToRem(24) },
  };
};
export const Avatar = ({ avatarSize = "medium", ...rest }: AvatarProps) => {
  const theme = useTheme();
  return <S.StyledAvatar {...rest} sx={getAvatarSizes(theme)[avatarSize]} />;
};
