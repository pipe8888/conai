import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
    if (key.includes(k)) return `https://images.unsplash.com/${v}?w=400&q=80`
  }
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'
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

function ProductCard({ prod, onAdd, addedId }) {
  const [hovered, setHovered] = useState(false)
  const imgSrc = prod.image_url || getCategoryImg(prod.category)
  const isAdded = addedId === prod.id

  const originalPrice = prod.original_price || Math.round(prod.price * (1.28 + (prod.id % 7) * 0.04))
  const discountPct = Math.round((1 - prod.price / originalPrice) * 100)
  const rating = prod.rating || parseFloat((4.1 + (prod.id % 9) * 0.1).toFixed(1))
  const reviewsCount = prod.reviews_count || ((89 + prod.id * 43) % 420 + 67)

  const badgeLeft = prod.viral
    ? { label: 'Bestseller', style: s.badgeBestseller }
    : prod.id % 7 === 0
    ? { label: 'Nuevo', style: s.badgeNew }
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
      <Link to={`/producto/${prod.id}`} style={s.cardImgWrap}>
        <img
          src={imgSrc}
          alt={prod.name}
          style={{ ...s.cardImg, transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
        />
        {badgeLeft && <span style={badgeLeft.style}>{badgeLeft.label}</span>}
        <span style={s.badgeDiscount}>-{discountPct}%</span>
        <div style={{ ...s.overlay, opacity: hovered ? 1 : 0 }}>
          <span style={s.overlayBtn}>Ver detalles</span>
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || null)
  const { addToCart } = useCart()
  const sentinelRef = useRef(null)

  useEffect(() => {
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
    if (!activeCategory) return products
    return products.filter(p => p.category === activeCategory)
  }, [activeCategory, products])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [activeCategory])

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

  function countForCat(slug) {
    return products.filter(p => p.category === slug).length
  }

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

      <div style={s.layout}>
        {/* SIDEBAR */}
        <aside style={s.sidebar}>
          <p style={s.sidebarTitle}>Categorías</p>
          <div style={s.catList}>
            <button
              style={activeCategory === null ? s.catItemActive : s.catItem}
              onClick={() => setSearchParams({}, { replace: true })}
            >
              <span style={s.catItemLabel}>Todos los productos</span>
              <span style={activeCategory === null ? s.catCountActive : s.catCount}>{products.length}</span>
            </button>
            {categories.map(cat => {
              const isActive = activeCategory === cat.slug
              const count = countForCat(cat.slug)
              return (
                <button
                  key={cat.id}
                  style={isActive ? s.catItemActive : s.catItem}
                  onClick={() => setSearchParams({ cat: cat.slug }, { replace: true })}
                >
                  <span style={s.catEmoji}>{cat.emoji}</span>
                  <span style={s.catItemLabel}>{cat.name.replace(/ IA$/i, '')}</span>
                  <span style={isActive ? s.catCountActive : s.catCount}>{count}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* MAIN */}
        <div style={s.main}>
          <div style={s.mainHeader}>
            <p style={s.counter}>
              {loading ? '' : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

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
      </div>
    </div>
  )
}

const s = {
  wrap: { padding: '88px 5% 80px', background: '#f9fafb', minHeight: '100vh' },

  layout: { display: 'flex', gap: '28px', alignItems: 'flex-start' },

  sidebar: {
    width: '200px',
    flexShrink: 0,
    position: 'sticky',
    top: '88px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px 12px',
  },
  sidebarTitle: { fontSize: '11px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '10px' },
  catList: { display: 'flex', flexDirection: 'column', gap: '2px' },
  catItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left' },
  catItemActive: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', cursor: 'pointer', width: '100%', textAlign: 'left' },
  catEmoji: { fontSize: '15px', flexShrink: 0 },
  catItemLabel: { fontSize: '13px', fontWeight: 500, color: 'inherit', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  catCount: { fontSize: '11px', color: '#9ca3af', background: '#f3f4f6', padding: '1px 6px', borderRadius: '99px', flexShrink: 0 },
  catCountActive: { fontSize: '11px', color: '#fff', background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: '99px', flexShrink: 0 },

  main: { flex: 1, minWidth: 0 },
  mainHeader: { marginBottom: '14px' },
  counter: { fontSize: '13px', color: '#6b7280' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },

  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardImgWrap: { display: 'block', position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: '#f3f4f6', textDecoration: 'none' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s ease' },

  badgeBestseller: { position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', zIndex: 1, letterSpacing: '0.3px' },
  badgeNew: { position: 'absolute', top: '10px', left: '10px', background: '#16a34a', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', zIndex: 1, letterSpacing: '0.3px' },
  badgeDiscount: { position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', zIndex: 1 },

  overlay: { position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.22s ease', zIndex: 2 },
  overlayBtn: { background: '#fff', color: '#111827', fontSize: '12px', fontWeight: 600, padding: '9px 22px', borderRadius: '99px', letterSpacing: '0.3px', whiteSpace: 'nowrap' },

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
}

export default Products
