'use client';

import { useState } from 'react';
import { 
  Button, TextField, Container, Typography, Box, Alert, 
  Paper, InputAdornment 
} from '@mui/material';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.email, password: formData.password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/'; 
      } else {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xs">
        {/* Botón Volver flotante */}
        <Box sx={{ mb: 2 }}>
          <Link href="/" passHref>
            <Button startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary' }}>
              Volver a la tienda
            </Button>
          </Link>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Typography component="h1" variant="h4" color="primary.main" gutterBottom>
              MercadoTech
            </Typography>
            <Typography component="h2" variant="h6" color="text.secondary">
              ¡Hola de nuevo! 👋
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal" required fullWidth id="email" label="Correo Electrónico"
              name="email" type="email" autoComplete="email" autoFocus
              value={formData.email} onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
              }}
            />
            <TextField
              margin="normal" required fullWidth id="password" label="Contraseña"
              name="password" type="password" autoComplete="current-password"
              value={formData.password} onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
              }}
            />
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large"
              sx={{ mt: 4, mb: 2, height: 48, fontSize: '1rem' }}
            >
              Iniciar Sesión
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes cuenta?{' '}
                <Link href="/register" style={{ color: '#0066CC', fontWeight: 600, textDecoration: 'none' }}>
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}