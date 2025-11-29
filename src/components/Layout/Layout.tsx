"use client";

import { Container, Stack } from "@mui/material";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

import { useGetCurrentUser } from "@/hooks/api/useGetCurrentUser";
import { useHeaderMenuLinkDropdowns } from "@/hooks/useHeaderMenuLinkDropdowns";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

import { Button } from "../Button";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import { Modal } from "../Modal";

import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LayoutProps } from "./types";

export const Layout = ({ children }: LayoutProps) => {
  const [expired, setExpired] = useState(false);
  const { isLogged } = useIsLoggedIn();

  const { data: currentUser, isError: isUserError } = useGetCurrentUser({
    enabled: isLogged,
  });

  const headerMenuLinkDropdowns = useHeaderMenuLinkDropdowns(
    currentUser?.role!,
  );

  useEffect(() => {
    if (isUserError && isLogged) {
      setExpired(true);
    }
  }, [isUserError, isLogged]);

  const renderContent = () => {
    return <Container>{children}</Container>;
  };

  const renderHeader = () => {
    return <Header menuItems={headerMenuLinkDropdowns} />;
  };

  return (
    <Stack height={"100vh"} justifyContent={"space-between"}>
      {renderHeader()}
      <ErrorBoundary>
        <Modal
          onClose={() => {
            setExpired(false);
            signOut();
          }}
          open={expired}
        >
          session expired, please log in again
          <Button
            onClick={() => {
              setExpired(false);
              signOut();
            }}
          >
            Close
          </Button>
        </Modal>
        <Content>{renderContent()}</Content>
      </ErrorBoundary>
      <Footer />
    </Stack>
  );
};
