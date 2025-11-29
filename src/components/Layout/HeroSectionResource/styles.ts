import styled from "@emotion/styled";

export const HeroSection = styled("div")(({ theme }) => ({
  backgroundColor: "#10193E",
  backgroundImage:
    'url("/assets/svgs/geometric/pattern-full-horizontal-minim-opacity.svg")',
  backgroundPosition: "bottom center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  paddingTop: theme.spacing(9),
  paddingBottom: theme.spacing(9),
  color: "white",
  [theme.breakpoints.down("md")]: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
  [theme.breakpoints.down("xxs")]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4.5),
  },
}));
