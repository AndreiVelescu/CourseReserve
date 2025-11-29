import * as yup from "yup";

import {
  ASCIILettersOnlyRegex,
  EmailRegex,
  PasswordLevel1Regex,
  PasswordLevel2Regex,
} from "./regex";

export const extendAtLeastValidation = (
  schema: yup.StringSchema,
  customErrorMessage?: string,
) =>
  schema.min(
    12,
    customErrorMessage || "Passwords must contain at least 12 characters.",
  );

export const extendComplexPasswordValidation = (
  schema: yup.StringSchema,
  level: 1 | 2,
  customErrorMessage?: string,
) => {
  let errorMessage = `Must contain at least ${
    level === 1 ? "two" : "three"
  } of the following conditions: an uppercase letter, a lowercase letter, a number or a punctuation mark.`;

  if (customErrorMessage) {
    errorMessage = customErrorMessage;
  }

  return schema.matches(
    level === 1 ? PasswordLevel1Regex : PasswordLevel2Regex,
    errorMessage,
  );
};

export const passwordValidation = <Required extends boolean>({
  level,
  required,
  customErrorMessage,
}: {
  level: 1 | 2;
  required: Required;
  customErrorMessage?: string;
}): yup.StringSchema<Required extends true ? string : string | undefined> => {
  const schema = extendComplexPasswordValidation(
    extendAtLeastValidation(yup.string(), customErrorMessage),
    level,
    customErrorMessage,
  );

  if (required) {
    return schema.required(customErrorMessage || "Required");
  }

  return schema as yup.StringSchema<
    Required extends true ? string : string | undefined // used for "required" type inference
  >;
};

export const phoneValidation = <Required extends boolean>({
  required,
}: {
  required: Required;
}): yup.StringSchema<Required extends true ? string : string | undefined> => {
  const moldovaPhoneRegex = /^(\+373|0)\s?[67]\d{7}$/;
  const schema = yup
    .string()
    .matches(moldovaPhoneRegex, "Enter correct phone number!");

  if (required) {
    return schema.required("Required");
  }
  return schema as yup.StringSchema<
    Required extends true ? string : string | undefined // used for "required" type inference
  >;
};

export const emailValidation = <Required extends boolean>({
  required,
}: {
  required: Required;
}): yup.StringSchema<Required extends true ? string : string | undefined> => {
  const schema = yup
    .string()
    .matches(EmailRegex, "Please enter a valid email address")
    .matches(ASCIILettersOnlyRegex, "Email can only contain English letters.");

  if (required) {
    return schema.required("Required");
  }
  return schema as yup.StringSchema<
    Required extends true ? string : string | undefined // used for "required" type inference
  >;
};

const URL_REGEX =
  /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i;

export const urlValidation = <Required extends boolean>({
  required,
}: {
  required: Required;
}) => {
  const schema = yup
    .string()
    .matches(URL_REGEX, "Enter correct url!")
    .required("Please enter a u");

  if (required) {
    return schema.required("Required");
  }

  if (required) {
    return schema.required("Required");
  }
  return schema as yup.StringSchema<
    Required extends true ? string : string | undefined // used for "required" type inference
  >;
};
