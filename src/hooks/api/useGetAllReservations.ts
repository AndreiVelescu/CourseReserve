import { createQuery } from "react-query-kit";

import { getAllReservations } from "@/lib/server/actions/getAllReservations";

export const useGetAllReservations = createQuery({
  queryKey: ["getReservations"],
  fetcher: () => getAllReservations(),
});
