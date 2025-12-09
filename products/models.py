from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre")
    slug = models.SlugField(unique=True, verbose_name="URL Amigable")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

class Product(models.Model):
    name = models.CharField(max_length=255, verbose_name="Nombre del Producto")
    description = models.TextField(blank=True, verbose_name="Descripción")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio")
    stock = models.IntegerField(default=0, verbose_name="Stock")
    
    # Usaremos una URL de imagen por ahora para no complicarnos con subida de archivos todavía
    image_url = models.URLField(max_length=500, blank=True, verbose_name="URL de Imagen")
    
    # Relación: Un producto pertenece a una categoría
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name="Categoría")
    
    # Fechas automáticas
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"