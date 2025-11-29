"use client";

import { Container, Stack, Typography } from "@mui/material";

import { useRoutes } from "@/hooks/useRoutes";

import { Button } from "../Button";
import { Link } from "../Link";

import * as S from "./styles";
import { ErrorPageProps } from "./types";

export const ErrorPage = ({
  errorCode,
  title,
  description,
}: ErrorPageProps) => {
  const rootRoutes = useRoutes();
  return (
    <S.Wrapper>
      <Container>
        <Typography variant="h1" textAlign="center">
          {errorCode}
        </Typography>
        <Typography variant="h4" textAlign="center">
          {title}
        </Typography>
        <Stack alignItems="center">
          {description && (
            <S.StyledTypography mb={3} textAlign="center">
              {description}
            </S.StyledTypography>
          )}
          <Button variant="contained" component={Link} href={rootRoutes.root}>
            Go to home page
          </Button>
        </Stack>
      </Container>
      <S.RightImage
        src="/assets/svgs/geometric/pattern-full-vertical-v4.svg"
        alt="illustration"
        width="361"
        height={S.CONTAINER_DESKTOP_MIN_HEIGHT}
      />
      <S.LeftImage
        src="/assets/svgs/geometric/pattern-full-vertical-v4.svg"
        alt="illustration"
        width="361"
        height={S.CONTAINER_DESKTOP_MIN_HEIGHT}
      />
      <S.BottomImage
        src="/assets/svgs/geometric/pattern-full-horizontal-v5.svg"
        alt="illustration"
        width="375"
        height={188}
      />
      <S.TopImage
        src="/assets/svgs/geometric/pattern-full-horizontal-v5.svg"
        alt="illustration"
        width="375"
        height={188}
      />
    </S.Wrapper>
  );
};
