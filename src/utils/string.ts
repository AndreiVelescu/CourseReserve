import { ParsedUrlQuery } from "querystring";

export const addQueryParamsToURL = (
  path: string,
  obj: { [x: string | number]: string | number | boolean } | ParsedUrlQuery,
) => {
  const queryParams = Object.entries(obj)
    .filter(([, value]) =>
      typeof value === "number" ? !isNaN(value) : Boolean(value),
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return `${path}${queryParams.length > 0 ? `?${queryParams}` : ""}`;
};
