"use client";
import { createTheme, ThemeOptions } from "@mui/material/styles";

const { palette } = createTheme();

export const THEME_SPACING_UNIT = 8;
export const TOOLBAR_HEIGHT_DESKTOP = 76;
export const TOOLBAR_HEIGHT_MOBILE = 62;
export const CONTAINER_MAX_WIDTH_LG_UP = 1200;
export const CONTAINER_LEFT_RIGHT_PADDING_SPACING = 3;
export const CONTAINER_LEFT_RIGHT_PADDING_SPACING_XS_DOWN = 2;

let theme = createTheme({
  typography: {
    fontFamily: "var(--font-source-sans-pro),var(--font-inter),sans-serif",
  },
  palette: {
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "#BBBBBB",
      accentMedium: "#235CF3",
      accentDark: "#1D203F",
      light: "#FFFFFF",
    },
    background: {
      secondary: "#CCCCDF",
    },
    gray: palette.augmentColor({
      // to change this color if causes bugs
      color: {
        main: "#1D203F",
        light: "#FFFFFF",
        contrastText: "#FFFFFF",
      },
    }),
    common: {
      orange: {
        light: "#FFA14D",
        dark: "#D45A35",
      },
    },
    states: {
      main: {
        hover: "rgba(35, 92, 243, 0.04)",
        selected: "rgba(35, 92, 243, 0.08)",
        focus: "rgba(35, 92, 243, 0.12)",
        focusVisible: "rgba(35, 92, 243, 0.3)",
        outlinedBorder: "rgba(35, 92, 243, 1)",
      },
      warning: {
        hover: "rgba(255, 200, 3, 0.04)",
        selected: "rgba(255, 200, 3, 0.04)",
        focusVisible: "rgba(255, 200, 3, 0.3)",
        outlinedBorder: "rgba(255, 200, 3, 1)",
      },
    },
    inheritText: palette.augmentColor({
      color: {
        main: "#1D203F",
        light: "#FFFFFF",
        contrastText: "#FFFFFF",
      },
    }),
    inheritWhite: palette.augmentColor({
      color: {
        main: "#FFFFFF",
        light: "#FFFFFF",
        dark: "#E0E0E0",
        contrastText: "#235CF3",
      },
    }),
    action: {
      disabled: "#BBBBBB",
      disabledBackground: "rgba(0, 0, 0, 0.08)",
    },
    primary: {
      main: "#235CF3",
      dark: "#1D203F",
      light: "#D5E0FE",
      contrastText: "#FFFFFF",
    },
    overlay: "rgba(241, 242, 246, 1)",
  },
  breakpoints: {
    values: {
      zero: 0,
      xxxs: 320,
      xxs: 500,
      xs: 768,
      sm: 900,
      md: 1024,
      lg: 1140,
      xl: 1280,
      xxl: 1440,
      xxxl: 1700,
    },
  },
});

