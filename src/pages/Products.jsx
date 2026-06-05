import { useState, useEffect, useRef, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

const PAGE_SIZE = 9

const CATEGORY_IMGS = {
  auricular: 'photo-1505740420928-5e560c06d30e',
  audio:     'photo-1505740420928-5e560c06d30e',
  salud:     'photo-1559757148-5c350d0d3c56',
  fitness:   'photo-1576243345690-4e4b79b05b30',
  wearable:  'photo-1523275335684-37898b6baf30',
  robot:     'photo-1485827404703-89b55fcc595e',
  hogar:     'photo-1558618666-fcd25c85cd64',
  product:   'photo-1496181133206-80ce9b88a853',
}
function getCategoryImg(cat) {
  const key = (cat || '').toLowerCase()
  for (const [k, v] of Object.entries(CATEGORY_IMGS)) {
    if (key.includes(k)) return `https://images.unsplash.com/${v}?w=500&q=85`
  }
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=85'
}

function ProductCard({ prod, onAdd, addedId }) {
  const [hovered, setHovered] = useState(false)
  const imgSrc = prod.image_url || getCategoryImg(prod.category)
  const isAdded = addedId === prod.id

  return (
    <div
      style={{ ...s.card, ...(hovered ? s.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/producto/${prod.id}`} style={s.imgWrap}>
        <img
          src={imgSrc}
          alt={prod.name}
          style={{ ...s.img, transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        />
        {prod.viral && <span style={s.viralBadge}>🔥 Viral</span>}
        <div style={{ ...s.overlay, opacity: hovered ? 1 : 0 }}>
          <span style={s.overlayBtn}>Ver producto →</span>
        </div>
      </Link>

      <div style={s.body}>
        <span style={s.catChip}>{prod.category || 'Gadget'}</span>

        <Link to={`/producto/${prod.id}`} style={{ textDecoration: 'none' }}>
          <p style={s.name}>{prod.name}</p>
        </Link>

        <div style={s.ratingRow}>
          <span style={s.stars}>★★★★★</span>
          <span style={s.ratingCount}>4.8 · 128</span>
        </div>

        <div style={s.priceRow}>
          <span style={s.price}>${prod.price}</span>
          <span style={s.curr}>USD</span>
        </div>

        <span style={s.freeShip}>✓ Envío gratis</span>

        <button
          style={{ ...(isAdded ? s.btnAdded : s.btnAdd) }}
          onClick={e => onAdd(e, prod)}
        >
          {isAdded ? '✓ Agregado al carrito' : '+ Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || null)
  const { addToCart } = useCart()
  const sentinelRef = useRef(null)

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
    setActiveCategory(searchParams.get('cat') || null)
  }, [searchParams])

  useEffect(() => {
    async function fetchData() {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase.from('products').select('*').order('id'),
        supabase.from('categories').select('*').order('id'),
      ])
      setProducts(prods || [])
      setCategories(cats || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    if (searchQuery) {
      const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
      return products.filter(p =>
        terms.some(t =>
          p.name.toLowerCase().includes(t) ||
          (p.category || '').toLowerCase().includes(t) ||
          (p.description || '').toLowerCase().includes(t)
        )
      )
    }
    if (activeCategory) {
      return products.filter(p => p.category === activeCategory)
    }
    return products
  }, [searchQuery, activeCategory, products])

  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [searchQuery, activeCategory])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount(n => n + PAGE_SIZE) },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [filtered])

  function handleAdd(e, prod) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(prod)
    setAddedId(prod.id)
    setTimeout(() => setAddedId(null), 1800)
  }

  function handleSearch(val) {
    setSearchQuery(val)
    setSearchParams(prev => {
      const p = new URLSearchParams(prev)
      if (val) p.set('q', val)
      else p.delete('q')
      return p
    }, { replace: true })
  }

  function handleCategory(slug) {
    if (activeCategory === slug) {
      setActiveCategory(null)
      setSearchParams(prev => {
        const p = new URLSearchParams(prev)
        p.delete('cat')
        return p
      }, { replace: true })
    } else {
      setActiveCategory(slug)
      setSearchParams({ cat: slug }, { replace: true })
    }
  }

  function clearCategory() {
    setActiveCategory(null)
    setSearchParams(prev => {
      const p = new URLSearchParams(prev)
      p.delete('cat')
      return p
    }, { replace: true })
  }

  const activeCategoryName = activeCategory
    ? categories.find(c => c.slug === activeCategory)?.name?.replace(/ IA$/i, '')
    : null

  return (
    <div style={s.wrap}>
      <Helmet>
        <title>Catálogo de Gadgets IA — ConAI</title>
        <meta name="description" content="Explorá nuestro catálogo completo de gadgets con inteligencia artificial. Auriculares, wearables, dispositivos de salud, hogar inteligente y más." />
        <meta property="og:title" content="Catálogo de Gadgets IA — ConAI" />
        <meta property="og:description" content="Explorá auriculares, wearables, dispositivos de salud y más gadgets con IA." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://conai.vercel.app/productos" />
        <link rel="canonical" href="https://conai.vercel.app/productos" />
      </Helmet>

      {/* HEADER */}
      <div style={s.pageHeader}>
        <h1 style={s.pageTitle}>Catálogo IA</h1>
        <p style={s.pageSub}>Los gadgets más avanzados del mercado</p>
      </div>

      {/* BUSCADOR */}
      <div style={s.searchRow}>
        <div style={s.searchBox}>
          <svg style={s.searchIcon} width="16" height="16" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <button style={s.clearSearch} onClick={() => handleSearch('')}>✕</button>
          )}
        </div>
      </div>

      {/* CATEGORÍAS PILLS */}
      <div style={s.pillsRow}>
        <button
          style={!activeCategory ? s.pillActive : s.pill}
          onClick={clearCategory}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            style={activeCategory === cat.slug ? s.pillActive : s.pill}
            onClick={() => handleCategory(cat.slug)}
          >
            {cat.emoji} {cat.name.replace(/ IA$/i, '')}
          </button>
        ))}
      </div>

      {/* RESULTADOS INFO */}
      {!loading && (
        <div style={s.resultsRow}>
          {activeCategoryName && <h2 style={s.catTitle}>{activeCategoryName}</h2>}
          <p style={s.counter}>{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* GRID */}
      {loading ? (
        <div style={s.loadingWrap}>
          <p style={s.counter}>Cargando productos...</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.slice(0, visibleCount).map(prod => (
            <ProductCard key={prod.id} prod={prod} onAdd={handleAdd} addedId={addedId} />
          ))}
        </div>
      )}

      {!loading && visibleCount < filtered.length && (
        <div ref={sentinelRef} style={s.sentinel}>
          <span style={s.sentinelDot} />
          <span style={{ ...s.sentinelDot, animationDelay: '0.2s' }} />
          <span style={{ ...s.sentinelDot, animationDelay: '0.4s' }} />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={s.empty}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>No se encontraron productos</p>
        </div>
      )}
    </div>
  )
}

const s = {
  wrap: { padding: '72px 5% 80px', background: '#f5f6fa', minHeight: '100vh' },

  pageHeader: { marginBottom: '28px', paddingTop: '16px' },
  pageTitle: { fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-1px', margin: '0 0 6px' },
  pageSub: { fontSize: '15px', color: '#6b7280', margin: 0 },

  searchRow: { marginBottom: '16px' },
  searchBox: { position: 'relative', display: 'flex', alignItems: 'center', maxWidth: '480px' },
  searchIcon: { position: 'absolute', left: '14px', pointerEvents: 'none' },
  searchInput: { width: '100%', height: '44px', paddingLeft: '42px', paddingRight: '36px', border: '1.5px solid #e5e7eb', borderRadius: '10px', background: '#fff', fontSize: '14px', color: '#0a0a0f', outline: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  clearSearch: { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#9ca3af', padding: '4px' },

  pillsRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
  pill: { height: '34px', padding: '0 16px', border: '1.5px solid #e5e7eb', borderRadius: '99px', background: '#fff', fontSize: '13px', color: '#374151', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' },
  pillActive: { height: '34px', padding: '0 16px', border: '1.5px solid #1A6FFF', borderRadius: '99px', background: '#1A6FFF', fontSize: '13px', color: '#fff', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' },

  resultsRow: { display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' },
  catTitle: { fontSize: '20px', fontWeight: 700, color: '#0a0a0f', margin: 0, letterSpacing: '-0.5px' },
  counter: { fontSize: '13px', color: '#9ca3af', margin: 0 },
  loadingWrap: { padding: '48px 0', textAlign: 'center' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },

  card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', transition: 'box-shadow 0.25s, transform 0.25s', display: 'flex', flexDirection: 'column' },
  cardHover: { boxShadow: '0 12px 40px rgba(0,0,0,0.13)', transform: 'translateY(-4px)' },

  imgWrap: { display: 'block', position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: '#f3f4f6', textDecoration: 'none', flexShrink: 0 },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' },
  viralBadge: { position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg,#ef4444,#f97316)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', zIndex: 1 },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.48)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.25s' },
  overlayBtn: { background: '#fff', color: '#0a0a0f', fontSize: '13px', fontWeight: 700, padding: '10px 20px', borderRadius: '8px', pointerEvents: 'none' },

  body: { padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 },
  catChip: { fontSize: '10px', fontWeight: 700, color: '#1A6FFF', background: 'rgba(26,111,255,0.08)', padding: '3px 10px', borderRadius: '99px', alignSelf: 'flex-start', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' },
  name: { fontSize: '14px', fontWeight: 700, color: '#0a0a0f', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: '0 0 8px' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' },
  stars: { color: '#f59e0b', fontSize: '12px', letterSpacing: '1px' },
  ratingCount: { fontSize: '11px', color: '#9ca3af' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '4px' },
  price: { fontSize: '22px', fontWeight: 800, color: '#1A6FFF', letterSpacing: '-0.5px' },
  curr: { fontSize: '13px', fontWeight: 500, color: '#9ca3af' },
  freeShip: { fontSize: '11px', fontWeight: 600, color: '#16a34a', marginBottom: '14px' },
  btnAdd: { width: '100%', height: '42px', background: 'linear-gradient(135deg,#0a0a0f,#374151)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', marginTop: 'auto' },
  btnAdded: { width: '100%', height: '42px', background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginTop: 'auto' },

  sentinel: { display: 'flex', justifyContent: 'center', gap: '6px', padding: '32px 0' },
  sentinelDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#d1d5db', animation: 'pulse 1.2s ease-in-out infinite' },
  empty: { textAlign: 'center', padding: '80px 0' },
}

export default Products
