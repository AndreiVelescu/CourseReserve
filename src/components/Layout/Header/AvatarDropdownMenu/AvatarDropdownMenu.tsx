"use client";

import { useState } from "react";

import { Avatar } from "@/components/Avatar";

import * as S from "./styles";
import { MenuItem } from "@mui/material";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/hooks/useAuth";

export const AvatarDropdownMenu = () => {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);
  const router = useRouter();

  const { logout } = useAuth();

  return (
    <S.StyledDropdownMenu
      triggerComponent={<Avatar variant="circular" avatarSize="large" />}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      horizontalPosition="right"
      verticalPosition="bottom"
      horizontalOrientation="right"
      gap={-7}
      ariaLabel="authorisation dropdown menu"
    >
      <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
      <MenuItem onClick={() => router.push("/settings")}>Settings</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </S.StyledDropdownMenu>
  );
};
