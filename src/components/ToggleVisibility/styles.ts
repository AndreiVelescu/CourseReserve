import styled from "@emotion/styled";

export const Wrapper = styled.div((props) => ({
  position: "relative",
}));

export const Hide = styled.div<{
  hide?: boolean;
}>(({ hide }) =>
  hide
    ? {
        position: "absolute",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }
    : {},
);
