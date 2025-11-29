import { createQuery } from "react-query-kit";
import { getGroupsByCourseId } from "@/lib/server/actions/getGroupByCourseId";

export const useGetGroupsByCourseId = createQuery({
  queryKey: ["groups", "course"],
  fetcher: (courseId: number) => getGroupsByCourseId(courseId),
});
