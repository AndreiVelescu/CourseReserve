import { SnackbarType } from "@/providers/types";

export type SnackbarContextType = {
  showSnackbar: (snackbar: SnackbarType) => void;
  hideSnackbar: () => void;
};
