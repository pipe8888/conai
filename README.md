# Dropifyai 🤖

Tienda de productos con Inteligencia Artificial.
Construida con React + Vite + Redux Toolkit.

## Stack
- React 18
- Vite
- Redux Toolkit
- React Router DOM
- Axios

## Comandos
npm install     → instalar dependencias
npm run dev     → servidor de desarrollo
npm run build   → build de producción

## Páginas
/ → Home
/productos → Catálogo
/producto/:id → Detalle
/carrito → Carrito
/contacto → Contacto

## Estructura
src/
├── components/   → Navbar, Footer
├── pages/        → Home, Products, ProductDetail, Cart, Contact
├── data/         → products.js, categories.js
├── context/      → store.js, cartSlice.js, productsSlice.js
├── utils/        → formatPrice.js
