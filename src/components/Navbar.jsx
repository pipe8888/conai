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
  const [searchVal, setSearchVal] = useState('')
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

  function submitSearch(e) {
    e.preventDefault()
    const q = searchVal.trim()
    navigate(q ? `/productos?q=${encodeURIComponent(q)}` : '/productos')
    setSearchVal('')
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <>
      <div style={s.progressBar(progress)} />
      <div style={{ ...s.trustBar, transform: visible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.3s ease' }}>
        {['🚚 Envío gratis +$50', '↩️ Devolución 30 días', '🔒 Pago 100% seguro', '💬 Soporte 24h'].map(t => (
          <span key={t} style={s.trustBarItem}>{t}</span>
        ))}
      </div>
      <nav style={{ ...s.nav, top: '36px', transform: visible ? 'translateY(0)' : 'translateY(-200%)', transition: 'transform 0.3s ease' }}>

        {/* IZQUIERDA: logo + barra de búsqueda fija */}
        <div style={s.left}>
          <Link to="/" style={s.logoLink}><LogoSVG /></Link>
          <form onSubmit={submitSearch} style={s.searchForm}>
            <input
              style={s.searchInput}
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Buscar..."
            />
            <button type="submit" style={s.lupaBtn} aria-label="Buscar">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </form>
        </div>

        {/* CENTRO: categorías siempre visibles */}
        <div style={s.center}>
          <div style={s.catRow}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/productos?cat=${encodeURIComponent(cat.slug)}`}
                className="cat-link"
                style={s.catLink}
              >
                {cat.name.replace(/ IA$/i, '')}
              </Link>
            ))}
          </div>
        </div>

        {/* DERECHA: usuario + carrito */}
        <div style={s.right}>
          {user ? (
            <>
              {user.email === ADMIN_EMAIL && <Link to="/admin" style={s.adminBtn}>Admin</Link>}
              <span style={s.userName}>{user.email.split('@')[0]}</span>
              <button onClick={handleLogout} style={s.iconBtn} title="Cerrar sesión">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6.5" r="3.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </>
          ) : (
            <Link to="/login" style={{ ...s.iconBtn, textDecoration: 'none' }} title="Iniciar sesión">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6.5" r="3.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
          )}

          <button onClick={() => navigate('/carrito')} style={s.cartBtn} title="Carrito">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 2h2.5l2.1 9.4a1 1 0 0 0 1 .8h7.2a1 1 0 0 0 .97-.76L17 7H5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="16.5" r="1.2" stroke="#6b7280" strokeWidth="1.5"/>
              <circle cx="14" cy="16.5" r="1.2" stroke="#6b7280" strokeWidth="1.5"/>
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
    background: 'linear-gradient(90deg, #818cf8, #6366f1)',
    transition: 'width 0.1s linear',
    pointerEvents: 'none',
  }),
  trustBar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 101,
    background: '#0a0a0f', height: '36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px',
    padding: '0 5%', overflowX: 'auto',
  },
  trustBarItem: {
    fontSize: '11.5px', color: 'rgba(255,255,255,0.85)',
    fontWeight: 500, whiteSpace: 'nowrap', letterSpacing: '0.01em',
  },
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 5%', height: '64px',
    display: 'flex', alignItems: 'center', gap: '16px',
  },
  left: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  center: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  right: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 },
  logoLink: { textDecoration: 'none', display: 'flex', alignItems: 'center' },
  searchForm: {
    display: 'flex', alignItems: 'center', gap: '6px',
    width: '200px',
    background: '#f9fafb',
    border: '1.5px solid #e5e7eb',
    borderRadius: '99px',
    padding: '0 8px 0 14px', height: '36px',
  },
  searchInput: {
    flex: 1, border: 'none', background: 'transparent', outline: 'none',
    fontSize: '13px', color: '#374151',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontWeight: 400, minWidth: 0,
  },
  catRow: { display: 'flex', alignItems: 'center', gap: '0px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' },
  catLink: {
    position: 'relative', display: 'flex', alignItems: 'center',
    padding: '6px 14px', fontSize: '13.5px', fontWeight: 500,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    letterSpacing: '0.01em', color: '#374151', textDecoration: 'none', whiteSpace: 'nowrap',
  },
  lupaBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cartBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { position: 'absolute', top: '2px', right: '2px', background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff', borderRadius: '99px', padding: '1px 5px', fontSize: '10px', fontWeight: 800, minWidth: '16px', textAlign: 'center' },
  adminBtn: { fontSize: '11px', color: '#6366f1', textDecoration: 'none', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '99px', padding: '4px 10px', fontWeight: 600 },
  userName: { fontSize: '12px', color: '#6b7280', fontWeight: 500 },
}

export default Navbar
