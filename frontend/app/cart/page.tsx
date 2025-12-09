'use client';

import { 
  Container, Typography, Box, Button, Card, 
  IconButton, Divider, Grid 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useCart } from '../../context/CartContext'; 

// Definimos la interfaz aquí para que TypeScript
interface CartItem {
  id: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
}

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce((sum: number, item: CartItem) => {
    return sum + (parseFloat(item.price) * item.quantity);
  }, 0);

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Tu carrito está vacío 😢</Typography>
        <Link href="/" passHref>
          <Button variant="contained" startIcon={<ArrowBackIcon />}>
            Volver a la Tienda
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Link href="/" passHref>
          <Button startIcon={<ArrowBackIcon />}>Seguir Comprando</Button>
        </Link>
      </Box>

      <Typography variant="h4" gutterBottom>Carrito de Compras</Typography>
      
      <Grid container spacing={4}>
        {/* LISTA DE PRODUCTOS (IZQUIERDA) */}
        <Grid size={{ xs: 12, md: 8 }}>
          {cart.map((item: CartItem) => (
            <Card key={item.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', p: 2 }}>
              <Box 
                component="img"
                sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                src={item.image_url || "https://via.placeholder.com/150"}
                alt={item.name}
              />
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio: S/ {item.price}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <IconButton size="small" onClick={() => removeFromCart(item.id)}>
                  {item.quantity === 1 ? <DeleteIcon color="error"/> : <RemoveIcon />}
                </IconButton>
                <Typography sx={{ mx: 2, fontWeight: 'bold' }}>{item.quantity}</Typography>
                <IconButton size="small" onClick={() => addToCart(item)}>
                  <AddIcon />
                </IconButton>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', minWidth: 80, textAlign: 'right' }}>
                S/ {(parseFloat(item.price) * item.quantity).toFixed(2)}
              </Typography>
            </Card>
          ))}
          
          <Button color="error" onClick={clearCart} sx={{ mt: 2 }}>
            Vaciar Carrito
          </Button>
        </Grid>

        {/* RESUMEN DE PAGO */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom>Resumen</Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Subtotal</Typography>
              <Typography>S/ {totalPrice.toFixed(2)}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h5">Total</Typography>
              <Typography variant="h5" color="primary">S/ {totalPrice.toFixed(2)}</Typography>
            </Box>

            <Button variant="contained" fullWidth size="large">
              Proceder al Pago
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}