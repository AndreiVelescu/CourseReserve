import * as yup from "yup";
import { passwordValidation } from "@/utils/validation";

// Schema completă pentru Settings
export const usernameSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username trebuie să aibă minim 3 caractere")
    .matches(/^\S*$/, "Username nu poate conține spații")
    .required("Trebuie să introduci username"),
});

export const passwordSchema = yup.object({
  oldPassword: yup.string().required("Trebuie să introduci parola veche"),
  newPassword: yup
    .string()
    .min(6, "Parola trebuie să aibă minim 6 caractere")
    .notOneOf(
      [yup.ref("oldPassword")],
      "Noua parolă trebuie să fie diferită de cea veche",
    )
    .required("Trebuie să introduci parola"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Parolele nu coincid")
    .required("Trebuie să confirmi parola"),
});
