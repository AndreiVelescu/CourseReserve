import { ReactNode } from "react";

export interface State {
  hasError: boolean;
}

export interface Props {
  children?: ReactNode;
  customErrorChildren?: ReactNode;
}
