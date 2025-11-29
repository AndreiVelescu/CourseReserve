"use client";

import { Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useTranslations } from "next-intl";

import * as S from "./styles";
import { CheckStatus, ChecklistProps } from "./types";

const getIconByStatus = (status?: CheckStatus) => {
  if (status === "success") {
    return <CheckCircleIcon fontSize="small" color="success" />;
  }

  if (status === "warning") {
    return <ErrorIcon fontSize="small" color="error" />;
  }

  return <CheckCircleOutlineIcon fontSize="small" color="inherit" />;
};

export const Checklist = ({ items }: ChecklistProps) => {
  const translateContent = useTranslations("PasswordChecklist");
  return (
    <S.List>
      {items.map((item) => (
        <S.ListItem key={item.id}>
          <S.IconWrapper>{getIconByStatus(item.status)}</S.IconWrapper>
          <Typography variant="body2">{translateContent(item.text)}</Typography>
        </S.ListItem>
      ))}
    </S.List>
  );
};
