"use client";

import { ClickAwayListener, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { Alert } from "../Alert";

import { FormAlertProps } from "./types";
import * as S from "./styles";

export const FormAlert = ({
  isOpen,
  onClose,
  title,
  variant = "success",
}: FormAlertProps) => {
  const renderIcon = () => {
    if (variant === "error") {
      return <ErrorIcon fontSize="inherit" />;
    }

    if (variant === "success") {
      return <CheckCircleOutlineIcon fontSize="inherit" />;
    }

    return <InfoIcon fontSize="inherit" />;
  };

  return (
    <S.StyledCollapse in={isOpen}>
      <ClickAwayListener onClickAway={onClose}>
        <Alert
          icon={renderIcon()}
          title={title}
          color={variant}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        />
      </ClickAwayListener>
    </S.StyledCollapse>
  );
};
