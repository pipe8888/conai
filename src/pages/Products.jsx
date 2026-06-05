import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useIsMobile } from '../hooks/useIsMobile'

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
    if (key.includes(k)) return `https://images.unsplash.com/${v}?w=400&q=80`
  }
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'
}

const PRICE_RANGES = [
  { key: 'low',  label: 'Menos de $30',  test: p => p.price < 30 },
  { key: 'mid',  label: '$30 — $70',     test: p => p.price >= 30 && p.price <= 70 },
  { key: 'high', label: 'Más de $70',    test: p => p.price > 70 },
]

const HIGHLIGHT_TAGS = [
  { key: 'bestseller', label: 'Bestseller', test: p => p.viral },
  { key: 'nuevo',      label: 'Nuevo',      test: p => p.id % 7 === 0 },
  { key: 'descuento',  label: 'Con descuento', test: p => {
    const orig = p.original_price || Math.round(p.price * (1.28 + (p.id % 7) * 0.04))
    return Math.round((1 - p.price / orig) * 100) >= 20
  }},
]

function QuickViewModal({ prod, onClose, onAdd, addedId }) {
  const imgSrc = prod.image_url || getCategoryImg(prod.category)
  const originalPrice = prod.original_price || Math.round(prod.price * (1.28 + (prod.id % 7) * 0.04))
  const discountPct   = Math.round((1 - prod.price / originalPrice) * 100)
  const rating        = prod.rating || parseFloat((4.1 + (prod.id % 9) * 0.1).toFixed(1))
  const reviewsCount  = prod.reviews_count || ((89 + prod.id * 43) % 420 + 67)
  const stockLeft     = prod.stock || (3 + prod.id % 7)
  const isAdded = addedId === prod.id

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div onClick={onClose} style={s.qvOverlay} />
      <div style={s.qvModal}>
        <button onClick={onClose} style={s.qvClose}>✕</button>
        <div style={s.qvBody}>
          <div style={s.qvImgWrap}>
            <img src={imgSrc} alt={prod.name} style={s.qvImg} />
            <span style={s.qvDiscount}>-{discountPct}%</span>
          </div>
          <div style={s.qvInfo}>
            <p style={s.qvCat}>{(prod.category || '').toUpperCase()}</p>
            <h2 style={s.qvName}>{prod.name}</h2>
            <div style={s.qvRating}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb', fontSize: '14px' }}>★</span>
              ))}
              <span style={s.qvRatingText}>{rating} ({reviewsCount})</span>
            </div>
            <div style={s.qvPriceRow}>
              <span style={s.qvPrice}>${prod.price} USD</span>
              <span style={s.qvPriceOrig}>${originalPrice}</span>
            </div>
            {prod.description && (
              <p style={s.qvDesc}>{prod.description.slice(0, 120)}…</p>
            )}
            <p style={s.qvStock}>⚡ Solo quedan <strong>{stockLeft}</strong> unidades</p>
            <button
              style={isAdded ? s.qvBtnAdded : s.qvBtn}
              onClick={e => onAdd(e, prod)}
            >
              {isAdded ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </button>
            <Link to={`/producto/${prod.id}`} style={s.qvLink}>Ver página completa →</Link>
          </div>
        </div>
      </div>
    </>
  )
}

function Stars({ rating }) {
  const filled = Math.round(rating)
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: '12px', color: i <= filled ? '#f59e0b' : '#e5e7eb' }}>★</span>
      ))}
    </span>
  )
}

