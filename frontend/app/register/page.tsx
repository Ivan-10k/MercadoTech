'use client';

import { useState } from 'react';
import { 
  Button, TextField, Container, Typography, Box, Alert, 
  Paper, InputAdornment 
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Íconos
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    telefono: '',
  });

  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- VALIDACIONES DE SEGURIDAD ---
  const validateForm = () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: 'El correo electrónico es obligatorio.' });
      return false;
    }
    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres.' });
      return false;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(formData.password)) {
      setMessage({ type: 'error', text: 'La contraseña debe incluir al menos un carácter especial (@, #, $, etc.).' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: '¡Cuenta creada con éxito! Redirigiendo...' });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Mensaje de error si el correo ya existe
        setMessage({ type: 'error', text: 'Error: El correo ya está registrado o los datos son inválidos.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xs">
        
        {/* Botón Volver */}
        <Box sx={{ mb: 2 }}>
          <Link href="/" passHref>
            <Button startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary' }}>
              Volver a la tienda
            </Button>
          </Link>
        </Box>

        {/* TARJETA DE REGISTRO */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Typography component="h1" variant="h4" color="primary.main" gutterBottom>
              Crear Cuenta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Únete a MercadoTech hoy
            </Typography>
          </Box>

          {message && (
            <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            
            {/* Campo Email */}
            <TextField
              margin="normal" required fullWidth id="email" label="Correo Electrónico"
              name="email" type="email" autoComplete="email"
              value={formData.email} onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
              }}
            />

            {/* Campo Contraseña */}
            <TextField
              margin="normal" required fullWidth id="password" label="Contraseña"
              name="password" type="password" autoComplete="new-password"
              helperText="Mínimo 8 caracteres y un símbolo especial."
              value={formData.password} onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
              }}
            />

            {/* Campo Nombre */}
            <TextField
              margin="normal" fullWidth id="first_name" label="Nombre Completo"
              name="first_name" autoComplete="name"
              value={formData.first_name} onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
              }}
            />

            {/* Campo Teléfono */}
            <TextField
              margin="normal" fullWidth id="telefono" label="Teléfono"
              name="telefono" autoComplete="tel"
              value={formData.telefono} onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>,
              }}
            />
            
            {/* Botón de Acción */}
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large"
              sx={{ mt: 4, mb: 2, height: 48, fontSize: '1rem', fontWeight: 'bold' }}
            >
              Registrarse
            </Button>

            {/* Link al Login */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" style={{ color: '#0066CC', fontWeight: 700, textDecoration: 'none' }}>
                  Inicia Sesión
                </Link>
              </Typography>
            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
}