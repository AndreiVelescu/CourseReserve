import { Stack, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/Checkbox";
import { Checklist } from "@/components/Checklist/Checklist";
import { InputField } from "@/components/InputField";
import {
  PasswordField,
  usePasswordChecklist,
} from "@/components/PasswordField";
import { Link } from "@/components/Link";

import { SignUpSchema } from "../../types";

export const SignupForm = () => {
  const translateContent = useTranslations("PasswordChecklist");
  const { control, trigger, getFieldState } = useFormContext<SignUpSchema>();

  const { passwordChecklist, onBlurPassword, onBlurConfirmPassword } =
    usePasswordChecklist<SignUpSchema>({
      emailId: "email",
      passwordId: "password",
      confirmPasswordId: "confirmPassword",
      control,
      trigger,
      getFieldState,
    });

  const onBlurEmail = () => {
    trigger("email");
  };

  return (
    <>
      <Stack mb={2}>
        <Typography variant="body2">
          <Typography component="span" color="error">
            *
          </Typography>
          {translateContent("Required")}
        </Typography>
      </Stack>
      <Stack mb={2}>
        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <InputField
              required
              id="email"
              value={value ?? null}
              onChange={onChange}
              onBlur={onBlurEmail}
              label={translateContent("Email")}
              placeholder="eg: name@email.com"
              fullWidth
              error={Boolean(error)}
              helperText={
                translateContent(error?.message ? error?.message : "") || ""
              }
            />
          )}
        />
      </Stack>
      <Stack mb={2}>
        <Controller
          name="phone"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <InputField
              id="phone"
              value={value ?? null}
              onChange={onChange}
              onBlur={() => trigger("phone")}
              label={translateContent("Phone")}
              placeholder="eg: +373 79000000"
              fullWidth
              error={Boolean(error)}
              helperText={
                translateContent(error?.message ? error?.message : "") || ""
              }
            />
          )}
        />
      </Stack>

      <Stack mb={2}>
        <Typography variant="h6">
          {translateContent("Create a Password")}
        </Typography>
        <Stack mb={1}>
          <Checklist items={passwordChecklist} />
        </Stack>
        <Controller
          name="password"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <PasswordField
              required
              id="password"
              autoComplete="new-password"
              value={value || ""}
              onChange={onChange}
              onBlur={onBlurPassword}
              label={translateContent("Password")}
              placeholder={translateContent("Enter password")}
              fullWidth
              error={Boolean(error)}
              helperText={
                translateContent(error?.message ? error?.message : "") || ""
              }
            />
          )}
        />
      </Stack>
      <Stack mb={2}>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <PasswordField
              required
              id="confirmPassword"
              autoComplete="new-password"
              value={value}
              onChange={onChange}
              onBlur={onBlurConfirmPassword}
              label={translateContent("Confirm password")}
              placeholder={translateContent("Confirm password")}
              fullWidth
              error={Boolean(error)}
              helperText={
                translateContent(error?.message ? error?.message : "") || ""
              }
            />
          )}
        />
      </Stack>
      <Controller
        name="termsOfService"
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Checkbox
            required
            label={
              <>
                {translateContent("I agree to the")}{" "}
                <Link href="/terms-of-service" target="_blank" rel="noreferrer">
                  <b>{translateContent("Terms of Service")}</b>
                </Link>
              </>
            }
            withLabel
            checked={value}
            onChange={onChange}
            error={Boolean(error)}
            helperText={
              translateContent(error?.message ? error?.message : "") || ""
            }
            color="primary"
          />
        )}
      />
      <Controller
        name="privacyPolicy"
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Checkbox
            required
            label={
              <>
                {translateContent("I agree to the")}{" "}
                <Link href="/privacy-policy" target="_blank" rel="noreferrer">
                  <b>{translateContent("Privacy Policy")}</b>
                </Link>
              </>
            }
            withLabel
            checked={value}
            onChange={onChange}
            error={Boolean(error)}
            helperText={
              translateContent(error?.message ? error?.message : "") || ""
            }
            color="primary"
          />
        )}
      />
    </>
  );
};
