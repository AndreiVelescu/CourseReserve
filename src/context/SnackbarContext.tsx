"use client";

import { createContext, useContext } from "react";

import { SnackbarContextType } from "./types";

export const SnackbarContext = createContext<SnackbarContextType>(
  {} as SnackbarContextType,
);

export const useSnackbar = () => useContext(SnackbarContext);