theme = createTheme(theme, {
  typography: {
    h1: {
      fontSize: theme.typography.pxToRem(76),
      fontWeight: 300,
      lineHeight: 1.17,
      letterSpacing: "-1.5px",
      paddingBottom: "32px",

      [theme.breakpoints.down("md")]: {
        fontSize: theme.typography.pxToRem(54),
        paddingBottom: "24px",
      },
      [theme.breakpoints.down("xxs")]: {
        fontSize: theme.typography.pxToRem(28),
        paddingBottom: "16px",
      },
    },
    h2: {
      fontSize: theme.typography.pxToRem(54),
      fontWeight: 300,
      lineHeight: 1.2,
      letterSpacing: "-0.5px",
      paddingBottom: "21px",

      [theme.breakpoints.down("md")]: {
        fontSize: theme.typography.pxToRem(40),
        paddingBottom: "18px",
      },
      [theme.breakpoints.down("xxs")]: {
        fontSize: theme.typography.pxToRem(32),
        paddingBottom: "16px",
      },
    },
    h3: {
      fontSize: theme.typography.pxToRem(40),
      fontWeight: 400,
      lineHeight: 1.17,
      paddingBottom: "17px",

      [theme.breakpoints.down("md")]: {
        fontSize: theme.typography.pxToRem(31),
        paddingBottom: "13px",
      },
      [theme.breakpoints.down("xxs")]: {
        fontSize: theme.typography.pxToRem(24),
        paddingBottom: "10px",
      },
    },
    h4: {
      fontSize: theme.typography.pxToRem(34),
      fontWeight: 700,
      lineHeight: 1.24,
      letterSpacing: "0.25px",
      paddingBottom: "12px",

      [theme.breakpoints.down("md")]: {
        fontSize: theme.typography.pxToRem(24),
        paddingBottom: "11px",
      },
      [theme.breakpoints.down("xxs")]: {
        fontSize: theme.typography.pxToRem(20),
        paddingBottom: "10px",
      },
    },
    "h4-extraLight": {
      fontSize: theme.typography.pxToRem(34),
      fontWeight: 200,
      lineHeight: 1.24,
      letterSpacing: "0.25px",
      paddingBottom: "12px",

      [theme.breakpoints.down("md")]: {
        fontSize: theme.typography.pxToRem(24),
        paddingBottom: "11px",
      },
      [theme.breakpoints.down("xxs")]: {
        fontSize: theme.typography.pxToRem(20),
        paddingBottom: "10px",
      },
    },
    h5: {
      fontSize: theme.typography.pxToRem(24),
      lineHeight: 1.33,
      fontWeight: 700,
      paddingBottom: "8px",

      [theme.breakpoints.down("xxs")]: {
        fontSize: theme.typography.pxToRem(20),
        paddingBottom: "7px",
      },
    },
    "h5-light": {
      fontSize: theme.typography.pxToRem(24),
      lineHeight: 1.33,
      fontWeight: 300,
      paddingBottom: "8px",

      [theme.breakpoints.down("xxs")]: {
        fontSize: theme.typography.pxToRem(20),
        paddingBottom: "7px",
      },
    },
    h6: {
      fontSize: theme.typography.pxToRem(20),
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: "0.15px",
      paddingBottom: "7px",

      [theme.breakpoints.down("xxs")]: {
        fontSize: theme.typography.pxToRem(16),
        paddingBottom: "6px",
      },
    },
    body1: {
      fontSize: theme.typography.pxToRem(16),
      lineHeight: 1.5,
      letterSpacing: "0.15px",
      fontWeight: 400,
      paddingBottom: "6px",
    },
    body2: {
      fontSize: theme.typography.pxToRem(14),
      lineHeight: 1.43,
      letterSpacing: "0.17px",
      paddingBottom: "5px",
    },
    bodyXl: {
      fontSize: theme.typography.pxToRem(32),
      fontWeight: 400,
      lineHeight: 1.35,
      letterSpacing: "0.25px",
      paddingBottom: "12px",

      [theme.breakpoints.down("md")]: {
        fontSize: theme.typography.pxToRem(22),
        paddingBottom: "9px",
      },
      [theme.breakpoints.down("xxs")]: {
        fontSize: theme.typography.pxToRem(17),
        paddingBottom: "9px",
      },
    },
    overline: {
      fontSize: theme.typography.pxToRem(12),
      fontFamily: "Inter",
      lineHeight: 2.66,
      letterSpacing: "1px",
      textTransform: "uppercase",
      paddingBottom: "4px",
    },
    caption: {
      fontSize: theme.typography.pxToRem(12),
      lineHeight: 1.66,
      letterSpacing: "0.4px",
      paddingBottom: "4px",
    },
    "caption-allcaps": {
      fontSize: theme.typography.pxToRem(12),
      lineHeight: 1.66,
      letterSpacing: "0.4px",
      textTransform: "uppercase",
      paddingBottom: "4px",
    },
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: "h1" },
          style: {
            paddingBottom: "32px",
            [theme.breakpoints.down("md")]: {
              paddingBottom: "24px",
            },
            [theme.breakpoints.down("xxs")]: {
              paddingBottom: "16px",
            },
          },
        },
        {
          props: { variant: "h2" },
          style: {
            paddingBottom: "21px",
            [theme.breakpoints.down("md")]: {
              paddingBottom: "18px",
            },
            [theme.breakpoints.down("xxs")]: {
              paddingBottom: "16px",
            },
          },
        },
        {
          props: { variant: "h2-regular" },
          style: {
            paddingBottom: "21px",
            [theme.breakpoints.down("md")]: {
              paddingBottom: "18px",
            },
            [theme.breakpoints.down("xxs")]: {
              paddingBottom: "16px",
            },
          },
        },
        {
          props: { variant: "h3" },
          style: {
            paddingBottom: "17px",
            [theme.breakpoints.down("md")]: {
              paddingBottom: "13px",
            },
            [theme.breakpoints.down("xxs")]: {
              paddingBottom: "10px",
            },
          },
        },
        {
          props: { variant: "h4" },
          style: {
            paddingBottom: "12px",
            [theme.breakpoints.down("md")]: {
              paddingBottom: "11px",
            },
            [theme.breakpoints.down("xxs")]: {
              paddingBottom: "10px",
            },
          },
        },
        {
          props: { variant: "h5" },
          style: {
            paddingBottom: "8px",
            [theme.breakpoints.down("xxs")]: {
              paddingBottom: "7px",
            },
          },
        },
        {
          props: { variant: "h6" },
          style: {
            paddingBottom: "7px",
            [theme.breakpoints.down("xxs")]: {
              paddingBottom: "6px",
            },
          },
        },
        {
          props: { variant: "bodyXl" },
          style: {
            paddingBottom: "12px",
            [theme.breakpoints.down("md")]: {
              paddingBottom: "9px",
            },
            [theme.breakpoints.down("xxs")]: {
              paddingBottom: "9px",
            },
          },
        },
      ],
      defaultProps: {
        variantMapping: {
          bodyXl: "p",
        },
      },
    },
  },
} as ThemeOptions);

export default theme;

export type Theme = typeof theme;
