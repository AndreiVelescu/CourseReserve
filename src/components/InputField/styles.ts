import styled from "@emotion/styled";
import {
  inputLabelClasses,
  InputLabel as MuiInputLabel,
  OutlinedInput as MuiOutlinedInput,
  outlinedInputClasses,
} from "@mui/material";

interface OutlinedInputProps {
  invisible?: boolean;
}
export const OutlinedInput = styled(MuiOutlinedInput, {
  shouldForwardProp: (prop) => !["invisible"].includes(prop),
})<OutlinedInputProps>(({ theme, invisible }) => ({
  "& input:-webkit-autofill, input:-webkit-autofill:focus": {
    boxShadow: `0 0 0 1000px ${theme.palette.inheritWhite.main} inset`,
    WebkitTextFillColor: theme.palette.text.primary,
  },
  backgroundColor: theme.palette.background.paper,
  paddingBottom: 0,
  ...(invisible
    ? {
        [`.${outlinedInputClasses.input}`]: {
          paddingLeft: theme.spacing(1.25),

          [`&.${outlinedInputClasses.disabled}`]: {
            color: theme.palette.text.primary,
            WebkitTextFillColor: theme.palette.text.primary,
          },
        },
        [`.${outlinedInputClasses.notchedOutline}`]: {
          border: "none",
        },
      }
    : {}),
}));

export const InputLabel = styled(MuiInputLabel)(({ theme, color }) => {
  const textColor = theme.palette.text.secondary;
  const selectedColor = color ? theme.palette[color].main : undefined;
  return {
    color: selectedColor ? selectedColor : textColor,

    [`&.${inputLabelClasses.disabled}`]: {
      color: textColor,
    },
    [`&.${inputLabelClasses.focused}`]: {
      color: theme.palette.primary.main,
    },
  };
});
