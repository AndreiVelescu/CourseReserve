export type MenuButtonDropdownProps = {
  children: string;
  isLightTheme: boolean;
  links: {
    label: string;
    description?: string;
    href: string;
  }[];
};
