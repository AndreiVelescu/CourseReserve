import { useTranslations } from "next-intl";

import { MenuItem } from "@/components/Layout/Header/types";

import { useRoutes } from "./useRoutes";

import { UserRole } from "@prisma/client";

export const useHeaderMenuLinkDropdowns = (role: UserRole): MenuItem[] => {
  const t = useTranslations("Navigation");

  const rootRoutes = useRoutes();

  return [
    {
      id: 1,
      title: t("Courses"),
      href: `/${rootRoutes.courses}`,
    },
    {
      id: 2,
      title: t("Reservations"),
      href: rootRoutes.reservations,
    },

    role === "ADMIN" && {
      id: 5,
      title: t("adminPanel"),
      href: rootRoutes.adminPanel,
    },
  ].filter(Boolean) as MenuItem[];
};
