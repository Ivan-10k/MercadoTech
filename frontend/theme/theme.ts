'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC', // Azul "Tech" vibrante (Estilo BestBuy/PayPal)
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF3D00', // Naranja/Rojo para ofertas y acciones fuertes
    },
    background: {
      default: '#F4F6F8', // Gris muy suave para el fondo de la página
      paper: '#ffffff',
    },
    text: {
      primary: '#212B36', // Negro suave (menos duro que #000)
      secondary: '#637381',
    },
  },
  typography: {
    fontFamily: '"Public Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: {
      fontWeight: 700,
      textTransform: 'none', // Botones con texto normal, no mayúsculas forzadas
    },
  },
  shape: {
    borderRadius: 8, // Bordes redondeados modernos
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px 0 rgba(0, 102, 204, 0.24)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0066CC',
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Tarjetas bien redondeadas
          boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)', // Sombra moderna "flotante"
          border: '1px solid transparent',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;