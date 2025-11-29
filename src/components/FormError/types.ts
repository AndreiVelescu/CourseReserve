import { StackProps } from "@mui/material";
import { ReactNode } from "react";

export type FormErrorProps = {
  error?: ReactNode;
  mb?: StackProps["mb"];
};
