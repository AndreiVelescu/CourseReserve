import styled from "@emotion/styled";

import { Button } from "../Button";

export const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));
