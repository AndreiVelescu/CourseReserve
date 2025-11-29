import { useMutation } from "@tanstack/react-query";

import { CreateCourseInputType } from "@/lib/server/actions/types";
import { createCourse } from "@/lib/server/actions/createCourse";

export function useCreateCourseMutation() {
  return useMutation({
    mutationFn: async (input: CreateCourseInputType) => {
      try {
        return await createCourse(input);
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error("Failed to create course");
      }
    },
  });
}
