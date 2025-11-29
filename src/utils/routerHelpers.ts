import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/routing";

export const getQueryParamString = (
  queryParam: string | string[] | undefined,
): string => {
  return typeof queryParam === "string" ? queryParam : "";
};

export const getQueryParamArray = (
  queryParam: string | string[] | undefined,
): string[] => {
  return typeof queryParam === "string" ? [queryParam] : queryParam || [];
};

export const getQueryParamNumber = (
  queryParam: string | string[] | undefined,
): number => {
  return typeof queryParam === "string" ? parseInt(queryParam, 10) : 0;
};

export const getQueryParamBoolean = (
  queryParam: string | string[] | undefined,
): boolean => {
  return typeof queryParam === "string" ? queryParam === "true" : false;
};

export const getQueryParamObject = (
  queryParam: string | string[] | undefined,
): Record<string, string> => {
  return typeof queryParam === "string" ? JSON.parse(queryParam) : {};
};

export const getQueryParamArrayObject = (
  queryParam: string | string[] | undefined,
): Record<string, string[]> => {
  return typeof queryParam === "string" ? JSON.parse(queryParam) : {};
};

const createQueryString = ({
  name,
  value,
  searchParams,
}: {
  name: string;
  value: string;
  searchParams: ReadonlyURLSearchParams;
}) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set(name, value);

  return params.toString();
};

export const useRouteHelpers = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const pushSearchParamsOnly = ({
    name,
    value,
  }: {
    name: string;
    value: string | number | boolean;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, String(value));

    router.push(`${pathname}?${params.toString()}`);
  };

  const removeSearchParamsOnly = ({ name }: { name: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);

    router.push(`${pathname}?${params.toString()}`);
  };

  const getQueryParam = (name: string) => {
    return searchParams.get(name);
  };

  const getAllQueryParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    const query: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      query[key] = value;
    }

    return query;
  };

  return {
    pushSearchParamsOnly,
    removeSearchParamsOnly,
    getQueryParam,
    getAllQueryParams,
  };
};
