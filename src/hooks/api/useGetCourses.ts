import { createQuery } from "react-query-kit";

import { getAllCourses } from "@/lib/server/actions/getAllCourses";

export const useGetCourses = createQuery({
  queryKey: ["getCourses"],
  fetcher: () => getAllCourses(),
});
