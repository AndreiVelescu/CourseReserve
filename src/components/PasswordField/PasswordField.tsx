"use client";

import { useState, ChangeEventHandler, MouseEvent } from "react";
import {
  FormControl,
  InputAdornment,
  IconButton,
  InputLabel,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";

import { HelperText } from "../HelperText";

import { PasswordFieldProps } from "./types";
import * as S from "./styles";

export const PasswordField = ({
  value,
  onChange,
  id,
  label = "Password",
  ariaLabelVisibility = "toggle password visibility",
  onBlur,
  helperText,
  defaultVisibility = false,
  autoComplete,
  error,
  placeholder,
  ...restProps
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(defaultVisibility);

  const toggleShowPassword = () => setShowPassword((show) => !show);

  const onMouseDownVisibility = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onChangeInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.currentTarget.value);
  };

  return (
    <FormControl {...restProps} error={error}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <S.StyledMuiOutlinedInput
        {...restProps}
        placeholder={placeholder}
        autoComplete={autoComplete}
        label={label}
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChangeInput}
        onBlur={onBlur}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={ariaLabelVisibility}
              onClick={toggleShowPassword}
              onMouseDown={onMouseDownVisibility}
              edge="end"
            >
              {showPassword ? (
                <VisibilityOff color="primary" />
              ) : (
                <Visibility color="primary" />
              )}
            </IconButton>
          </InputAdornment>
        }
      />
      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </FormControl>
  );
};
