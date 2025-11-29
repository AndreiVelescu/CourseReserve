import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox as MuiCheckbox,
  Theme,
} from "@mui/material";
import { SystemCssProperties } from "@mui/system";

import { CheckboxProps } from "./types";
import { WrapperCheckbox } from "./styles";

export const Checkbox = ({
  withLabel = false,
  label,
  error,
  helperText,
  ariaLabel,
  required,
  sx,
  color = "primary",
  size = "medium",
  ...rest
}: CheckboxProps) => {
  const inputAriaLabel = ariaLabel || (typeof label === "string" ? label : "");

  const uncheckedColor: SystemCssProperties<Theme> = {
    ...((color === "primary" ||
      color === "error" ||
      color === "warning" ||
      color === "info" ||
      color === "success") && {
      color: `${color}.main`,
    }),
  };

  const CheckboxComponent = (
    <MuiCheckbox
      {...rest}
      inputProps={{ ...rest.inputProps, "aria-label": inputAriaLabel }}
      sx={[uncheckedColor, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );

  const wrapperCheckboxProps = {
    size: size,
    error: error,
  };

  return (
    <FormControl error={error}>
      {withLabel ? (
        <FormControlLabel
          required={required}
          control={
            <WrapperCheckbox {...wrapperCheckboxProps}>
              {CheckboxComponent}
            </WrapperCheckbox>
          }
          slotProps={{
            typography: {
              variant: size === "large" ? "body1" : "body2",
              color: "textPrimary",
              padding: 0,
            },
          }}
          label={label}
        />
      ) : (
        <WrapperCheckbox {...wrapperCheckboxProps}>
          {CheckboxComponent}
        </WrapperCheckbox>
      )}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
