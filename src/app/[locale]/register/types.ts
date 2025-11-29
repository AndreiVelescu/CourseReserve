import * as yup from "yup";

import { singupSchema } from "./commonSchema";

export type SignUpSchema = yup.InferType<typeof singupSchema>;
