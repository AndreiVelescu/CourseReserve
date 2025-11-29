import styled from "@emotion/styled";
import { Paper } from "@mui/material";

export const StyledPaperPopoverContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  backgroundColor: theme.palette.inheritWhite.main,
  width: 280,
  zIndex: theme.zIndex.appBar,
  padding: theme.spacing(1, 0),
}));
