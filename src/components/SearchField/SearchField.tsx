"use client";

import React, { useEffect, useRef } from "react";
import { Autocomplete } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import { SearchFieldProps } from "./types";
import * as S from "./styles";

export const SearchField = <T,>({
  options,
  value,
  placeholder,
  ariaLabel,
  autoFocus,
  inputValue,
  designType,
  onInputChange,
  onKeyDown,
  renderOption,
  ...rest
}: SearchFieldProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // custom autoFocus behavior to autoFocus conditionally not only on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const renderInputAdornment = (value: string) => {
    return value ? (
      <S.StyledIconButton onClick={(e) => onInputChange(e, "", "clear")}>
        <CloseIcon color={designType ? "primary" : "disabled"} />
      </S.StyledIconButton>
    ) : (
      <SearchIcon color={designType ? "primary" : "disabled"} />
    );
  };

  return (
    <Autocomplete
      {...rest}
      inputValue={inputValue}
      onInputChange={onInputChange}
      value={value}
      options={options}
      freeSolo
      disableClearable
      renderOption={renderOption}
      renderInput={(params) => {
        return (
          <S.StyledTextField
            {...params}
            designType={designType}
            placeholder={placeholder}
            inputProps={{
              ...params.inputProps,
              "aria-label": ariaLabel,
            }}
            InputProps={{
              ...params.InputProps,
              onKeyDown: onKeyDown,
              endAdornment: renderInputAdornment(inputValue),
              inputRef,
            }}
          />
        );
      }}
    />
  );
};
