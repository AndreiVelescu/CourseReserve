import styled from "@emotion/styled";

import * as utilFunctions from "../utils/getters";

export const StyledLoginBtnWrapper = styled("div", {
  shouldForwardProp: (prop) =>
    !["isLightTheme", "isMobileScreen"].includes(prop),
})<{
  isMobileScreen: boolean;
  isLightTheme: boolean;
}>(({ isMobileScreen, isLightTheme, theme }) => ({
  textAlign: "center",
  padding: isMobileScreen ? theme.spacing(2, 3) : 0,
  background: utilFunctions.getAppBarBackgroundColor(isLightTheme),
  whiteSpace: "nowrap",
}));
