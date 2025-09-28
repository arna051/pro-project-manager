'use client';

import { alpha, createTheme } from '@mui/material/styles';
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
  defaultColorScheme: "dark",
  typography: {
    fontFamily: `${rubik.style.fontFamily}, ${vazirmatn.style.fontFamily}`,
  },
  colorSchemes: {
    dark: {
      palette: {
        background: { default: '#1f2024ff', paper: '#191c22ff' },
        text: { primary: '#ffffffff', secondary: 'rgba(255,255,255,0.72)' },
        primary: { main: '#27f885ff', contrastText: '#1d1d1dff' },
        secondary: { main: '#3294e4ff' },
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
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.glassy': {

            backgroundColor: alpha(theme.palette.background.paper, .25),
            backdropFilter: 'blur(7px)',
          },
          '&.glassy-dark': {

            backgroundColor: alpha("#000000", .45),
            backdropFilter: 'blur(10px)',
          }
        })
      }
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
