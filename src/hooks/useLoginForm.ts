import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// import { emailValidation } from "@/utils/validation";

const validationSchema = yup.object({
  email: yup.string().required("An email is required."),
  // this is being reviewed by BA and Security team
  // process.env.NODE_ENV === "development"
  //   ? yup.string().required("Email is required")
  //   : emailValidation({ required: true }),
  // password: passwordValidation({ level: 1, required: true }),
  password: yup.string().required("A password is required."), // it should be min 12
});

export type LoginFormType = yup.InferType<typeof validationSchema>;

export const useLoginForm = () => {
  return useForm<LoginFormType>({
    defaultValues: {
      email: undefined,
      password: undefined,
    },
    resolver: yupResolver<LoginFormType>(validationSchema),
    mode: "onSubmit",
  });
};
