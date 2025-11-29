"use client";

import { Container } from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Authentication } from "@/components/Authentication/Authentication";
import { useRoutes } from "@/hooks/useRoutes";
import { useRouter } from "@/i18n/routing";

import * as S from "./styles";

export default function LoginPage() {
  const router = useRouter();
  const rootRoutes = useRoutes();
  const params = useParams();

  const [formAlertMessage, setFormAlertMessage] = useState("");
  const [formAlertIsError, setFormAlertIsError] = useState(false);

  const onLoginSuccess = () => {
    router.push(
      params.url && typeof params.url === "string"
        ? params.url
        : rootRoutes.root,
    );
  };

  return (
    <Container>
      <S.Wrapper>
        <Authentication
          onCloseAlert={() => setFormAlertMessage("")}
          alertMessage={formAlertMessage}
          isAlertError={formAlertIsError}
          onLoginSuccess={onLoginSuccess}
        />
      </S.Wrapper>
    </Container>
  );
}
