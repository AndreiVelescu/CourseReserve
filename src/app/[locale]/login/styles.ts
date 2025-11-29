import styled from "@emotion/styled";

export const Wrapper = styled.div(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: theme.spacing(9, 0, 10.5, 0),
  [theme.breakpoints.down("md")]: {
    margin: theme.spacing(4.5, 0),
    padding: theme.spacing(2, 0, 3, 0),
  },
  [theme.breakpoints.down("xs")]: {
    margin: theme.spacing(2.25, 0, 3, 0),
    padding: theme.spacing(1.5, 0, 2.25, 0),
  },
}));
