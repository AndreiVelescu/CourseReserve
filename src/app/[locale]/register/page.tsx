"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { CheckCircle } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/Button";
import { FormError } from "@/components/FormError";
import { Link } from "@/components/Link";
import { Modal } from "@/components/Modal";
import { useRouter } from "@/i18n/routing";
import { onCreateUser } from "@/lib/server/actions/onCreateUser";

import { singupSchema } from "./commonSchema";
import { SignupForm } from "./components/SignupForm/SignupForm";
import * as S from "./styles";
import { SignUpSchema } from "./types";

export default function SignUpPage() {
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const translate = useTranslations("EmailConfirmation");
  const translateSignUp = useTranslations("SignUpPage");
  const translateButtons = useTranslations("Buttons");

  const methods = useForm<SignUpSchema>({
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      confirmPassword: "",
    },
    resolver: yupResolver<SignUpSchema>(singupSchema),
    mode: "onSubmit",
  });

  const {
    formState: { isValid },
  } = methods;

  const onSubmit = async (data: SignUpSchema) => {
    setIsLoading(true);
    setApiError("");

    try {
      await onCreateUser({
        email: data.email,
        password: data.password,
      });

      setIsSuccess(true);
    } catch (error: any) {
      setApiError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onHandleCloseModal = () => {
    setIsSuccess(false);
    router.push("/login");
  };

  return (
    <>
      <S.Wrapper>
        <Stack mb={2}>
          <Typography variant="h4" component="h1" pt={3}>
            {translateSignUp("Register")}
          </Typography>
        </Stack>

        <S.StyledPaper elevation={4}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Stack mb={2}>
                <SignupForm />
              </Stack>
              <FormError error={apiError} mb={4} />
              <Stack mb={2}>
                <Button
                  size="large"
                  disabled={!isValid || isLoading}
                  loading={isLoading}
                  fullWidth
                  variant="contained"
                  type="submit"
                >
                  {translateSignUp("Register")}
                </Button>
              </Stack>
              <Typography variant="body1" textAlign="center">
                {translateSignUp("Already have an account?")}{" "}
                <b>
                  <Link href="/login">{translateSignUp("Log in")}</Link>
                </b>
              </Typography>
            </form>
          </FormProvider>
          <Modal onClose={onHandleCloseModal} open={isSuccess}>
            <Stack>
              <CheckCircle
                sx={{ alignSelf: "center" }}
                color="success"
                fontSize="large"
              />
              <Typography variant="h6" mb={2} mt={2}>
                {translate(
                  "Registered successfully! Please check your email to verify your account",
                )}
              </Typography>
              <Button onClick={onHandleCloseModal} variant="contained">
                {translateButtons("Close")}
              </Button>
            </Stack>
          </Modal>
        </S.StyledPaper>
      </S.Wrapper>
    </>
  );
}
