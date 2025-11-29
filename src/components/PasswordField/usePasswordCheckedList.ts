"use client";

import { useCallback, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import { ChecklistItem } from "../Checklist";

import {
  DEFAULT_PASSWORD_CHECKLIST,
  addAtLeastVerification,
  addNoCharactersPatternVerification,
  addNotTheSameAsUsernameVerification,
} from "./verification";
import { UsePasswordChecklist } from "./types";

export const usePasswordChecklist: UsePasswordChecklist = ({
  emailId,
  passwordId,
  confirmPasswordId,
  control,
  trigger,
  getFieldState,
}) => {
  const dirtyPassword = getFieldState(passwordId).isDirty;

  const [passwordChecklist, setPasswordChecklist] = useState<ChecklistItem[]>(
    DEFAULT_PASSWORD_CHECKLIST,
  );

  const password = useWatch({
    control,
    name: passwordId,
  });

  const email = useWatch({
    control,
    name: emailId,
  });

  useEffect(() => {
    if (dirtyPassword) {
      setPasswordChecklist((curPasswordChecklist) => {
        let newPasswordChecklist = addAtLeastVerification(
          curPasswordChecklist,
          password || "",
        );
        newPasswordChecklist = addNotTheSameAsUsernameVerification(
          newPasswordChecklist,
          password || "",
          email,
        );
        newPasswordChecklist = addNoCharactersPatternVerification(
          newPasswordChecklist,
          password || "",
        );

        return newPasswordChecklist;
      });
    }
  }, [dirtyPassword, email, password]);

  const onBlurPassword = useCallback(() => {
    trigger(passwordId);
  }, [trigger, passwordId]);

  const onBlurConfirmPassword = useCallback(() => {
    // this is done to trigger validation on confirmPassword
    // because if the passwords does not match the submit button will not be enabled and the user would be confused why is that
    trigger(confirmPasswordId);
  }, [trigger, confirmPasswordId]);

  return {
    passwordChecklist,
    onBlurPassword,
    onBlurConfirmPassword,
  };
};
