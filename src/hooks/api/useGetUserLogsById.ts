// hooks/api/useGetAllUserLogs.ts
import { getAllUserLogs } from "@/lib/server/actions/getUserLogsById";
import { createQuery } from "react-query-kit";

export const useGetAllUserLogs = createQuery({
  queryKey: ["getAllUserLogs"],
  fetcher: () => getAllUserLogs(),
});
