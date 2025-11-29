"use client";

import {
  Container,
  Grid,
  MenuItem,
  MenuList,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement } from "react";

import { Button } from "@/components/Button";
import { useGetCurrentUser } from "@/hooks/api/useGetCurrentUser";
import { useAuth } from "@/hooks/useAuth";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

import { MobileAccountMenu } from "./MobileAccountMenu";
import * as S from "./styles";
import { AccountLayoutProps } from "./types";
import { getMenuLabel, getRoute, menuItems } from "./utils";

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  const theme = useTheme();
  const isDownXs = useMediaQuery(theme.breakpoints.down("xs"));

  const { isLogged, isAuthLoading } = useIsLoggedIn();

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useGetCurrentUser({
    enabled: isLogged && !isAuthLoading,
  });

  const pathname = usePathname();

  const { logout } = useAuth();

  const handleLogOut = () => {
    logout();
  };

  return (
    <S.PageWrapper>
      <Container>
        <Grid container spacing={3} justifyContent="center">
          <Grid item zero={12} xs={4}>
            <S.Navigation>
              <Typography variant="h4">My Account</Typography>
              {!isDownXs && (
                <S.MenuWrapper>
                  <MenuList>
                    {menuItems().map((menuKey) => (
                      <MenuItem
                        key={menuKey}
                        selected={pathname === getRoute(menuKey)}
                        component={Link}
                        href={getRoute(menuKey)}
                        sx={S.getMenuItemStyles}
                      >
                        {getMenuLabel(menuKey)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </S.MenuWrapper>
              )}
              <Button
                variant="outlined"
                color="primary"
                size={isDownXs ? "medium" : "large"}
                fullWidth={!isDownXs}
                onClick={handleLogOut}
              >
                Log Out
              </Button>
              {isDownXs && <MobileAccountMenu />}
            </S.Navigation>
          </Grid>
          <Grid item zero={12} xs={8} md={6}>
            {cloneElement(children, {
              userData,
              isLoading,
              error,
              refetch,
            })}
          </Grid>
        </Grid>
      </Container>
    </S.PageWrapper>
  );
};
