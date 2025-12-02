import * as yup from "yup";
import { passwordValidation } from "@/utils/validation";

// Schema completă pentru Settings
export const getUsernameSchema = (t: (key: string) => string) =>
  yup.object({
    username: yup
      .string()
      .min(3, t("validation.usernameMinLength"))
      .matches(/^\S*$/, t("validation.usernameNoSpaces"))
      .required(t("validation.usernameRequired")),
  });

export const getPasswordSchema = (t: (key: string) => string) =>
  yup.object({
    oldPassword: yup.string().required(t("validation.oldPasswordRequired")),
    newPassword: yup
      .string()
      .min(6, t("validation.passwordMinLength"))
      .notOneOf(
        [yup.ref("oldPassword")],
        t("validation.passwordDifferent"),
      )
      .required(t("validation.passwordRequired")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], t("validation.passwordsNotMatch"))
      .required(t("validation.confirmPasswordRequired")),
  });
