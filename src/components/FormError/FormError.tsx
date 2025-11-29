"use client";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { FormHelperText, Stack } from "@mui/material";

import * as S from "./styles";
import { FormErrorProps } from "./types";

export const FormError = ({ error, mb = 2 }: FormErrorProps) => {
  return (
    <S.Collapse in={Boolean(error)}>
      <Stack mb={mb}>
        <FormHelperText
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
          error={Boolean(error)}
        >
          <ErrorOutlineIcon />
          {error}
        </FormHelperText>
      </Stack>
    </S.Collapse>
  );
};
