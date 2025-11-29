type Link = {
  href: string;
  label: string;
  description?: string;
};

export type MenuItem = {
  id: number;
  title: string;
  href?: string;
  links?: Link[];
};

export type HeaderProps = {
  menuItems: MenuItem[];
  isLightTheme?: boolean;
};
