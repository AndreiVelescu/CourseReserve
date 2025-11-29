import { useLocale, useTranslations } from "next-intl";

import { routing } from "@/i18n/routing";

import { Select } from "../Select";

import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {routing.locales.map((cur) => (
        <Select.Option key={cur} value={cur} disabled={cur === locale}>
          {t("locale", { locale: cur })}
        </Select.Option>
      ))}
    </LocaleSwitcherSelect>
  );
}
