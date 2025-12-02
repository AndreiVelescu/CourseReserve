"use client";

import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useGetCurrentUser } from "@/hooks/api/useGetCurrentUser";
import { useUpdateUsername } from "@/hooks/api/useUpdateUsername";
import { useUpdatePassword } from "@/hooks/api/useUpdatePassword";
import { useQueryClient } from "@tanstack/react-query";

import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Alert,
  Divider,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useMemo } from "react";

import { getUsernameSchema, getPasswordSchema } from "./settingsSchema";
import { useTranslations } from "next-intl";

type UsernameForm = { username: string };
type PasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SettingsPage() {
  const t = useTranslations("SettingsPage");
  const { isLogged } = useIsLoggedIn();
  const { data: currentUser } = useGetCurrentUser();
  const updateUsernameMutation = useUpdateUsername();
  const updatePasswordMutation = useUpdatePassword();
  const queryClient = useQueryClient();

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const usernameSchema = useMemo(() => getUsernameSchema(t), [t]);
  const passwordSchema = useMemo(() => getPasswordSchema(t), [t]);

  const {
    control: usernameControl,
    handleSubmit: handleUsernameSubmit,
    reset: resetUsernameForm,
  } = useForm<UsernameForm>({
    resolver: yupResolver(usernameSchema),
    defaultValues: { username: "" },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
  } = useForm<PasswordForm>({
    resolver: yupResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  if (!isLogged) {
    return (
      <Box sx={{ mt: 12, textAlign: "center" }}>
        <Typography variant="h5">{t("notAuthenticated")}</Typography>
      </Box>
    );
  }

  // Submit username
  const onUsernameSubmit = async (data: UsernameForm) => {
    try {
      await updateUsernameMutation.mutateAsync(data.username);
      queryClient.invalidateQueries({ queryKey: ["getCurrentUser"] });
      setSuccessMsg(t("usernameUpdated"));
      setErrorMsg("");
      resetUsernameForm();
    } catch (err: any) {
      setErrorMsg(err.message || t("usernameError"));
      setSuccessMsg("");
    }
  };

  // Submit password
  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      await updatePasswordMutation.mutateAsync({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      setSuccessMsg(t("passwordUpdated"));
      setErrorMsg("");
      resetPasswordForm();
    } catch (err: any) {
      setErrorMsg(err.message || t("passwordError"));
      setSuccessMsg("");
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 6, px: 2 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
      >
        {t("pageTitle")}
      </Typography>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Card username */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {t("usernameSection")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("currentUsername")}: <strong>{currentUser?.username}</strong>
          </Typography>
          <Stack
            spacing={2}
            component="form"
            onSubmit={handleUsernameSubmit(onUsernameSubmit)}
          >
            <Controller
              name="username"
              control={usernameControl}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t("newUsername")}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              {t("saveUsername")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 4 }} />

      {/* Card parola */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {t("passwordSection")}
          </Typography>
          <Stack
            spacing={2}
            component="form"
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          >
            <Controller
              name="oldPassword"
              control={passwordControl}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="password"
                  label={t("oldPassword")}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="newPassword"
              control={passwordControl}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="password"
                  label={t("newPassword")}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={passwordControl}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="password"
                  label={t("confirmPassword")}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              {t("savePassword")}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