function CheckItem({ checked, label, count, onChange }) {
  return (
    <button onClick={onChange} style={s.checkItem}>
      <span style={{ ...s.checkbox, ...(checked ? s.checkboxOn : {}) }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span style={{ ...s.checkLabel, fontWeight: checked ? 600 : 400, color: checked ? '#111827' : '#374151' }}>
        {label}
      </span>
      {count !== undefined && (
        <span style={s.checkCount}>{count}</span>
      )}
    </button>
  )
}

function SidebarSection({ title, children }) {
  return (
    <div style={s.section}>
      <p style={s.sectionTitle}>{title}</p>
      <div style={s.sectionBody}>{children}</div>
    </div>
  )
}

function ProductCard({ prod, onAdd, addedId, onQuickView }) {
  const [hovered, setHovered] = useState(false)
  const imgSrc = prod.image_url || getCategoryImg(prod.category)
  const isAdded = addedId === prod.id

  const originalPrice = prod.original_price || Math.round(prod.price * (1.28 + (prod.id % 7) * 0.04))
  const discountPct = Math.round((1 - prod.price / originalPrice) * 100)
  const rating = prod.rating || parseFloat((4.1 + (prod.id % 9) * 0.1).toFixed(1))
  const reviewsCount = prod.reviews_count || ((89 + prod.id * 43) % 420 + 67)

  const stockLeft = prod.stock || (3 + prod.id % 7)

  const badgeLeft = prod.viral
    ? { label: '🔥 Bestseller', style: s.badgeBestseller }
    : discountPct >= 30
    ? { label: `🔥 −${discountPct}% HOT`, style: s.badgeHot }
    : prod.id % 7 === 0
    ? { label: '✨ Nuevo', style: s.badgeNew }
    : null

  return (
    <div
      style={{
        ...s.card,
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.11)' : '0 1px 4px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'box-shadow 0.22s ease, transform 0.22s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/producto/${prod.id}`} style={s.cardImgWrap} viewTransition>
        <img
          src={imgSrc}
          alt={prod.name}
          style={{ ...s.cardImg, transform: hovered ? 'scale(1.07)' : 'scale(1)', viewTransitionName: `product-img-${prod.id}` }}
        />
        {badgeLeft && <span style={badgeLeft.style}>{badgeLeft.label}</span>}
        <span style={s.badgeDiscount}>−{discountPct}%</span>
        {stockLeft <= 5 && <span style={s.badgeLowStock}>⚡ Solo {stockLeft}</span>}
        <div style={{ ...s.overlay, opacity: hovered ? 1 : 0 }}>
          <button
            style={s.overlayBtn}
            onClick={e => { e.preventDefault(); e.stopPropagation(); onQuickView(prod) }}
          >
            Vista rápida
          </button>
        </div>
      </Link>

      <div style={s.cardBody}>
        <Link to={`/producto/${prod.id}`} style={{ textDecoration: 'none' }}>
          <p style={s.cardName}>{prod.name}</p>
        </Link>
        <div style={s.ratingRow}>
          <Stars rating={rating} />
          <span style={s.ratingCount}>{rating} ({reviewsCount})</span>
        </div>
        <div style={s.priceRow}>
          <span style={s.priceMain}>${prod.price} USD</span>
          <span style={s.priceOriginal}>${originalPrice}</span>
        </div>
        <div style={s.cardActions}>
          <button
            style={isAdded ? s.btnAddedFull : s.btnImport}
            onClick={(e) => onAdd(e, prod)}
          >
            {isAdded ? '✓ Agregado' : 'Agregar al carrito'}
          </button>
          <Link to={`/producto/${prod.id}`} style={s.btnView}>Ver producto</Link>
        </div>
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
  const [searchParams] = useSearchParams()
  const [selCats, setSelCats] = useState(() => {
    const cat = searchParams.get('cat')
    return cat ? [cat] : []
  })
  const [selPrices, setSelPrices] = useState([])
  const [selTags, setSelTags] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)
  const { addToCart } = useCart()
  const sentinelRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const cat = searchParams.get('cat')
    if (cat) setSelCats([cat])
    else setSelCats([])
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
    return products.filter(p => {
      const catOk   = selCats.length === 0   || selCats.includes(p.category)
      const priceOk = selPrices.length === 0 || PRICE_RANGES.some(r => selPrices.includes(r.key) && r.test(p))
      const tagOk   = selTags.length === 0   || HIGHLIGHT_TAGS.some(t => selTags.includes(t.key) && t.test(p))
      return catOk && priceOk && tagOk
    })
  }, [selCats, selPrices, selTags, products])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [selCats, selPrices, selTags])

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

  function toggle(setter, key) {
    setter(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  function clearAll() {
    setSelCats([])
    setSelPrices([])
    setSelTags([])
  }

  const hasFilters = selCats.length > 0 || selPrices.length > 0 || selTags.length > 0

  function countCat(slug) {
    return products.filter(p => p.category === slug).length
  }

  const sidebarContent = (
    <>
      {hasFilters && (
        <button onClick={() => { clearAll(); setDrawerOpen(false) }} style={s.clearBtn}>
          ✕ Limpiar filtros
        </button>
      )}
      <SidebarSection title="Categorías">
        {categories.map(cat => (
          <CheckItem
            key={cat.id}
            checked={selCats.includes(cat.slug)}
            label={cat.name.replace(/ IA$/i, '')}
            count={countCat(cat.slug)}
            onChange={() => toggle(setSelCats, cat.slug)}
          />
        ))}
      </SidebarSection>
      <div style={s.divider} />
      <SidebarSection title="Precio">
        {PRICE_RANGES.map(r => (
          <CheckItem
            key={r.key}
            checked={selPrices.includes(r.key)}
            label={r.label}
            onChange={() => toggle(setSelPrices, r.key)}
          />
        ))}
      </SidebarSection>
      <div style={s.divider} />
      <SidebarSection title="Destacados">
        {HIGHLIGHT_TAGS.map(t => (
          <CheckItem
            key={t.key}
            checked={selTags.includes(t.key)}
            label={t.label}
            onChange={() => toggle(setSelTags, t.key)}
          />
        ))}
      </SidebarSection>
    </>
  )

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

      {/* QUICK VIEW MODAL */}
      {quickView && (
        <QuickViewModal
          prod={quickView}
          onClose={() => setQuickView(null)}
          onAdd={handleAdd}
          addedId={addedId}
        />
      )}

      {/* DRAWER MÓVIL */}
      {isMobile && drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={s.drawerOverlay}
          />
          <div style={s.drawer} className="drawer-slide-in">
            <div style={s.drawerHeader}>
              <span style={s.drawerTitle}>Filtros</span>
              <button onClick={() => setDrawerOpen(false)} style={s.drawerClose}>✕</button>
            </div>
            {sidebarContent}
            <button
              onClick={() => setDrawerOpen(false)}
              style={s.drawerApply}
            >
              Ver {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </button>
          </div>
        </>
      )}

      {/* BOTÓN FLOTANTE FILTROS EN MÓVIL */}
      {isMobile && (
        <button onClick={() => setDrawerOpen(true)} style={s.fabFilter}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="1" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Filtros{hasFilters ? ` (${selCats.length + selPrices.length + selTags.length})` : ''}
        </button>
      )}

      <div style={{ ...s.layout, flexDirection: isMobile ? 'column' : 'row' }}>
        {/* SIDEBAR — solo en desktop */}
        {!isMobile && <aside style={s.sidebar}>{sidebarContent}</aside>}

        {/* MAIN */}
        <div style={s.main}>
          {!loading && (
            <p style={s.counter}>{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>
          )}

          {loading ? (
            <div style={s.grid}>
              {[...Array(9)].map((_, i) => (
                <div key={i} style={s.skeleton}>
                  <div style={s.skeletonImg} />
                  <div style={s.skeletonBody}>
                    <div style={s.skeletonLine} />
                    <div style={{ ...s.skeletonLine, width: '60%' }} />
                    <div style={{ ...s.skeletonLine, width: '40%', marginTop: '8px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={s.grid}>
              {filtered.slice(0, visibleCount).map(prod => (
                <ProductCard key={prod.id} prod={prod} onAdd={handleAdd} addedId={addedId} onQuickView={setQuickView} />
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
      </div>
    </div>
  )
}

const s = {
  wrap: { padding: '88px 5% 80px', background: '#f9fafb', minHeight: '100vh' },
  layout: { display: 'flex', gap: '28px', alignItems: 'flex-start' },

  sidebar: {
    width: '210px',
    flexShrink: 0,
    position: 'sticky',
    top: '88px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
  },

  clearBtn: {
    width: '100%', marginBottom: '16px',
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: '6px', color: '#ef4444',
    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
    padding: '7px 0', textAlign: 'center',
  },

  section: { paddingBottom: '4px' },
  sectionTitle: {
    fontSize: '10px', fontWeight: 700, color: '#9ca3af',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    marginBottom: '10px',
  },
  sectionBody: { display: 'flex', flexDirection: 'column', gap: '2px' },

  divider: { height: '1px', background: '#f3f4f6', margin: '14px 0' },

  checkItem: {
    display: 'flex', alignItems: 'center', gap: '9px',
    padding: '6px 4px', border: 'none', background: 'transparent',
    cursor: 'pointer', width: '100%', textAlign: 'left',
    borderRadius: '6px',
  },
  checkbox: {
    width: '16px', height: '16px', flexShrink: 0,
    border: '1.5px solid #d1d5db', borderRadius: '4px',
    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: {
    background: '#1A6FFF', borderColor: '#1A6FFF',
  },
  checkLabel: { fontSize: '13px', flex: 1, lineHeight: 1.3 },
  checkCount: {
    fontSize: '11px', color: '#9ca3af',
    background: '#f3f4f6', padding: '1px 6px',
    borderRadius: '99px', flexShrink: 0,
  },

  main: { flex: 1, minWidth: 0 },
  counter: { fontSize: '13px', color: '#6b7280', marginBottom: '14px' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },

  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardImgWrap: { display: 'block', position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: '#f3f4f6', textDecoration: 'none' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s ease' },

  badgeBestseller: { position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', zIndex: 1, letterSpacing: '0.3px' },
  badgeNew: { position: 'absolute', top: '10px', left: '10px', background: '#16a34a', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', zIndex: 1, letterSpacing: '0.3px' },
  badgeHot: { position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #ff4e00, #ff9a00)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', zIndex: 1, letterSpacing: '0.3px' },
  badgeDiscount: { position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', zIndex: 1 },
  badgeLowStock: { position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.72)', color: '#fff', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', zIndex: 1, backdropFilter: 'blur(4px)' },

  overlay: { position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.22s ease', zIndex: 2 },
  overlayBtn: { background: '#fff', color: '#111827', border: 'none', fontSize: '12px', fontWeight: 600, padding: '9px 22px', borderRadius: '99px', letterSpacing: '0.3px', whiteSpace: 'nowrap', cursor: 'pointer' },

  cardBody: { padding: '13px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
  cardName: { fontSize: '13px', color: '#374151', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 },

  ratingRow: { display: 'flex', alignItems: 'center', gap: '5px' },
  ratingCount: { fontSize: '11px', color: '#9ca3af' },

  priceRow: { display: 'flex', alignItems: 'baseline', gap: '7px', marginTop: '2px' },
  priceMain: { fontSize: '15px', fontWeight: 700, color: '#111827' },
  priceOriginal: { fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through' },

  cardActions: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' },
  btnImport: { height: '36px', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer' },
  btnAddedFull: { height: '36px', background: '#16a34a', border: '1px solid #16a34a', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer' },
  btnView: { height: '34px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', fontWeight: 400, color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' },

  skeleton: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' },
  skeletonImg: { width: '100%', aspectRatio: '1 / 1', background: 'linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' },
  skeletonBody: { padding: '13px', display: 'flex', flexDirection: 'column', gap: '8px' },
  skeletonLine: { height: '12px', borderRadius: '4px', background: 'linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' },

  sentinel: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '32px 0 16px' },
  sentinelDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#d1d5db', animation: 'pulse 1.2s ease-in-out infinite' },

  empty: { textAlign: 'center', padding: '80px 0' },

  qvOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 400,
  },
  qvModal: {
    position: 'fixed', top: '50%', left: '50%', zIndex: 401,
    transform: 'translate(-50%, -50%)',
    background: '#fff', borderRadius: '20px',
    width: 'min(780px, 92vw)', maxHeight: '88vh', overflowY: 'auto',
    boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
  },
  qvClose: {
    position: 'absolute', top: '14px', right: '16px',
    background: '#f3f4f6', border: 'none', borderRadius: '99px',
    width: '32px', height: '32px', cursor: 'pointer',
    fontSize: '14px', color: '#6b7280', zIndex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  qvBody: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0',
  },
  qvImgWrap: {
    position: 'relative', aspectRatio: '1/1',
    background: '#f4f5f7', borderRadius: '20px 0 0 20px', overflow: 'hidden',
  },
  qvImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  qvDiscount: {
    position: 'absolute', top: '12px', right: '12px',
    background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 700,
    padding: '3px 8px', borderRadius: '4px',
  },
  qvInfo: {
    padding: '28px 28px 28px 24px',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  qvCat: { fontSize: '10px', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', margin: 0 },
  qvName: { fontSize: '20px', fontWeight: 800, color: '#0a0a0f', lineHeight: 1.2, margin: 0 },
  qvRating: { display: 'flex', alignItems: 'center', gap: '5px' },
  qvRatingText: { fontSize: '12px', color: '#9ca3af' },
  qvPriceRow: { display: 'flex', alignItems: 'baseline', gap: '10px' },
  qvPrice: { fontSize: '24px', fontWeight: 800, color: '#0a0a0f' },
  qvPriceOrig: { fontSize: '14px', color: '#9ca3af', textDecoration: 'line-through' },
  qvDesc: { fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 },
  qvStock: { fontSize: '12px', color: '#b91c1c', background: '#fef2f2', borderRadius: '6px', padding: '6px 10px', margin: 0 },
  qvBtn: {
    width: '100%', background: '#0a0a0f', color: '#fff', border: 'none',
    padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
  },
  qvBtnAdded: {
    width: '100%', background: '#16a34a', color: '#fff', border: 'none',
    padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
  },
  qvLink: {
    textAlign: 'center', fontSize: '13px', color: '#6b7280',
    textDecoration: 'none', display: 'block',
  },

  drawerOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    zIndex: 300,
  },
  drawer: {
    position: 'fixed', top: 0, left: 0, bottom: 0,
    width: '280px', background: '#fff', zIndex: 301,
    padding: '20px 16px', overflowY: 'auto',
    display: 'flex', flexDirection: 'column', gap: '0',
  },
  drawerHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '20px',
  },
  drawerTitle: { fontSize: '16px', fontWeight: 700, color: '#0a0a0f' },
  drawerClose: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    fontSize: '18px', color: '#6b7280', padding: '4px',
  },
  drawerApply: {
    marginTop: '24px', width: '100%',
    background: '#0a0a0f', color: '#fff', border: 'none',
    padding: '14px', borderRadius: '10px',
    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
  },
  fabFilter: {
    position: 'fixed', bottom: '24px', left: '50%',
    transform: 'translateX(-50%)',
    background: '#0a0a0f', color: '#fff',
    border: 'none', borderRadius: '99px',
    padding: '11px 20px', fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', zIndex: 200,
    display: 'flex', alignItems: 'center', gap: '7px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
  },
}

export default Products
