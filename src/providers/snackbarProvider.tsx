"use client";

import { Alert, Snackbar } from "@mui/material";
import { ReactNode, useState } from "react";

import { SnackbarContext } from "@/context/SnackbarContext";

import { SnackbarType } from "./types";

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbar, setSnackbar] = useState<SnackbarType | null>(null);

  const showSnackbar = (snackbar: SnackbarType) => {
    setSnackbar(snackbar);
  };

  const hideSnackbar = () => {
    setSnackbar(null);
  };

  const closeSnackbar = () => {
    setSnackbar(null);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      {snackbar && (
        <Snackbar open={true} autoHideDuration={3000} onClose={closeSnackbar}>
          <Alert
            onClose={snackbar.onCloseCallback}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};
