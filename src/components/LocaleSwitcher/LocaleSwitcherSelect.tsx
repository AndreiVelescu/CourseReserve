"use client";

import { SelectChangeEvent } from "@mui/material";
import { ReactNode, useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/routing";

import { Select } from "../Select";

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(
    event: SelectChangeEvent<"en" | "ro" | "ru" | undefined>,
  ) {
    const nextLocale = event.target.value as "en" | "ro" | "ru" | undefined;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <Select
      label={label}
      value={defaultValue as "en" | "ro" | "ru" | undefined}
      disabled={isPending}
      onChange={onSelectChange}
      sx={{ minWidth: 130 }}
      size="small"
    >
      {children}
    </Select>
  );
}
