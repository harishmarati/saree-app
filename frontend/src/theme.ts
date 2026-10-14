import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7A1F3D',
      light: '#9C3A5A',
      dark: '#551430',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C9972C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FBF7F2',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2B1B22',
      secondary: '#6B5A62',
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, 'Segoe UI', Roboto, sans-serif",
    h4: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
