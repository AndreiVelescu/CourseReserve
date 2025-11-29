import styled from "@emotion/styled";
import { OutlinedInput } from "@mui/material";

export const StyledMuiOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  "& input:-webkit-autofill, input:-webkit-autofill:focus": {
    boxShadow: `0 0 0 1000px ${theme.palette.inheritWhite.main} inset`,
    WebkitTextFillColor: theme.palette.text.primary,
  },
}));
