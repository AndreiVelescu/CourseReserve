import { createQuery } from "react-query-kit";
import { getAllUsers } from "@/lib/server/actions/getAllUsers";

export const useGetAllUsers = createQuery({
  queryKey: ["useGetAllUsers"],
  fetcher: () => getAllUsers(),
});
