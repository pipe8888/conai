import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import LogoSVG from './LogoSVG'

const ADMIN_EMAIL = 'pipeblue17@gmail.com'

function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logoLink}>
        <LogoSVG />
      </Link>

      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Inicio</Link></li>
        <li><Link to="/productos" style={styles.link}>Productos</Link></li>
        <li><Link to="/contacto" style={styles.link}>Contacto</Link></li>
      </ul>

      <div style={styles.right}>
        {user ? (
          <>
            {user.email === ADMIN_EMAIL && (
              <Link to="/admin" style={styles.adminBtn}>Admin</Link>
            )}
            <span style={styles.userEmail}>{user.email.split('@')[0]}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Salir</button>
          </>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Iniciar sesión</Link>
        )}
        <button onClick={() => navigate('/carrito')} style={styles.cartBtn}>
          🛒 {count > 0 && <span style={styles.badge}>{count}</span>}
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: '#ffffff', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(108,99,255,0.2)',
    padding: '0 5%', height: '64px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logoLink: {
    textDecoration: 'none', display: 'flex', alignItems: 'center',
  },
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
  right: { display: 'flex', alignItems: 'center', gap: '10px' },
  userEmail: { fontSize: '13px', color: '#a78bfa', fontWeight: 600 },
  loginBtn: { fontSize: '13px', color: '#f1f0ff', textDecoration: 'none', padding: '8px 16px', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '99px' },
  logoutBtn: { fontSize: '12px', color: '#8b8a9e', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '99px', padding: '6px 14px', cursor: 'pointer' },
  adminBtn: { fontSize: '12px', color: '#22d3ee', textDecoration: 'none', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '99px', padding: '6px 14px', fontWeight: 600 },
}

export default Navbar
