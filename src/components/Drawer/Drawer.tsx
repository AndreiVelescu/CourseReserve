"use client";

import * as S from "./styles";
import { DrawerProps } from "./types";

export const Drawer = ({ children, ...rest }: DrawerProps) => {
  return <S.StyledMuiDrawer {...rest}>{children}</S.StyledMuiDrawer>;
};
