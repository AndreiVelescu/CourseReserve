"use client";

import {
  CircularProgress,
  CircularProgressProps,
  Typography,
} from "@mui/material";
import { forwardRef } from "react";

import * as S from "./styles";
import { ButtonProps } from "./types";

const LoadingIndicator = (props: Partial<CircularProgressProps>) => (
  <CircularProgress color="inherit" size={16} {...props} />
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      loading = false,
      loadingPosition = "center",
      disabled,
      endIcon,
      startIcon,
      component = "button",
      size,
      ariaLabel,
      capitalize,
      ...restProps
    },
    ref,
  ) => {
    const isLoadingCenter = loading && loadingPosition === "center";
    const isLoadingEnd = loading && loadingPosition === "end";
    const isLoadingStart = loading && loadingPosition === "start";

    const capitalizedChildren = capitalize ? (
      <Typography variant="inherit" sx={{ textTransform: "capitalize" }}>
        {children}
      </Typography>
    ) : (
      children
    );

    let finalEndIcon = isLoadingEnd ? <LoadingIndicator /> : endIcon;
    let finalStartIcon = isLoadingStart ? <LoadingIndicator /> : startIcon;
    if (isLoadingCenter) {
      finalEndIcon = null;
      finalStartIcon = null;
    }
    return (
      <S.StyledButton
        {...restProps}
        ref={ref}
        disabled={disabled || loading}
        endIcon={finalEndIcon}
        startIcon={finalStartIcon}
        component={component}
        disableElevation
        size={size}
        aria-label={ariaLabel}
        role="button"
        color="inheritText"
      >
        {isLoadingCenter ? (
          <>
            <S.HiddenContainer>{children}</S.HiddenContainer>
            <S.CenteredContainer>
              <LoadingIndicator />
            </S.CenteredContainer>
          </>
        ) : (
          capitalizedChildren
        )}
      </S.StyledButton>
    );
  },
);
