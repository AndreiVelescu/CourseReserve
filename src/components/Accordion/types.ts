import { AccordionProps as MuiAccordionProps } from "@mui/material";
import { ReactNode } from "react";

export type AccordionSize = "small" | "default";

export type AccordionProps = Pick<
  MuiAccordionProps,
  | "children"
  | "classes"
  | "defaultExpanded"
  | "disabled"
  | "disableGutters"
  | "expanded"
  | "onChange"
  | "square"
  | "elevation"
  | "sx"
> & {
  title: ReactNode;
  className?: string;
  size?: AccordionSize;
  maxHeight?: number;
  withBorder?: boolean;
};

export type StyledMuiAccordionProps = Pick<
  AccordionProps,
  "size" | "maxHeight"
>;
