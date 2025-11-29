import * as yup from "yup";

import { ChecklistItem } from "@/components/Checklist/types";
import {
  extendAtLeastValidation,
  extendComplexPasswordValidation,
} from "@/utils/validation";

const AT_LEAST_ID = "at-least";
const NOT_SAME_AS_EMAIL_ID = "not-same-as-email";
const NOT_CHARACTERS_PATTERN_ID = "not-characters-pattern";

// This should ideally be created with translations
// but we're hardcoding for now. In a real implementation,
// you'd want to generate this with translations.
export const DEFAULT_PASSWORD_CHECKLIST: ChecklistItem[] = [
  {
    id: AT_LEAST_ID,
    text: "Be at least 12 characters",
    status: "info",
  },
  {
    id: NOT_SAME_AS_EMAIL_ID,
    text: "Not the same as your email address",
    status: "info",
  },
  {
    id: NOT_CHARACTERS_PATTERN_ID,
    text: "At least have two of the following An uppercase letter a lowercase letter a number or a punctuation mark",
    status: "info",
  },
];

const yupString = yup.string();

export const addAtLeastVerification = (
  curPasswordChecklist: ChecklistItem[],
  password: string,
) => {
  const newPasswordChecklist = [...curPasswordChecklist];
  const index = newPasswordChecklist.findIndex(
    (item) => item.id === AT_LEAST_ID,
  );
  try {
    extendAtLeastValidation(yupString).validateSync(password);
    newPasswordChecklist[index] = {
      ...newPasswordChecklist[index],
      status: "success",
    };
    return newPasswordChecklist;
  } catch (error) {
    newPasswordChecklist[index] = {
      ...newPasswordChecklist[index],
      status: "warning",
    };
    return newPasswordChecklist;
  }
};

export const addNotTheSameAsUsernameVerification = (
  curPasswordChecklist: ChecklistItem[],
  password: string,
  email: string,
) => {
  const newPasswordChecklist = [...curPasswordChecklist];
  const index = newPasswordChecklist.findIndex(
    (item) => item.id === NOT_SAME_AS_EMAIL_ID,
  );

  if (password !== email && password !== "") {
    newPasswordChecklist[index] = {
      ...newPasswordChecklist[index],
      status: "success",
    };
  } else {
    newPasswordChecklist[index] = {
      ...newPasswordChecklist[index],
      status: "warning",
    };
  }

  return newPasswordChecklist;
};

export const addNoCharactersPatternVerification = (
  curPasswordChecklist: ChecklistItem[],
  password: string,
) => {
  const newPasswordChecklist = [...curPasswordChecklist];
  const index = newPasswordChecklist.findIndex(
    (item) => item.id === NOT_CHARACTERS_PATTERN_ID,
  );

  try {
    extendComplexPasswordValidation(yupString, 1).validateSync(password);
    newPasswordChecklist[index] = {
      ...newPasswordChecklist[index],
      status: "success",
    };
    return newPasswordChecklist;
  } catch (error) {
    newPasswordChecklist[index] = {
      ...newPasswordChecklist[index],
      status: "warning",
    };
    return newPasswordChecklist;
  }
};
