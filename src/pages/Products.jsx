import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
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

function ProductCard({ prod, onAdd, addedId }) {
  const imgSrc = prod.image_url || getCategoryImg(prod.category)
  const isAdded = addedId === prod.id
  return (
    <div style={s.card} className="product-card">
      <Link to={`/producto/${prod.id}`} style={s.cardImgWrap}>
        <img src={imgSrc} alt={prod.name} style={s.cardImg} />
        {prod.viral && <span style={s.viralTag}>🔥 Viral</span>}
      </Link>
      <div style={s.cardBody}>
        <Link to={`/producto/${prod.id}`} style={{ textDecoration: 'none' }}>
          <p style={s.cardName}>{prod.name}</p>
        </Link>
        <p style={s.cardPrice}>${prod.price} USD</p>
        <p style={s.cardBy}>Por {prod.category || 'ConAI'}</p>
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
  const [filtered, setFiltered] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart } = useCart()
  const dropdownRef = useRef(null)
  const sentinelRef = useRef(null)

  useEffect(() => {
    async function fetchData() {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase.from('products').select('*').order('id'),
        supabase.from('categories').select('*').order('id'),
      ])
      const allProds = prods || []
      setProducts(allProds)
      setCategories(cats || [])

      const catParam = searchParams.get('cat')
      if (catParam) {
        const match = (cats || []).find(c => c.name === catParam || c.slug === catParam)
        if (match) setActiveCategory(match.slug)
      }

      const qParam = searchParams.get('q')
      if (qParam) setSearchQuery(qParam)

      setFiltered(allProds)
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    let result = products
    if (searchQuery) {
      const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
      result = result.filter(p =>
        terms.some(t =>
          p.name.toLowerCase().includes(t) ||
          (p.category || '').toLowerCase().includes(t) ||
          (p.description || '').toLowerCase().includes(t)
        )
      )
    } else if (activeCategory) {
      result = result.filter(p => p.category === activeCategory)
    }
    setFiltered(result)
    setVisibleCount(PAGE_SIZE)
  }, [searchQuery, activeCategory, products])

  useEffect(() => {
    const params = {}
    if (searchQuery) params.q = searchQuery
    if (activeCategory) params.cat = activeCategory
    setSearchParams(params, { replace: true })
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

  function selectCategory(cat) {
    setActiveCategory(cat.slug)
    setDropdownOpen(false)
  }

  function clearCategory() {
    setActiveCategory(null)
  }

  const activeCategoryName = activeCategory
    ? categories.find(c => c.slug === activeCategory)?.name?.replace(/ IA$/i, '')
    : null

  return (
    <div style={s.wrap}>

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
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button style={s.clearSearch} onClick={() => setSearchQuery('')} aria-label="Limpiar">✕</button>
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

      {/* CONTADOR */}
      {!loading && (
        <p style={s.counter}>{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>
      )}

      {/* GRID */}
      {loading ? (
        <p style={s.counter}>Cargando...</p>
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

  counter: { fontSize: '13px', color: '#6b7280', marginBottom: '16px' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '12px' },

  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardImgWrap: { display: 'block', position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: '#f3f4f6', textDecoration: 'none' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' },
  viralTag: { position: 'absolute', top: '8px', left: '8px', background: 'rgba(239,68,68,0.88)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '3px' },
  cardBody: { padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  cardName: { fontSize: '13px', color: '#374151', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 },
  cardPrice: { fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 },
  cardBy: { fontSize: '12px', color: '#9ca3af', margin: 0 },
  cardActions: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' },
  btnImport: { height: '34px', background: 'transparent', border: '1px solid #374151', borderRadius: '4px', fontSize: '13px', fontWeight: 500, color: '#111827', cursor: 'pointer' },
  btnAddedFull: { height: '34px', background: '#16a34a', border: '1px solid #16a34a', borderRadius: '4px', fontSize: '13px', fontWeight: 500, color: '#fff', cursor: 'pointer' },
  btnView: { height: '34px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '13px', fontWeight: 400, color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' },

  sentinel: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '32px 0 16px' },
  sentinelDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#d1d5db', animation: 'pulse 1.2s ease-in-out infinite' },

  empty: { textAlign: 'center', padding: '80px 0' },

}

export default Products
