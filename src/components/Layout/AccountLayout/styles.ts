import styled from "@emotion/styled";
import { SystemStyleObject as SxProps } from "@mui/system";
import { Theme } from "@mui/material";

export const PageWrapper = styled.div(({ theme }) => ({
  background: "#F5F5F2",
  padding: theme.spacing(9, 0),
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  minWidth: 0,

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(7.5, 0),
  },
  [theme.breakpoints.down("xs")]: {
    padding: theme.spacing(4.5, 0, 6, 0),
  },
}));

export const getSelectStyles = (theme: Theme) => ({
  [theme.breakpoints.down("xs")]: {
    marginBottom: theme.spacing(2),
  },
});

export const Navigation = styled.div(({ theme }) => ({
  [theme.breakpoints.down("xs")]: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing(1.5),
  },
}));

export const MenuWrapper = styled.div(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(7.5),
}));

export const getMenuItemStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.primary.dark,
});
