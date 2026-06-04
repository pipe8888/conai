import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [prod, setProd] = useState(null)
  const [related, setRelated] = useState([])
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      setProd(data)
      if (data) {
        const { data: rel } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(3)
        setRelated(rel || [])
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) return <div style={s.loading}>Cargando...</div>

  if (!prod) return (
    <div style={s.notFound}>
      <p style={{ fontSize: '64px' }}>🤖</p>
      <p style={{ color: '#6b7280', margin: '16px 0' }}>Producto no encontrado</p>
      <Link to="/productos" style={s.btnPrimary}>← Volver al catálogo</Link>
    </div>
  )

  const handleAdd = () => {
    addToCart(prod)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={s.wrap}>

      {/* BREADCRUMB */}
      <div style={s.breadcrumb}>
        <Link to="/" style={s.breadLink}>Inicio</Link>
        <span style={s.breadSep}> / </span>
        <Link to="/productos" style={s.breadLink}>Productos</Link>
        <span style={s.breadSep}> / </span>
        <span style={s.breadCurrent}>{prod.name}</span>
      </div>

      {/* DETALLE */}
      <div style={s.detail}>

        {/* IMAGEN */}
        <div style={s.imgBox}>
          {prod.image_url
            ? <img src={prod.image_url} alt={prod.name} style={s.imgPhoto} />
            : <div style={s.imgEmoji}>{prod.emoji}</div>
          }
          {prod.viral && <span style={s.viralBadge}>🔥 Viral</span>}
        </div>

        {/* INFO */}
        <div style={s.info}>
          <p style={s.cat}>{prod.category.toUpperCase()}</p>
          <h1 style={s.name}>{prod.name}</h1>
          <p style={s.desc}>{prod.description}</p>

          {/* PRECIO */}
          <div style={s.priceRow}>
            <span style={s.price}>${prod.price}</span>
            <span style={s.badge}>{prod.badge}</span>
          </div>

          {/* MARGEN */}
          <div style={s.marginBox}>
            <div style={s.marginHeader}>
              <span style={s.marginLabel}>Margen potencial</span>
              <span style={s.marginPct}>{prod.margin}%</span>
            </div>
            <div style={s.marginBar}>
              <div style={{ ...s.marginFill, width: `${prod.margin}%` }} />
            </div>
          </div>

          {/* FEATURES */}
          <div style={s.features}>
            {[
              '✅ Envío en 24-48 horas',
              '✅ Garantía de 30 días',
              '✅ Proveedor verificado',
              '✅ Alto margen de ganancia',
            ].map((f, i) => (
              <p key={i} style={s.feature}>{f}</p>
            ))}
          </div>

          {/* BOTONES */}
          <div style={s.btnRow}>
            <button onClick={handleAdd} style={added ? s.btnAdded : s.btnPrimary}>
              {added ? '✅ Agregado al carrito' : '🛒 Agregar al carrito'}
            </button>
            <Link to="/carrito" style={s.btnOutline}>Ver carrito</Link>
          </div>
        </div>
      </div>

      {/* RELACIONADOS */}
      {related.length > 0 && (
        <div style={s.related}>
          <h2 style={s.relTitle}>Productos <span style={s.gradient}>relacionados</span></h2>
          <div style={s.relGrid}>
            {related.map(r => (
              <Link key={r.id} to={`/producto/${r.id}`} style={s.relCard} className="card-hover">
                <div style={s.relImg}>{r.emoji}</div>
                <div style={s.relInfo}>
                  <p style={s.relName}>{r.name}</p>
                  <p style={s.relPrice}>${r.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

const s = {
  wrap: { padding: '40px 5% 80px', background: '#f8f9fa', minHeight: '100vh' },
  loading: { textAlign: 'center', padding: '120px 5%', color: '#6b7280', fontSize: '16px' },
  notFound: { textAlign: 'center', padding: '120px 5%' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '32px', flexWrap: 'wrap' },
  breadLink: { fontSize: '13px', color: '#6b7280', textDecoration: 'none' },
  breadSep: { fontSize: '13px', color: '#9ca3af' },
  breadCurrent: { fontSize: '13px', color: '#1A6FFF', fontWeight: 500 },
  detail: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '80px', alignItems: 'start' },
  imgBox: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '24px', overflow: 'hidden', textAlign: 'center', position: 'relative', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  imgPhoto: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 },
  imgEmoji: { fontSize: '120px', lineHeight: 1 },
  viralBadge: { position: 'absolute', top: '16px', right: '16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '99px', padding: '4px 12px', fontSize: '12px', fontWeight: 700 },
  info: { display: 'flex', flexDirection: 'column', gap: '20px' },
  cat: { fontSize: '12px', color: '#1A6FFF', fontWeight: 600, letterSpacing: '0.1em' },
  name: { fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800, letterSpacing: '-1px', color: '#0a0a0f', lineHeight: 1.2 },
  desc: { fontSize: '16px', color: '#6b7280', lineHeight: 1.7 },
  priceRow: { display: 'flex', alignItems: 'center', gap: '16px' },
  price: { fontSize: '36px', fontWeight: 800, background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  badge: { background: 'rgba(26,111,255,0.1)', color: '#1A6FFF', padding: '5px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 },
  marginBox: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' },
  marginHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  marginLabel: { fontSize: '13px', color: '#6b7280' },
  marginPct: { fontSize: '13px', fontWeight: 700, color: '#1A6FFF' },
  marginBar: { height: '6px', borderRadius: '99px', background: '#e5e7eb', overflow: 'hidden' },
  marginFill: { height: '100%', borderRadius: '99px', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)' },
  features: { display: 'flex', flexDirection: 'column', gap: '8px' },
  feature: { fontSize: '14px', color: '#374151' },
  btnRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  btnPrimary: { background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
  btnAdded: { background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' },
  btnOutline: { background: 'transparent', color: '#0a0a0f', border: '1px solid #d1d5db', padding: '14px 28px', borderRadius: '99px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
  gradient: { background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  related: { borderTop: '1px solid #e5e7eb', paddingTop: '48px' },
  relTitle: { fontSize: '28px', fontWeight: 800, marginBottom: '24px', color: '#0a0a0f' },
  relGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' },
  relCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  relImg: { fontSize: '40px', minWidth: '56px', textAlign: 'center', background: '#f8f9fa', borderRadius: '12px', padding: '10px' },
  relInfo: { flex: 1 },
  relName: { fontSize: '13px', fontWeight: 600, color: '#0a0a0f', marginBottom: '4px' },
  relPrice: { fontSize: '15px', fontWeight: 800, background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
}

export default ProductDetail
