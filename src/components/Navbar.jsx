import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { count } = useCart()
  const navigate = useNavigate()

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        Dropify<span style={styles.logoAi}>ai</span>
      </Link>

      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Inicio</Link></li>
        <li><Link to="/productos" style={styles.link}>Productos</Link></li>
        <li><Link to="/contacto" style={styles.link}>Contacto</Link></li>
      </ul>

      <button onClick={() => navigate('/carrito')} style={styles.cartBtn}>
        🛒 Carrito {count > 0 && <span style={styles.badge}>{count}</span>}
      </button>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(108,99,255,0.2)',
    padding: '0 5%', height: '64px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    fontSize: '22px', fontWeight: 700, textDecoration: 'none',
    background: 'linear-gradient(135deg,#6c63ff,#22d3ee)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  logoAi: { fontWeight: 300 },
  links: {
    display: 'flex', gap: '28px', listStyle: 'none',
  },
  link: {
    color: '#8b8a9e', textDecoration: 'none', fontSize: '14px',
  },
  cartBtn: {
    background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
    color: '#fff', border: 'none', padding: '8px 20px',
    borderRadius: '99px', fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', position: 'relative', display: 'flex',
    alignItems: 'center', gap: '6px',
  },
  badge: {
    background: '#22d3ee', color: '#0a0a0f',
    borderRadius: '99px', padding: '1px 7px',
    fontSize: '11px', fontWeight: 800,
  },
}

export default Navbar
