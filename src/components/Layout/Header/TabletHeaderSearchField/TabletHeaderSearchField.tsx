"use client";

import { HeaderDrawer } from "../HeaderDrawer/HeaderDrawer";

import { TabletHeaderSearchFieldProps } from "./types";

export const TabletHeaderSearchField = ({
  open,
  onClose,
  onClickRoute,
}: TabletHeaderSearchFieldProps) => {
  return (
    <HeaderDrawer open={open} onClose={onClose}>
      <div></div>
    </HeaderDrawer>
  );
};
