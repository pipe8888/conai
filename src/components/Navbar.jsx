import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import LogoSVG from './LogoSVG'

const ADMIN_EMAIL = 'pipeblue17@gmail.com'

const NAV_LINKS = [
  { path: '/',          label: 'Inicio',    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
  { path: '/productos', label: 'Productos', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/><rect x="2" y="14" width="7" height="7"/></svg> },
  { path: '/contacto',  label: 'Contacto',  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
]

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
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const isActive = (path) => {
    if (path === '/productos') return location.pathname.startsWith('/producto')
    return location.pathname === path
  }

  return (
    <>
      <div style={s.progressBar(progress)} />
      <nav style={{ ...s.nav, transform: visible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.3s ease', zIndex: menuOpen ? 160 : 100 }}>

        <button onClick={() => setMenuOpen(o => !o)} style={s.hamburger} className="hamburger-btn" aria-label="Abrir/cerrar menú">
          <span style={s.bar} />
          <span style={s.bar} />
          <span style={s.bar} />
        </button>

        <Link to="/" style={s.logoLink}><LogoSVG /></Link>

        <ul style={s.links}>
          {NAV_LINKS.map(({ path, label }) => (
            <li key={path} style={s.linkItem}>
              <Link to={path} style={s.link}>{label}</Link>
              {isActive(path) && <span style={s.activeLine} />}
            </li>
          ))}
        </ul>

        <div style={s.right}>
          <button onClick={() => navigate('/productos')} style={s.iconBtn} title="Buscar">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

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

      {menuOpen && (
        <div style={s.overlay} className="overlay-fade-in" onClick={() => setMenuOpen(false)}>
          <div style={s.drawer} className="drawer-slide-in" onClick={e => e.stopPropagation()}>

            {/* header del drawer — mismo alto que el navbar */}
            <div style={s.drawerHeader}>
              <button onClick={() => setMenuOpen(false)} style={s.hamburger} className="hamburger-btn" aria-label="Cerrar menú">
                <span style={s.bar} />
                <span style={s.bar} />
                <span style={s.bar} />
              </button>
            </div>

            {/* links principales */}
            <div style={s.drawerBody}>
              {NAV_LINKS.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className="drawer-item"
                  style={{ ...s.drawerItem, ...(isActive(path) ? s.drawerItemActive : {}) }}
                >
                  <span style={{ ...s.drawerIcon, ...(isActive(path) ? { color: '#fff' } : {}) }}>{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}

              {categories.length > 0 && (
                <>
                  <div style={s.divider} />
                  <p style={s.sectionLabel}>Categorías</p>
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/productos?cat=${encodeURIComponent(cat.name)}`}
                      className="drawer-item"
                      style={s.drawerItem}
                    >
                      <span style={s.drawerIcon}>{cat.emoji || '📦'}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </>
              )}
            </div>

          </div>
        </div>
      )}
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
  hamburger: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center' },
  bar: { display: 'block', width: '22px', height: '1.8px', background: '#cbd5e1', borderRadius: '2px' },
  logoLink: { textDecoration: 'none', display: 'flex', alignItems: 'center' },
  links: { display: 'flex', gap: '32px', listStyle: 'none', margin: 0, padding: 0 },
  linkItem: { height: '64px', display: 'flex', alignItems: 'center', position: 'relative' },
  link: { color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 },
  activeLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #1A6FFF, #66AAFF)', borderRadius: '2px 2px 0 0' },
  right: { display: 'flex', alignItems: 'center', gap: '4px' },
  iconBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cartBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { position: 'absolute', top: '2px', right: '2px', background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', borderRadius: '99px', padding: '1px 5px', fontSize: '10px', fontWeight: 800, minWidth: '16px', textAlign: 'center' },
  adminBtn: { fontSize: '11px', color: '#66AAFF', textDecoration: 'none', border: '1px solid rgba(26,111,255,0.3)', borderRadius: '99px', padding: '4px 10px', fontWeight: 600 },
  userName: { fontSize: '12px', color: '#94a3b8', fontWeight: 500 },
  overlay: { position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.5)' },
  drawer: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '240px', background: '#0f0f0f', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  drawerHeader: { height: '64px', display: 'flex', alignItems: 'center', padding: '0 12px', flexShrink: 0 },
  drawerBody: { display: 'flex', flexDirection: 'column', padding: '8px 0' },
  drawerItem: { display: 'flex', alignItems: 'center', gap: '24px', padding: '0 12px', height: '40px', borderRadius: '10px', margin: '0 8px', fontSize: '14px', fontWeight: 400, color: '#e2e8f0', textDecoration: 'none' },
  drawerItemActive: { background: 'rgba(255,255,255,0.1)', fontWeight: 600, color: '#ffffff' },
  drawerIcon: { width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaaaaa', flexShrink: 0 },
  divider: { borderTop: '1px solid rgba(255,255,255,0.1)', margin: '12px 0' },
  sectionLabel: { fontSize: '14px', fontWeight: 600, color: '#aaaaaa', padding: '8px 20px 4px', margin: 0 },
}

export default Navbar
