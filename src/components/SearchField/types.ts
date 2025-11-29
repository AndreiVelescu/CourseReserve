import { AutocompleteProps } from "@mui/material";

type Props<T> = AutocompleteProps<
  T,
  boolean | undefined,
  boolean | undefined,
  boolean | undefined
>;

export type SearchFieldProps<T> = Pick<
  Props<T>,
  | "options"
  | "autoComplete"
  | "autoHighlight"
  | "autoSelect"
  | "blurOnSelect"
  | "classes"
  | "clearOnBlur"
  | "clearOnEscape"
  | "clearText"
  | "closeText"
  | "disableCloseOnSelect"
  | "disabled"
  | "disabledItemsFocusable"
  | "disableListWrap"
  | "disablePortal"
  | "filterOptions"
  | "filterSelectedOptions"
  | "fullWidth"
  | "getOptionDisabled"
  | "getOptionLabel"
  | "groupBy"
  | "handleHomeEndKeys"
  | "id"
  | "includeInputInList"
  | "isOptionEqualToValue"
  | "loading"
  | "loadingText"
  | "noOptionsText"
  | "onChange"
  | "onClose"
  | "onHighlightChange"
  | "onOpen"
  | "open"
  | "openOnFocus"
  | "openText"
  | "readOnly"
  | "selectOnFocus"
  | "size"
  | "sx"
  | "onBlur"
  | "onFocus"
  | "slots"
> & {
  renderOption?: AutocompleteProps<T, undefined, true, true>["renderOption"];
  value?: NonNullable<string | T>;
  placeholder?: string;
  ariaLabel: string;
  autoFocus?: boolean;
  designType?: "colored";
  inputValue: NonNullable<Props<T>["inputValue"]>;
  onInputChange: NonNullable<Props<T>["onInputChange"]>;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
};
