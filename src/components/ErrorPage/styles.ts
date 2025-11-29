import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import Image from "next/image";

const SVG_GAP = -25;
export const CONTAINER_DESKTOP_MIN_HEIGHT = 633;

export const Wrapper = styled.div(({ theme }) => ({
  flex: 1,
  height: "100%",
  position: "relative",
  minHeight: CONTAINER_DESKTOP_MIN_HEIGHT,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  [theme.breakpoints.down("xxs")]: {
    minHeight: 574,
  },
}));

export const RightImage = styled(Image)(({ theme }) => ({
  position: "absolute",
  right: SVG_GAP,
  [theme.breakpoints.down("xs")]: {
    width: 270,
  },
  [theme.breakpoints.down("xxs")]: {
    display: "none",
  },
}));

export const LeftImage = styled(Image)(({ theme }) => ({
  position: "absolute",
  left: SVG_GAP,
  transform: "scaleX(-1)",
  [theme.breakpoints.down("xs")]: {
    width: 270,
  },
  [theme.breakpoints.down("xxs")]: {
    display: "none",
  },
}));

export const BottomImage = styled(Image)(({ theme }) => ({
  [theme.breakpoints.up("xxs")]: {
    display: "none",
  },
  position: "absolute",
  bottom: -1,
}));

export const TopImage = styled(Image)(({ theme }) => ({
  [theme.breakpoints.up("xxs")]: {
    display: "none",
  },
  position: "absolute",
  transform: "scaleY(-1)",
  top: -1,
}));
export const StyledTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    maxWidth: 268,
  },
  [theme.breakpoints.down("xxs")]: {
    maxWidth: 343,
  },
}));
