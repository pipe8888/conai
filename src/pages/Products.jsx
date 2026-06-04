import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()

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
        setActiveCategory(catParam)
        setFiltered(allProds.filter(p => p.category === catParam))
      } else {
        setFiltered(allProds)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    let result = products
    if (activeCategory !== 'todos') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    setFiltered(result)
  }, [activeCategory, searchQuery, products])

  return (
    <div style={s.wrap}>

      {/* HEADER */}
      <div style={s.header}>
        <p style={s.label}>Catálogo completo</p>
        <h1 style={s.title}>Todos los <span style={s.gradient}>Gadgets IA</span></h1>
        <p style={s.sub}>30 productos innovadores seleccionados para tu tienda.</p>

        {/* BUSCADOR */}
        <input
          style={s.search}
          type="text"
          placeholder="🔍 Buscar producto..."
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* FILTROS */}
      <div style={s.filters}>
        <button
          style={activeCategory === 'todos' ? s.filterActive : s.filter}
          onClick={() => setActiveCategory('todos')}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            style={activeCategory === cat.slug ? s.filterActive : s.filter}
            onClick={() => setActiveCategory(cat.slug)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* CONTADOR */}
      {!loading && <p style={s.counter}>{filtered.length} productos encontrados</p>}

      {/* LOADING */}
      {loading && <p style={s.counter}>Cargando productos...</p>}

      {/* GRID DE PRODUCTOS */}
      <div style={s.grid}>
        {filtered.map(prod => (
          <Link key={prod.id} to={`/producto/${prod.id}`} style={s.card} className="card-hover">
            <div style={s.cardImg}>
              {prod.image_url
                ? <img src={prod.image_url} alt={prod.name} style={s.cardImgPhoto} />
                : <span style={{ fontSize: '56px' }}>{prod.emoji}</span>
              }
            </div>
            <div style={s.cardInfo}>
              <p style={s.cardCat}>{prod.category.toUpperCase()}</p>
              <p style={s.cardName}>{prod.name}</p>
              <p style={s.cardDesc}>{prod.description}</p>
              <div style={s.cardBottom}>
                <span style={s.cardPrice}>${prod.price}</span>
                <span style={s.cardBadge}>{prod.badge}</span>
              </div>
              <div style={s.marginRow}>
                <span style={s.marginLabel}>Margen</span>
                <div style={s.marginBar}>
                  <div style={{ ...s.marginFill, width: `${prod.margin}%` }} />
                </div>
                <span style={s.marginPct}>{prod.margin}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div style={s.empty}>
          <p style={{ fontSize: '48px' }}>🔍</p>
          <p style={{ color: '#9ca3af', marginTop: '12px' }}>No se encontraron productos</p>
        </div>
      )}

    </div>
  )
}

const s = {
  wrap: { padding: '40px 5% 80px', background: '#f8f9fa', minHeight: '100vh' },
  header: { textAlign: 'center', marginBottom: '40px', background: '#ffffff', borderRadius: '20px', padding: '48px 24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  label: { fontSize: '12px', color: '#1A6FFF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' },
  title: { fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px', color: '#0a0a0f' },
  gradient: { background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sub: { fontSize: '16px', color: '#6b7280', marginBottom: '28px' },
  search: { width: '100%', maxWidth: '480px', background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '99px', padding: '12px 24px', color: '#0a0a0f', fontSize: '15px', outline: 'none' },
  filters: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px', justifyContent: 'center' },
  filter: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '99px', padding: '8px 18px', color: '#6b7280', fontSize: '13px', cursor: 'pointer', fontWeight: 500 },
  filterActive: { background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', border: '1px solid transparent', borderRadius: '99px', padding: '8px 18px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' },
  counter: { fontSize: '13px', color: '#9ca3af', marginBottom: '24px', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '20px' },
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  cardImg: { height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', background: '#f8f9fa', overflow: 'hidden' },
  cardImgPhoto: { width: '100%', height: '100%', objectFit: 'cover' },
  cardInfo: { padding: '16px' },
  cardCat: { fontSize: '10px', color: '#1A6FFF', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '5px' },
  cardName: { fontSize: '14px', fontWeight: 700, color: '#0a0a0f', marginBottom: '5px', lineHeight: 1.3 },
  cardDesc: { fontSize: '12px', color: '#6b7280', lineHeight: 1.5, marginBottom: '12px' },
  cardBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' },
  cardPrice: { fontSize: '17px', fontWeight: 800, color: '#e63946' },
  cardBadge: { fontSize: '10px', background: 'rgba(26,111,255,0.1)', color: '#1A6FFF', padding: '3px 10px', borderRadius: '99px', fontWeight: 600 },
  marginRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  marginLabel: { fontSize: '10px', color: '#9ca3af', minWidth: '38px' },
  marginBar: { flex: 1, height: '4px', borderRadius: '99px', background: '#e5e7eb', overflow: 'hidden' },
  marginFill: { height: '100%', borderRadius: '99px', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)' },
  marginPct: { fontSize: '10px', color: '#9ca3af', minWidth: '28px', textAlign: 'right' },
  empty: { textAlign: 'center', padding: '80px 0' },
}

export default Products
