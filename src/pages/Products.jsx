import { useState, useEffect, useRef, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

const PAGE_SIZE = 6

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
          <Link to={`/producto/${prod.id}`} style={s.btnView}>
            Ver producto
          </Link>
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || null)
  const { addToCart } = useCart()
  const dropdownRef = useRef(null)
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

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [searchQuery, activeCategory])

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

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  function selectCategory(cat) {
    setActiveCategory(cat.slug)
    setSearchParams({ cat: cat.slug }, { replace: true })
    setDropdownOpen(false)
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
            <button style={s.clearSearch} onClick={() => handleSearch('')} aria-label="Limpiar">✕</button>
          )}
        </div>
      </div>

      {/* FILTRO CATEGORÍA */}
      <div style={s.filterRow}>
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            style={activeCategory ? s.chipActive : s.chip}
            onClick={() => setDropdownOpen(o => !o)}
          >
            {activeCategoryName || 'Categoría'} ▾
          </button>
          {dropdownOpen && (
            <div style={s.dropdown} className="drawer-slide-in">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  style={{
                    ...s.dropdownItem,
                    ...(activeCategory === cat.slug ? s.dropdownItemActive : {}),
                  }}
                  onClick={() => selectCategory(cat)}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name.replace(/ IA$/i, '')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {activeCategory && (
          <button style={s.clearChip} onClick={clearCategory}>
            ✕ {activeCategoryName}
          </button>
        )}
      </div>

      {/* TÍTULO CATEGORÍA ACTIVA */}
      {activeCategoryName && (
        <div style={s.catHeader}>
          <h2 style={s.catTitle}>{activeCategoryName}</h2>
        </div>
      )}

      {/* CONTADOR */}
      {!loading && (
        <p style={s.counter}>{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>
      )}

      {/* GRID */}
      {loading ? (
        <div style={s.grid}>
          {[...Array(6)].map((_, i) => (
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
  )
}

const s = {
  wrap: { padding: '88px 5% 80px', background: '#f9fafb', minHeight: '100vh' },

  searchRow: { display: 'flex', gap: '10px', marginBottom: '14px' },
  searchBox: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '14px', pointerEvents: 'none' },
  searchInput: { width: '100%', height: '40px', paddingLeft: '40px', paddingRight: '36px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', fontSize: '14px', color: '#0a0a0f', outline: 'none' },
  clearSearch: { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#9ca3af', padding: '4px', lineHeight: 1 },

  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' },
  chip: { height: '32px', padding: '0 14px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#fff', fontSize: '13px', color: '#374151', cursor: 'pointer', fontWeight: 400 },
  chipActive: { height: '32px', padding: '0 14px', border: '1px solid #0a0a0f', borderRadius: '4px', background: '#0a0a0f', fontSize: '13px', color: '#fff', cursor: 'pointer', fontWeight: 500 },
  clearChip: { height: '28px', padding: '0 12px', border: '1px solid #d1d5db', borderRadius: '99px', background: '#f3f4f6', fontSize: '12px', color: '#6b7280', cursor: 'pointer' },

  dropdown: { position: 'absolute', top: '38px', left: 0, zIndex: 300, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: '200px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px' },
  dropdownItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '6px', border: 'none', background: 'transparent', fontSize: '13px', color: '#374151', cursor: 'pointer', textAlign: 'left' },
  dropdownItemActive: { background: '#f3f4f6', fontWeight: 600, color: '#0a0a0f' },

  catHeader: { marginBottom: '8px' },
  catTitle: { fontSize: '22px', fontWeight: 700, color: '#0a0a0f', letterSpacing: '-0.5px' },
  counter: { fontSize: '13px', color: '#6b7280', marginBottom: '16px' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px' },

  // Card
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardImgWrap: { display: 'block', position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: '#f3f4f6', textDecoration: 'none' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s ease' },

  // Badges
  badgeBestseller: { position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', zIndex: 1, letterSpacing: '0.3px' },
  badgeNew: { position: 'absolute', top: '10px', left: '10px', background: '#16a34a', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', zIndex: 1, letterSpacing: '0.3px' },
  badgeDiscount: { position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', zIndex: 1 },

  // Hover overlay
  overlay: { position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.22s ease', zIndex: 2 },
  overlayBtn: { background: '#fff', color: '#111827', fontSize: '12px', fontWeight: 600, padding: '9px 22px', borderRadius: '99px', letterSpacing: '0.3px', whiteSpace: 'nowrap' },

  // Body
  cardBody: { padding: '13px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
  cardName: { fontSize: '13px', color: '#374151', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 },

  // Rating
  ratingRow: { display: 'flex', alignItems: 'center', gap: '5px' },
  ratingCount: { fontSize: '11px', color: '#9ca3af' },

  // Price
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '7px', marginTop: '2px' },
  priceMain: { fontSize: '15px', fontWeight: 700, color: '#111827' },
  priceOriginal: { fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through' },

  // Actions
  cardActions: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' },
  btnImport: { height: '36px', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer' },
  btnAddedFull: { height: '36px', background: '#16a34a', border: '1px solid #16a34a', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer' },
  btnView: { height: '34px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', fontWeight: 400, color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' },

  // Skeleton
  skeleton: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' },
  skeletonImg: { width: '100%', aspectRatio: '1 / 1', background: 'linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' },
  skeletonBody: { padding: '13px', display: 'flex', flexDirection: 'column', gap: '8px' },
  skeletonLine: { height: '12px', borderRadius: '4px', background: 'linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' },

  sentinel: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '32px 0 16px' },
  sentinelDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#d1d5db', animation: 'pulse 1.2s ease-in-out infinite' },

  empty: { textAlign: 'center', padding: '80px 0' },
}

export default Products
