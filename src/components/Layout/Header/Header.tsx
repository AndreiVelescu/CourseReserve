"use client";

import { Search as SearchIcon } from "@mui/icons-material";
import {
  Container,
  IconButton,
  IconButtonProps,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";

import LocaleSwitcher from "@/components/LocaleSwitcher/LocaleSwitcher";
import { Logo } from "@/components/Logo";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { usePathname } from "@/i18n/routing";

import { AuthButtons } from "./AuthButtons";

import { MenuButtonDropdown } from "./MenuButtonDropdown/MenuButtonDropdown";
import * as S from "./styles";
import { TabletHeaderSearchField } from "./TabletHeaderSearchField/TabletHeaderSearchField";
import { HeaderProps, MenuItem } from "./types";
import { useUserHasPermission } from "@/hooks/useUserHasPermission";
import { UserRole } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export const Header = ({ menuItems, isLightTheme = false }: HeaderProps) => {
  const theme = useTheme();
  const { isLogged, isAuthLoading } = useIsLoggedIn();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isAdmin = useUserHasPermission(UserRole.ADMIN);
  const t = useTranslations("Navigation");
  const router = useRouter();

  const pathname = usePathname();

  const [openTabletSearch, setOpenTabletSearch] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const onDrawerOpen = () => setShowDrawer(true);

  const onDrawerClose = () => {
    if (openTabletSearch) {
      setOpenTabletSearch(false);
      return;
    }

    setShowDrawer(false);
  };

  return (
    <S.Wrapper>
      <S.StyledAppBar color="default" isLightTheme={isLightTheme}>
        <Toolbar
          sx={{
            minHeight: {
              zero: 62,
              xs: 76,
            },
          }}
          variant="dense"
          disableGutters
        >
          <Container>
            <S.MainContainer>
              <S.LeftContainer>
                <Logo
                  variant={isLightTheme ? "dark" : "light"}
                  ariaLabel="logo, link to home page"
                  role="img"
                />
                {!isSmDown && (
                  <S.MenuItemsContainer>
                    {menuItems.map((item: MenuItem) =>
                      item.links ? (
                        <MenuButtonDropdown
                          links={item.links}
                          isLightTheme={isLightTheme}
                          key={item.id}
                        >
                          {item.title}
                        </MenuButtonDropdown>
                      ) : (
                        <S.MenuButtonLink
                          active={pathname === item.href}
                          href={`${item.href}`}
                          key={item.id}
                          color={isLightTheme ? "inheritText" : "inheritWhite"}
                          aria-label={item.title}
                        >
                          {item.title}
                        </S.MenuButtonLink>
                      ),
                    )}
                  </S.MenuItemsContainer>
                )}
              </S.LeftContainer>
              <S.RightContainer>
                <Stack direction="row" spacing={2} pl={1}>
                  <LocaleSwitcher />

                  <AuthButtons
                    isAuthLoading={isAuthLoading}
                    isLogged={isLogged}
                    isLightTheme={isLightTheme}
                    forceShowCloseIcon={openTabletSearch}
                    showDrawer={showDrawer}
                    onDrawerOpen={onDrawerOpen}
                    onDrawerClose={onDrawerClose}
                  />
                </Stack>
              </S.RightContainer>
            </S.MainContainer>
          </Container>
        </Toolbar>
      </S.StyledAppBar>
      <Toolbar variant="dense" disableGutters />
    </S.Wrapper>
  );
};
