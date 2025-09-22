'use client';

import { createTheme } from '@mui/material/styles';
import { Rubik, Vazirmatn } from 'next/font/google';

const rubik = Rubik({
  weight: ['400', '600', '800'],
  display: 'swap',
  preload: true,
  subsets: ['latin'],
});

const vazirmatn = Vazirmatn({
  weight: ['400', '600', '800'],
  display: 'swap',
  preload: true,
  subsets: ['arabic'],
});

const LINK_COLOR = 'hsl(210, 100%, 66%)';

const theme = createTheme({
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `${rubik.style.fontFamily}, ${vazirmatn.style.fontFamily}`,
  },
  colorSchemes: {
    light: {
      palette: {
        background: { default: '#ffffff', paper: '#ffffff' },
        text: { primary: '#222222', secondary: 'rgba(0,0,0,0.68)' },
        primary: { main: '#1966e2ff', contrastText: '#ffffff' },
        secondary: { main: '#a704e8' },
        info: { main: '#26C6DA' },
        success: { main: '#2E7D32' },
        warning: { main: '#ED6C02' },
        error: { main: '#D32F2F' },
        divider: 'rgba(0,0,0,0.12)',
      },
    },
    dark: {
      palette: {
        background: { default: '#1f2024ff', paper: '#191c22ff' },
        text: { primary: '#ffffffff', secondary: 'rgba(255,255,255,0.72)' },
        primary: { main: '#1966e2ff', contrastText: '#FFFFFF' },
        secondary: { main: '#a704e8' },
        info: { main: '#4DD0E1' },
        success: { main: '#66BB6A' },
        warning: { main: '#FFB74D' },
        error: { main: '#EF5350' },
        divider: 'rgba(255,255,255,0.15)',
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiButton: {
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiCssBaseline: {
      styleOverrides: () => ({
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        a: {
          color: LINK_COLOR,
          textDecoration: 'none',
        },
      }),
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: LINK_COLOR,
          textDecoration: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme: muiTheme }) => ({
          backgroundImage: 'none',
          borderBottomColor: muiTheme.palette.divider,
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
        }),
      },
    },
  },
});

export default theme;
