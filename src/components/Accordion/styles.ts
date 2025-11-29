import styled from "@emotion/styled";
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  accordionSummaryClasses,
  collapseClasses,
  accordionClasses,
  accordionDetailsClasses,
  AccordionDetails,
} from "@mui/material";

import { AccordionSize, StyledMuiAccordionProps } from "./types";

export const StyledMuiAccordion = styled(MuiAccordion, {
  shouldForwardProp: (prop) => !["size", "maxHeight"].includes(prop),
})<StyledMuiAccordionProps>(({ theme, size, maxHeight }) => ({
  color: theme.palette.text.primary,
  boxShadow: "0px 1px 1px 1px rgba(0,0,0,0.25)",

  [`.${collapseClasses.wrapperInner}`]: {
    backgroundColor: "transparent",
  },
  [`.${accordionClasses.region}`]: {
    backgroundColor: theme.palette.background.primary,
  },

  ...(size === "small" && {
    [`&.${accordionClasses.root}`]: {
      borderRadius: theme.spacing(0.5),
      overflow: "hidden",
    },
    ["&:before"]: {
      display: "none",
    },

    [`&.${accordionClasses.expanded}`]: {
      marginTop: theme.spacing(0.75),
      marginBottom: 0,

      [`.${collapseClasses.wrapperInner}`]: {
        [`.${accordionDetailsClasses.root}`]: {
          padding: theme.spacing(1.5, 1),
          ...(maxHeight && {
            maxHeight: `${maxHeight}px`,
            overflowY: "scroll",
          }),
        },
      },
    },

    [`&.${accordionClasses.root}`]: {
      [`.${collapseClasses.wrapperInner}`]: {
        [`.${accordionDetailsClasses.root}`]: {
          padding: theme.spacing(1.5, 1),
        },
      },
    },
  }),
}));

export const StyledAccordionSummary = styled(AccordionSummary, {
  shouldForwardProp: (prop) => !["size"].includes(prop),
})<{
  size?: AccordionSize;
}>(({ theme, size }) => ({
  backgroundColor: "#FBFBFD",
  fontSize: theme.typography.pxToRem(20),
  fontWeight: "600",
  lineHeight: 1.6,

  [`&.${accordionSummaryClasses.expanded}`]: {
    minHeight: 48,
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}`]: {
    padding: theme.spacing(1.5),
  },
  [`& .${accordionSummaryClasses.content}`]: {
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1.5, 2, 1.5, 0),
    [`&.${accordionSummaryClasses.expanded}`]: {
      margin: 0,
    },
  },

  ...(size === "small" && {
    minHeight: 38,
    fontSize: theme.typography.pxToRem(14),
    [`&.${accordionSummaryClasses.expanded}`]: {
      minHeight: 38,
    },
  }),
}));

export const StyledAccordionDetails = styled(AccordionDetails, {
  shouldForwardProp: (prop) => !["withBorder"].includes(prop),
})<{
  withBorder?: boolean;
}>(({ withBorder }) => ({
  border: withBorder ? `2px solid #F5F5F3` : "none",
}));
