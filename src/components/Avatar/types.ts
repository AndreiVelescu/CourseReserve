import { AvatarProps as MuiAvatarProps } from "@mui/material";

export type AvatarSize = "small" | "medium" | "large" | "xlarge";

export type AvatarProps = Pick<
  MuiAvatarProps,
  | "alt"
  | "children"
  | "classes"
  | "imgProps"
  | "sizes"
  | "src"
  | "srcSet"
  | "sx"
  | "variant"
> & {
  avatarSize?: AvatarSize;
};
