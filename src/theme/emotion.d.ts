/* eslint-disable @typescript-eslint/no-empty-interface */
import { PaletteColor } from "@mui/material";

import { Theme as CustomTheme } from ".";

interface CustomPalette {
  inheritWhite: PaletteColor;
  inheritText: PaletteColor;
  overlay: string;
  gray: PaletteColor;
  states: {
    main: {
      hover: string;
      selected: string;
      focus: string;
      focusVisible: string;
      outlinedBorder: string;
    };
    warning: {
      hover: string;
      selected: string;
      focusVisible: string;
      outlinedBorder: string;
    };
  };
}

// Override the Palette and PaletteOptions to include the custom options
declare module "@mui/material/styles/createPalette" {
  export interface PaletteOptions extends CustomPalette {}
  export interface Palette extends CustomPalette {}
}

// Other declarations unchanged from your original code
declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    zero: true;
    xxxs: true;
    xxs: true;
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
    xxxl: true;
  }

  interface TypographyVariants {
    bodyXl?: React.CSSProperties;
    "h4-extraLight"?: React.CSSProperties;
    "h5-light"?: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    bodyXl?: React.CSSProperties;
    "h4-extraLight"?: React.CSSProperties;
    "h5-light"?: React.CSSProperties;
  }

  interface Theme {}
  interface ThemeOptions {}
  interface TypeBackground {
    primary: string;
    secondary: string;
  }
  interface TypeText {
    accentMedium: string;
    light: string;
    success: string;
    accentDark: string;
  }

  interface CommonColors {
    orange: {
      light: string;
      dark: string;
    };
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    bodyXl: true;
  }
}

declare module "@mui/material/FormLabel" {
  interface FormLabelPropsColorOverrides {
    gray: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    inheritWhite: true;
    inheritText: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    inheritWhite: true;
    inheritText: true;
  }
}

declare module "@emotion/react" {
  export interface Theme extends CustomTheme {}
}
