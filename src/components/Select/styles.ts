import styled from "@emotion/styled";
import {
  InputLabel,
  ListSubheader,
  MenuItem,
  FormControl as MuiFormControl,
  selectClasses,
} from "@mui/material";

interface StyledFormControlProps {
  hasValue: boolean;
  darkIcon?: boolean;
}
export const FormControl = styled(MuiFormControl, {
  shouldForwardProp: (prop) => !["hasValue", "darkIcon"].includes(prop),
})<StyledFormControlProps>(
  ({ theme, hasValue, disabled, error, darkIcon }) => ({
    ...(hasValue && !disabled && !error
      ? {
          [`.${selectClasses.icon}`]: {
            color: darkIcon
              ? theme.palette.primary.main
              : theme.palette.primary.light,
          },
        }
      : {}),
  }),
);

export const StyledInputLabel = styled(InputLabel, {
  shouldForwardProp: (prop) =>
    !["labelColored", "initialTextOverflow"].includes(prop),
})<{ labelColored?: boolean; initialTextOverflow?: boolean }>(
  ({ theme, labelColored, initialTextOverflow }) => ({
    color: labelColored
      ? theme.palette.primary.main
      : theme.palette.text.secondary,
    ...(initialTextOverflow && { textOverflow: "initial" }),
  }),
);

export const StyledMenuItemSelectOption = styled(MenuItem)(() => ({
  whiteSpace: "normal",
}));

export const StyledListsubheader = styled(ListSubheader, {
  shouldForwardProp: (prop) => !["disabled"].includes(prop),
})<{ disabled?: boolean }>(({ theme, disabled }) => ({
  fontWeight: disabled ? 400 : 600,
  fontSize: disabled
    ? theme.typography.pxToRem(12)
    : theme.typography.pxToRem(16),
  color: disabled ? theme.palette.text.secondary : theme.palette.text.primary,
  lineHeight: "24px",
  padding: theme.spacing(0.75, 2),
}));
