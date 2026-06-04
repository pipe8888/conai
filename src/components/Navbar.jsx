import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import LogoSVG from './LogoSVG'

const ADMIN_EMAIL = 'pipeblue17@gmail.com'

function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y < lastY.current || y < 10)
      lastY.current = y
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (y / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.from('categories').select('*').order('id').then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <>
      <div style={s.progressBar(progress)} />
      <nav style={{ ...s.nav, transform: visible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.3s ease' }}>

        {/* IZQUIERDA: hamburger + lupa */}
        <div style={s.left}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={s.hamburger}
            className="hamburger-btn"
            aria-label="Ver categorías"
          >
            <span style={s.bar} />
            <span style={s.bar} />
            <span style={s.bar} />
          </button>
          <button onClick={() => navigate('/productos')} style={s.iconBtn} title="Buscar">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* CENTRO: logo o categorías */}
        <div style={s.center}>
          {menuOpen ? (
            <div style={s.catRow} className="overlay-fade-in">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/productos?cat=${encodeURIComponent(cat.slug)}`}
                  className="cat-link"
                  style={s.catLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <Link to="/" style={s.logoLink}><LogoSVG /></Link>
          )}
        </div>

        {/* DERECHA: usuario + carrito */}
        <div style={s.right}>
          {user ? (
            <>
              {user.email === ADMIN_EMAIL && <Link to="/admin" style={s.adminBtn}>Admin</Link>}
              <span style={s.userName}>{user.email.split('@')[0]}</span>
              <button onClick={handleLogout} style={s.iconBtn} title="Cerrar sesión">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6.5" r="3.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </>
          ) : (
            <Link to="/login" style={{ ...s.iconBtn, textDecoration: 'none' }} title="Iniciar sesión">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6.5" r="3.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
          )}

          <button onClick={() => navigate('/carrito')} style={s.cartBtn} title="Carrito">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 2h2.5l2.1 9.4a1 1 0 0 0 1 .8h7.2a1 1 0 0 0 .97-.76L17 7H5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="16.5" r="1.2" stroke="#94a3b8" strokeWidth="1.5"/>
              <circle cx="14" cy="16.5" r="1.2" stroke="#94a3b8" strokeWidth="1.5"/>
            </svg>
            {count > 0 && <span style={s.badge}>{count}</span>}
          </button>
        </div>

      </nav>
    </>
  )
}

const s = {
  progressBar: (pct) => ({
    position: 'fixed', top: 0, left: 0, zIndex: 200,
    height: '3px', width: `${pct}%`,
    background: 'linear-gradient(90deg, #1A6FFF, #66AAFF)',
    boxShadow: '0 0 8px rgba(26,111,255,0.6)',
    transition: 'width 0.1s linear',
    pointerEvents: 'none',
  }),
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(6,9,15,0.80)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '0 5%', height: '64px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  left: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 },
  center: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', padding: '0 12px' },
  right: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 },
  logoLink: { textDecoration: 'none', display: 'flex', alignItems: 'center' },
  catRow: { display: 'flex', alignItems: 'center', gap: '2px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' },
  catLink: { display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '99px', fontSize: '13px', color: '#cbd5e1', textDecoration: 'none', whiteSpace: 'nowrap', fontWeight: 400 },
  hamburger: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center' },
  bar: { display: 'block', width: '22px', height: '1.8px', background: '#cbd5e1', borderRadius: '2px' },
  iconBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cartBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { position: 'absolute', top: '2px', right: '2px', background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', borderRadius: '99px', padding: '1px 5px', fontSize: '10px', fontWeight: 800, minWidth: '16px', textAlign: 'center' },
  adminBtn: { fontSize: '11px', color: '#66AAFF', textDecoration: 'none', border: '1px solid rgba(26,111,255,0.3)', borderRadius: '99px', padding: '4px 10px', fontWeight: 600 },
  userName: { fontSize: '12px', color: '#94a3b8', fontWeight: 500 },
}

export default Navbar
