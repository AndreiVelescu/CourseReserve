import styled from "@emotion/styled";

export const List = styled.ul(({ theme }) => ({
  paddingLeft: 0,
  marginTop: theme.spacing(0),
  marginBottom: theme.spacing(0),
}));

export const ListItem = styled.li(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
}));

export const IconWrapper = styled.div(() => ({
  color: "#757575",
  display: "flex",
}));
