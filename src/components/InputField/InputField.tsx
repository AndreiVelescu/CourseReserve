"use client";

import { HighlightOffRounded } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment } from "@mui/material";
import noop from "lodash/noop";
import { ChangeEventHandler, ReactNode } from "react";

import { HelperText } from "../HelperText";

import * as S from "./styles";
import { InputFieldProps } from "./types";

export const InputField = ({
  value,
  onChange = noop,
  id,
  label,
  clearable,
  startAdornment,
  endAdornment,
  ariaLabelClear = "clear text",
  helperText,
  error,
  type = "text",
  invisible,
  required,
  success,
  labelColor,
  color,
  size,
  fullWidth,
  disabled: disabledProp,
  ...restProps
}: InputFieldProps) => {
  const onChangeInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.currentTarget.value);
  };

  const onClickClear = () => {
    onChange("");
  };

  const hasClearIcon = Boolean(clearable && value);

  const endAdornmentUI: ReactNode = (hasClearIcon || endAdornment) && (
    <InputAdornment position="end">
      {hasClearIcon && (
        <IconButton
          aria-label={ariaLabelClear}
          onClick={onClickClear}
          edge="end"
        >
          <HighlightOffRounded />
        </IconButton>
      )}
      {endAdornment}
    </InputAdornment>
  );

  const disabled = invisible || disabledProp;

  return (
    <FormControl
      color={color}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      required={required}
    >
      <S.InputLabel
        {...(size === "small" && { size })}
        htmlFor={id}
        error={error}
        required={required}
        color={labelColor}
      >
        {label}
      </S.InputLabel>
      <S.OutlinedInput
        {...restProps}
        size={size}
        required={required}
        id={id}
        label={label}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChangeInput}
        startAdornment={
          startAdornment && (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          )
        }
        endAdornment={endAdornmentUI}
        invisible={invisible}
      />
      {helperText && (
        <HelperText error={error} success={success}>
          {helperText}
        </HelperText>
      )}
    </FormControl>
  );
};
