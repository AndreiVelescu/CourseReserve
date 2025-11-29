import styled from "@emotion/styled";
import { IconButton, TextField } from "@mui/material";
import { inputBaseClasses } from "@mui/material/InputBase";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { autocompleteClasses } from "@mui/material/Autocomplete";

export const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => !["designType"].includes(prop),
})<{
  designType?: "colored";
}>(({ theme, designType }) => ({
  [`& .${inputBaseClasses.root}`]: {
    backgroundColor: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(16),
    padding: theme.spacing(1, 1.5),
  },
  [`& .${outlinedInputClasses.root}:hover .${outlinedInputClasses.notchedOutline}`]:
    {
      borderWidth: 1,
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderWidth: 1,
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
  [`& .${outlinedInputClasses.input}.${autocompleteClasses.input}`]: {
    padding: 0,
  },

  ...(designType === "colored" && {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
      {
        borderWidth: 2,
        borderColor: theme.palette.primary.main,
      },
  }),
}));

export const StyledIconButton = styled(IconButton)(() => ({
  padding: 0,
}));
