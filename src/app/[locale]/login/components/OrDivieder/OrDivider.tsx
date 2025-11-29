import { useMediaQuery, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import * as S from "./styles";

export const OrDivider = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const translate = useTranslations("OrDivider");
  
  return (
    <S.OrDividerContainer>
      <S.StyledDivider
        orientation={isTablet || isMobile ? "horizontal" : "vertical"}
      />
      <S.StyledTypography variant="body2">{translate("OR")}</S.StyledTypography>
      <S.StyledDivider
        orientation={isTablet || isMobile ? "horizontal" : "vertical"}
      />
    </S.OrDividerContainer>
  );
};