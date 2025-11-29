export type AuthButtonsProps = {
  isLogged: boolean;
  isAuthLoading: boolean;
  isLightTheme: boolean;
  forceShowCloseIcon?: boolean;
  showDrawer: boolean;
  onDrawerOpen: (value: boolean) => void;
  onDrawerClose: (value: boolean) => void;
};
