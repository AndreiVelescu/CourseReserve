import { Avatar } from "@mui/material";
import styled from "@emotion/styled";

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));
