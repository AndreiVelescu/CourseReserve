"use client";

import { ExpandMore } from "@mui/icons-material";

import { AccordionProps } from "./types";
import * as S from "./styles";

export const Accordion = ({
  children,
  title,
  size = "default",
  maxHeight,
  elevation = 0,
  withBorder,
  ...rest
}: AccordionProps) => {
  return (
    <S.StyledMuiAccordion
      maxHeight={maxHeight}
      size={size}
      elevation={elevation}
      {...rest}
    >
      <S.StyledAccordionSummary size={size} expandIcon={<ExpandMore />}>
        {title}
      </S.StyledAccordionSummary>
      <S.StyledAccordionDetails withBorder={withBorder}>
        {children}
      </S.StyledAccordionDetails>
    </S.StyledMuiAccordion>
  );
};
