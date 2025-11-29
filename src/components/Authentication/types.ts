export type AuthenticationProps = {
  alertMessage?: string;
  onCloseAlert?: () => void;
  isAlertError?: boolean;
  onLoginSuccess: () => void;
};
