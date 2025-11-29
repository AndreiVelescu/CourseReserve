import * as yup from "yup";

import {
  emailValidation,
  passwordValidation,
  phoneValidation,
} from "@/utils/validation";

export const singupSchema = yup.object().shape({
  email: emailValidation({ required: true }),
  phone: phoneValidation({ required: false }),
  password: passwordValidation({
    level: 1,
    required: true,
    customErrorMessage: "Please enter a password that meets the requirements",
  }).notOneOf([yup.ref("email")], "Not the same as email"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "The passwords do not match Try Again")
    .required("Required"),
  termsOfService: yup
    .bool()
    .required("You need to accept terms of service")
    .oneOf([true], "You need to accept terms of service"),
  privacyPolicy: yup
    .bool()
    .required("You need to accept privacy policy")
    .oneOf([true], "You need to accept privacy policy"),
});
