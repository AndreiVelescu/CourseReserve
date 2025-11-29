"use client";

import { LocalizationProvider as LocalizationProviderDefault } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReactNode } from "react";

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LocalizationProviderDefault dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProviderDefault>
  );
};
