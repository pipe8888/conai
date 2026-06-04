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
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
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

        <Link to="/" style={s.logoLink}>
          <LogoSVG />
        </Link>

        <ul style={s.links}>
          {[['/', 'Inicio'], ['/productos', 'Productos'], ['/contacto', 'Contacto']].map(([path, label]) => (
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
              {user.email === ADMIN_EMAIL && (
                <Link to="/admin" style={s.adminBtn}>Admin</Link>
              )}
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

      {/* OVERLAY */}
      {menuOpen && (
        <div style={s.overlay} className="overlay-fade-in" onClick={() => setMenuOpen(false)}>
          <div style={s.drawer} className="drawer-slide-in" onClick={e => e.stopPropagation()}>

            <button onClick={() => setMenuOpen(false)} style={s.drawerHamburger} className="hamburger-btn" aria-label="Cerrar menú">
              <span style={s.bar} />
              <span style={s.bar} />
              <span style={s.bar} />
            </button>

            <nav style={s.drawerNav}>
              <div style={s.drawerSection}>
                {[['/', 'Inicio'], ['/productos', 'Productos'], ['/contacto', 'Contacto']].map(([path, label]) => (
                  <Link key={path} to={path} style={s.drawerLink}>{label}</Link>
                ))}
              </div>

              {categories.length > 0 && (
                <>
                  <p style={s.drawerSectionLabel}>CATEGORÍAS</p>
                  <div style={s.drawerSection}>
                    {categories.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/productos?cat=${encodeURIComponent(cat.name)}`}
                        style={s.drawerCatLink}
                      >
                        {cat.emoji && <span style={s.catEmoji}>{cat.emoji}</span>}
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </nav>

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
  overlay: { position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' },
  drawer: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '320px', background: '#06090f', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: '12px 40px 48px', overflowY: 'auto' },
  drawerHamburger: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center', marginBottom: '32px', alignSelf: 'flex-start' },
  drawerNav: { display: 'flex', flexDirection: 'column', gap: '0' },
  drawerSection: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' },
  drawerLink: { fontSize: '22px', fontWeight: 700, color: '#ffffff', textDecoration: 'none', padding: '8px 0', letterSpacing: '-0.5px' },
  drawerSectionLabel: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: '#475569', marginBottom: '12px' },
  drawerCatLink: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 500, color: '#94a3b8', textDecoration: 'none', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  catEmoji: { fontSize: '18px', width: '24px', textAlign: 'center' },
}

export default Navbar
