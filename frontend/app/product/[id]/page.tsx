'use client';

import { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, Button, Chip, 
  Rating, CircularProgress, Paper, Divider 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { useSnackbar } from 'notistack';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  stock: number;
  category_name?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { enqueueSnackbar } = useSnackbar();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetch(`http://127.0.0.1:8000/api/products/${params.id}/`)
        .then((res) => {
          if (!res.ok) throw new Error('Producto no encontrado');
          return res.json();
        })
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params?.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      enqueueSnackbar(`¡${product.name} agregado!`, { 
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
      });
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  if (!product) {
    return <Container sx={{ mt: 5 }}><Typography variant="h5">Producto no encontrado</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      
      <Box sx={{ mb: 4 }}>
        <Link href="/" passHref>
          <Button startIcon={<ArrowBackIcon />}>Volver al Catálogo</Button>
        </Link>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e0e0e0' }}>
        <Grid container spacing={6}>
          
          {/* IMAGEN */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ 
              position: 'relative', 
              bgcolor: '#fff', 
              borderRadius: 2, 
              p: 4, 
              display: 'flex', 
              justifyContent: 'center',
              border: '1px solid #f0f0f0'
            }}>
              <Chip label="NUEVO" color="secondary" sx={{ position: 'absolute', top: 16, left: 16 }} />
              <img 
                src={product.image_url || "https://via.placeholder.com/500"} 
                alt={product.name} 
                style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} 
              />
            </Box>
          </Grid>

          {/* INFORMACIÓN */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* 2. AQUÍ MOSTRAMOS LA CATEGORÍA REAL */}
            <Typography variant="caption" color="primary" fontWeight="bold" sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              {product.category_name || "GENERAL"} 
            </Typography>
            
            <Typography variant="h3" fontWeight="800" sx={{ mt: 1, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Rating value={4.5} readOnly precision={0.5} />
              <Typography sx={{ ml: 1, color: 'text.secondary' }}>(120 Opiniones)</Typography>
            </Box>

            <Typography variant="h3" color="primary.main" fontWeight="bold" sx={{ mb: 3 }}>
              S/ {product.price}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
              {product.description || "Producto de alta calidad disponible en MercadoTech."}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{ py: 2, fontSize: '1.1rem' }}
              >
                Agregar al Carrito
              </Button>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, color: 'text.secondary', fontSize: '0.9rem', flexWrap: 'wrap' }}>
              <span>✅ Stock disponible: {product.stock}</span>
              {['TECNOLOGÍA', 'LAPTOPS', 'CELULARES', 'MONITORES'].includes(product.category_name?.toUpperCase() || '') ? (
                <span>🛡️ Garantía de 1 año</span>
              ) : ['FRESCOS', 'FRUTAS', 'VERDURAS'].includes(product.category_name?.toUpperCase() || '') ? (
                <span>🍃 Frescura Garantizada (24h)</span>
              ) : ['ABARROTES', 'LIMPIEZA'].includes(product.category_name?.toUpperCase() || '') ? (
                <span>📦 Envío Seguro</span>
              ) : (
                <span>⭐ Calidad Garantizada</span> 
              )}

            </Box>
          </Grid>

        </Grid>
      </Paper>
    </Container>
  );
}