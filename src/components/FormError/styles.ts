import styled from "@emotion/styled";
import { Collapse as MuiCollapse } from "@mui/material";

export const Collapse = styled(MuiCollapse)(({ theme }) => ({
  heigh: theme.spacing(5),
}));
