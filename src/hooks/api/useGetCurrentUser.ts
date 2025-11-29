import { createQuery } from "react-query-kit";

import { getCurrentUser } from "../../lib/server/actions/getCurrentUser";

export const useGetCurrentUser = createQuery({
  queryKey: ["getCurrentUser"],
  fetcher: () => getCurrentUser(),
});
