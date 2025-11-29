import { BaseSelectProps, MenuItemProps } from "@mui/material";
export type SelectProps<T> = Pick<
  BaseSelectProps<T>,
  | "autoWidth"
  | "children"
  | "classes"
  | "defaultOpen"
  | "displayEmpty"
  | "id"
  | "label"
  | "multiple"
  | "native"
  | "onChange"
  | "onClose"
  | "onOpen"
  | "open"
  | "renderValue"
  | "SelectDisplayProps"
  | "sx"
  | "value"
  | "variant"
  | "onBlur"
  | "fullWidth"
  | "error"
  | "size"
  | "disabled"
  | "required"
  | "disableUnderline"
> & {
  id?: string;
  ariaLabel?: string;
  helperText?: string;
  shrinkLabel?: boolean;
  labelColored?: boolean;
  popoverSize?: "default" | "small";
  initialTextOverflow?: boolean;
  darkIcon?: boolean;
  /**
   * This prop will work only if the variant of the Select Input is "outlined",
   * otherwise it will be ignored.
   * @default false
   */
  notched?: boolean;
};

export type SelectOptionProps = Pick<
  MenuItemProps,
  | "autoFocus"
  | "children"
  | "classes"
  | "dense"
  | "disableGutters"
  | "divider"
  | "selected"
  | "value"
  | "sx"
  | "onClick"
  | "disabled"
>;
