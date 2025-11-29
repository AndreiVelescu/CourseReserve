import { ACCOUNT_MENU_KEY } from "./types";

export const getMenuLabel = (key: ACCOUNT_MENU_KEY) => {
  switch (key) {
    case ACCOUNT_MENU_KEY.Information:
      return "Account Information";
    default:
      return null;
  }
};

export const menuItems = () => {
  return Object.values(ACCOUNT_MENU_KEY);
};

export const getRoute = (key: ACCOUNT_MENU_KEY) => {
  switch (key) {
    case ACCOUNT_MENU_KEY.Information:
      return "account/information";
    default:
      return "/";
  }
};
