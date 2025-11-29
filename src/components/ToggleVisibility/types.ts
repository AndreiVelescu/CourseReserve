import { ReactNode } from "react";

export type ToggleVisibilityProps = {
  children: ReactNode;
  showChildren?: boolean;
  componentShowedFirst: ReactNode;
  className?: string;
};
