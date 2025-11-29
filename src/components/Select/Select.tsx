"use client";

import {
  FormHelperText,
  ListSubheaderProps,
  MenuProps,
  Select as MuiSelect,
} from "@mui/material";
import isEqual from "lodash/isEqual";
import { useRef } from "react";

import { useGetElementDimensions } from "@/hooks/useGetElementDimensions";

import * as S from "./styles";
import { SelectOptionProps, SelectProps } from "./types";

const MIN_WIDTH = 100;
const SMALL_WIDTH = 250;

export const Select = <T,>({
  children,
  label,
  variant,
  helperText,
  id,
  ariaLabel,
  size,
  disabled,
  required,
  shrinkLabel,
  labelColored,
  popoverSize = "default",
  initialTextOverflow,
  darkIcon,
  notched,
  ...rest
}: SelectProps<T>) => {
  const hasValue = Boolean(rest.value) && !isEqual(rest.value, []);

  const formControlRef = useRef<HTMLDivElement>(null);
  const { calculatedElementWidth: formControlWidth } =
    useGetElementDimensions(formControlRef);

  const getMenuProps = (): Partial<MenuProps> => {
    // This is need it because if the width of the select is very small because there is not value selected and no placeholder then the popover width will be too small
    let width = formControlWidth > MIN_WIDTH ? formControlWidth : MIN_WIDTH;
    if (popoverSize === "small") {
      width = SMALL_WIDTH;
    }

    return {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "left",
      },
      slotProps: {
        paper: {
          sx: {
            width,
          },
        },
      },
    };
  };

  return (
    <S.FormControl
      hasValue={hasValue}
      darkIcon={darkIcon}
      error={rest.error}
      variant={variant}
      size={size}
      disabled={disabled}
      required={required}
      ref={formControlRef}
      fullWidth
    >
      <S.StyledInputLabel
        labelColored={labelColored && hasValue}
        shrink={shrinkLabel}
        htmlFor={ariaLabel}
        id={`${id}_label`}
        initialTextOverflow={initialTextOverflow}
        aria-label={ariaLabel}
      >
        {label}
      </S.StyledInputLabel>
      <MuiSelect
        {...rest}
        sx={{
          paddingBottom: 0,
          ...rest.sx,
        }}
        notched={notched}
        MenuProps={getMenuProps()}
        id={id}
        label={label}
        required={required}
        inputProps={{
          id: ariaLabel,
          "aria-label": ariaLabel,
        }}
      >
        {children}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </S.FormControl>
  );
};

const SelectOption = ({ children, ...rest }: SelectOptionProps) => {
  return (
    <S.StyledMenuItemSelectOption {...rest}>
      {children}
    </S.StyledMenuItemSelectOption>
  );
};

const SelectListSubheader = ({
  children,
  disabled,
  ...rest
}: ListSubheaderProps & { disabled?: boolean }) => {
  return (
    <S.StyledListsubheader {...rest} disabled={disabled} disableSticky={true}>
      {children}
    </S.StyledListsubheader>
  );
};

Select.Option = SelectOption;
Select.ListSubheader = SelectListSubheader;
