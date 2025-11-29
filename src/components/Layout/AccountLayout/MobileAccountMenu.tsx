"use client";

import { SelectChangeEvent } from "@mui/material";

import { Select } from "@/components/Select";
import { usePathname, useRouter } from "@/i18n/routing";

import * as S from "./styles";
import { getMenuLabel, getRoute, menuItems } from "./utils";

export const MobileAccountMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleOnChange = (e: SelectChangeEvent) => {
    router.push(e.target.value);
  };

  return (
    <Select
      id="account-menu-select"
      value={pathname}
      onChange={handleOnChange}
      size="medium"
      fullWidth
      ariaLabel="mobile account menu"
      sx={(theme) => S.getSelectStyles(theme)}
    >
      {menuItems().map((menuKey) => (
        <Select.Option key={menuKey} value={getRoute(menuKey)}>
          {getMenuLabel(menuKey)}
        </Select.Option>
      ))}
    </Select>
  );
};
