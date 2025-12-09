'use client';

import { useEffect, useState } from 'react';
import { 
  Container, Card, CardMedia, CardContent, 
  Typography, Button, Box, AppBar, Toolbar, CircularProgress,
  IconButton, Badge, InputBase, Rating, Chip,
  Menu, MenuItem, ListItemIcon, ListItemText 
} from '@mui/material';
import Grid from '@mui/material/Grid'; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Link from 'next/link';
import { useCart } from '../context/CartContext'; 
import { useSnackbar } from 'notistack'; 

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image_url: string;
  category: number;
  category_name?: string;
}

export default function CatalogPage() {
  const { addToCart, totalItems } = useCart();
  const { enqueueSnackbar } = useSnackbar();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Estado del menú
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // 1. Cargar Productos
    fetch('http://127.0.0.1:8000/api/products/')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => setLoading(false));

    // 2. Cargar Categorías
    fetch('http://127.0.0.1:8000/api/categories/')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error categorías:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    enqueueSnackbar(`¡${product.name} agregado al carrito!`, { 
      variant: 'success', 
      autoHideDuration: 2000 
    });
  };

  // Funciones del Menú
  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleSelectCategory = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    handleCloseMenu();
  };

  // Filtrado
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#F4F6F8' }}>
      
      {/* --- NAVBAR --- */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid #e0e0e0', boxShadow: 'none' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            
            {/* IZQUIERDA: MENÚ Y LOGO */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                size="large" edge="start" color="primary" aria-label="menu" sx={{ mr: 2 }}
                onClick={handleClickMenu}
              >
                <MenuIcon />
              </IconButton>

              <Typography variant="h5" component="div" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: -1, display: { xs: 'none', sm: 'block' } }}>
                Mercado<span style={{ color: '#003366' }}>Tech</span>
              </Typography>
            </Box>

            {/* MENÚ DESPLEGABLE */}
            <Menu
              id="basic-menu" anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}
              MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            >
              <MenuItem onClick={() => handleSelectCategory(null)} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                <ListItemIcon><CategoryIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Ver Todo</ListItemText>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} onClick={() => handleSelectCategory(cat.id)}>
                  <ListItemText>{cat.name}</ListItemText>
                </MenuItem>
              ))}
            </Menu>

            {/* CENTRO: BUSCADOR */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              bgcolor: '#F4F6F8', 
              borderRadius: 50, 
              px: 2, py: 0.5, 
              flexGrow: 1, 
              maxWidth: 500, 
              mx: 2 
            }}>
              <SearchIcon sx={{ color: 'text.secondary' }} />
              <InputBase 
                sx={{ ml: 1, flex: 1 }} 
                placeholder="¿Qué estás buscando hoy?" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>

            {/* DERECHA: ACCIONES (Aquí agregamos Mis Pedidos) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              
              {/* --- NUEVO BOTÓN: MIS PEDIDOS --- */}
              <Button 
                color="inherit" 
                sx={{ 
                  display: { xs: 'none', md: 'flex' }, 
                  textTransform: 'none', 
                  fontWeight: 600, 
                  color: 'text.secondary',
                  mr: 1
                }}
                startIcon={<Inventory2OutlinedIcon />}
              >
                Mis pedidos
              </Button>
              {/* ------------------------------- */}

              {isLoggedIn ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, bgcolor: '#F4F6F8', px: 2, py: 0.5, borderRadius: 2 }}>
                  <PersonOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight="600">Hola, Cliente</Typography>
                  <IconButton size="small" onClick={handleLogout} sx={{ ml: 1 }}>
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
                  <Link href="/login"><Button variant="outlined" color="primary">Ingresar</Button></Link>
                  <Link href="/register"><Button variant="contained" color="primary" disableElevation>Regístrate</Button></Link>
                </Box>
              )}

              <Link href="/cart">
                <IconButton sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                  <Badge badgeContent={totalItems} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* --- BANNER --- */}
      <Box sx={{ bgcolor: '#003366', color: 'white', py: 1.5, textAlign: 'center' }}>
        <Typography variant="body2" fontWeight="bold">
          🚀 ¡Envío GRATIS a todo el país por compras mayores a S/ 200!
        </Typography>
      </Box>

      {/* --- CATÁLOGO --- */}
      <Container sx={{ py: 6 }} maxWidth="lg">
        
        {/* Título dinámico */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 800, color: '#1A2027', flexGrow: 1, mb: 0 }}>
            {selectedCategory 
              ? categories.find(c => c.id === selectedCategory)?.name || "Categoría" 
              : "Novedades"
            }
          </Typography>
          {selectedCategory && (
            <Button size="small" onClick={() => handleSelectCategory(null)}>Ver todos</Button>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                <Card sx={{ 
                  height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', 
                  overflow: 'visible', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                }}>
                  <Chip label="NUEVO" color="primary" size="small" sx={{ position: 'absolute', top: -10, left: 10, fontWeight: 'bold', height: 24 }} />
                  <Link href={`/product/${product.id}`} passHref style={{ cursor: 'pointer' }}>
                    <CardMedia component="img" height="200" image={product.image_url || "https://via.placeholder.com/300"} alt={product.name} sx={{ objectFit: 'contain', p: 3 }} />
                  </Link>
                  <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                      {product.category_name || categories.find(c => c.id === product.category)?.name || "General"}
                    </Typography>
                    <Link href={`/product/${product.id}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography gutterBottom variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2, height: '2.4em', overflow: 'hidden', mt: 0.5, '&:hover': { color: 'primary.main' } }}>
                        {product.name}
                      </Typography>
                    </Link>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={4.5} precision={0.5} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>(24)</Typography>
                    </Box>
                    <Typography variant="h5" color="primary.main" fontWeight="800">S/ {product.price}</Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button variant="outlined" fullWidth startIcon={<ShoppingCartIcon />} onClick={() => handleAddToCart(product)} sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                      Agregar
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}