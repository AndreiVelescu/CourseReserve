import { isAdmin } from "@/lib/server/actions/isAdmin";
import { createQuery } from "react-query-kit";

export const useIsAdmin = createQuery({
  queryKey: ["useIsAdmin"],
  fetcher: async () => isAdmin(),
});
