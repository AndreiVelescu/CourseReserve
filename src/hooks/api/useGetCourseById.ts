import { createQuery } from "react-query-kit";
import { getCourseById } from "@/lib/server/actions/getCourse";

export const useGetCourseById = createQuery({
  queryKey: ["getCourseById"],
  fetcher: async ({ id }: { id: string }) => {
    return await getCourseById(id);
  },
});
