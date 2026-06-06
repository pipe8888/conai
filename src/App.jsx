import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import AdminRoute from './components/AdminRoute'
import SocialProofPopup from './components/SocialProofPopup'
import CartDrawer from './components/CartDrawer'
import AIAssistant from './components/AIAssistant'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutPago from './pages/CheckoutPago'
import OrderConfirmation from './pages/OrderConfirmation'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Admin from './pages/Admin'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main style={{ paddingTop: '100px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/pago" element={<CheckoutPago />} />
            <Route path="/checkout/confirmacion" element={<OrderConfirmation />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Routes>
        </main>
        <CartDrawer />
        <AIAssistant />
        <SocialProofPopup />
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
