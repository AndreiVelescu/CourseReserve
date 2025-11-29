import styled from "@emotion/styled";

import { LoadingProps } from "./types";

export const Container = styled.div<LoadingProps>(
  ({ topPadding, bottomPadding, theme }) => ({
    display: "flex",
    flex: 1,
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    ...(topPadding && { paddingTop: theme.spacing(6) }),
    ...(bottomPadding && { paddingBottom: theme.spacing(6) }),
  }),
);
