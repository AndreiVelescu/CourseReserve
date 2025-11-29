export type SnackbarType = {
  message: string;
  severity: "error" | "success";
  onCloseCallback?: () => void;
};
