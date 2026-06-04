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
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
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
    color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
  },
  cartBtn: {
    background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)',
    color: '#fff', border: 'none', padding: '8px 20px',
    borderRadius: '99px', fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', position: 'relative', display: 'flex',
    alignItems: 'center', gap: '6px',
  },
  badge: {
    background: '#ffffff', color: '#1A6FFF',
    borderRadius: '99px', padding: '1px 7px',
    fontSize: '11px', fontWeight: 800,
  },
  right: { display: 'flex', alignItems: 'center', gap: '10px' },
  userEmail: { fontSize: '13px', color: '#1A6FFF', fontWeight: 600 },
  loginBtn: { fontSize: '13px', color: '#0a0a0f', textDecoration: 'none', padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '99px', fontWeight: 500 },
  logoutBtn: { fontSize: '12px', color: '#6b7280', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '99px', padding: '6px 14px', cursor: 'pointer' },
  adminBtn: { fontSize: '12px', color: '#1A6FFF', textDecoration: 'none', border: '1px solid rgba(26,111,255,0.3)', borderRadius: '99px', padding: '6px 14px', fontWeight: 600 },
}

export default Navbar
