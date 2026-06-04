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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [categories, setCategories] = useState([])
  const lastY = useRef(0)
  const searchInputRef = useRef(null)

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
    setSearchOpen(false)
    setSearchVal('')
  }, [location.pathname, location.search])

  function openSearch() {
    setSearchOpen(true)
    setMenuOpen(false)
    setTimeout(() => searchInputRef.current?.focus(), 30)
  }

  function closeSearch() {
    setSearchOpen(false)
    setSearchVal('')
  }

  function submitSearch(e) {
    e.preventDefault()
    const q = searchVal.trim()
    if (q) navigate(`/productos?q=${encodeURIComponent(q)}`)
    else navigate('/productos')
    closeSearch()
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const centerContent = () => {
    if (searchOpen) {
      return (
        <form onSubmit={submitSearch} style={s.searchForm} className="overlay-fade-in">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="5.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={searchInputRef}
            style={s.searchInput}
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Buscar productos..."
            onKeyDown={e => e.key === 'Escape' && closeSearch()}
          />
          <button type="button" onClick={closeSearch} style={s.searchClose} aria-label="Cerrar búsqueda">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </form>
      )
    }
    if (menuOpen) {
      return (
        <div style={s.catRow} className="overlay-fade-in">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/productos?cat=${encodeURIComponent(cat.slug)}`}
              className="cat-link"
              style={s.catLink}
              onClick={() => setMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )
    }
    return <Link to="/" style={s.logoLink}><LogoSVG /></Link>
  }

  return (
    <>
      <div style={s.progressBar(progress)} />
      <nav style={{ ...s.nav, transform: visible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.3s ease' }}>

        <div style={s.left}>
          <button
            onClick={() => { setMenuOpen(o => !o); setSearchOpen(false) }}
            style={s.hamburger}
            className="hamburger-btn"
            aria-label="Ver categorías"
          >
            <span style={s.bar} />
            <span style={s.bar} />
            <span style={s.bar} />
          </button>
          <button
            onClick={searchOpen ? closeSearch : openSearch}
            style={s.iconBtn}
            title="Buscar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div style={s.center}>{centerContent()}</div>

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
    background: 'linear-gradient(90deg, #1A6FFF, #66AAFF)',
    boxShadow: '0 0 8px rgba(26,111,255,0.4)',
    transition: 'width 0.1s linear',
    pointerEvents: 'none',
  }),
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 5%', height: '64px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  left: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 },
  center: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', padding: '0 12px' },
  right: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 },
  logoLink: { textDecoration: 'none', display: 'flex', alignItems: 'center' },
  catRow: { display: 'flex', alignItems: 'center', gap: '0px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' },
  catLink: {
    position: 'relative', display: 'flex', alignItems: 'center',
    padding: '6px 14px', fontSize: '13.5px', fontWeight: 500,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    letterSpacing: '0.01em', color: '#374151', textDecoration: 'none', whiteSpace: 'nowrap',
  },
  searchForm: {
    display: 'flex', alignItems: 'center', gap: '8px',
    width: '100%', maxWidth: '480px',
    border: '1.5px solid #e5e7eb', borderRadius: '8px',
    background: '#f9fafb', padding: '0 12px', height: '38px',
  },
  searchInput: {
    flex: 1, border: 'none', background: 'transparent', outline: 'none',
    fontSize: '14px', color: '#111827', fontFamily: "'Inter', system-ui, sans-serif",
  },
  searchClose: {
    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  hamburger: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center' },
  bar: { display: 'block', width: '22px', height: '1.8px', background: '#374151', borderRadius: '2px' },
  iconBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cartBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { position: 'absolute', top: '2px', right: '2px', background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', borderRadius: '99px', padding: '1px 5px', fontSize: '10px', fontWeight: 800, minWidth: '16px', textAlign: 'center' },
  adminBtn: { fontSize: '11px', color: '#1A6FFF', textDecoration: 'none', border: '1px solid rgba(26,111,255,0.3)', borderRadius: '99px', padding: '4px 10px', fontWeight: 600 },
  userName: { fontSize: '12px', color: '#6b7280', fontWeight: 500 },
}

export default Navbar
