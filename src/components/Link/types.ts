import { LinkProps as NextLinkProps } from "next/link";
import { ReactNode } from "react";

export type LinkProps = NextLinkProps & {
  target?: string;
  children: ReactNode;
  light?: boolean;
  ariaLabel?: string;
  bold?: boolean;
  showUnderline?: boolean;
  prefetch?: boolean;
  locale?: "en" | "ro" | "ru" | undefined;
  size?: "small" | "regular";
  rel?: string;
};
