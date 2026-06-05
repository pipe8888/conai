import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

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
    if (key.includes(k)) return `https://images.unsplash.com/${v}?w=800&q=85`
  }
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85'
}

function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [prod, setProd] = useState(null)
  const [related, setRelated] = useState([])
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
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
          .limit(4)
        setRelated(rel || [])
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) return <div style={s.loading}>Cargando...</div>

  if (!prod) return (
    <div style={s.notFound}>
      <p style={{ fontSize: '48px' }}>404</p>
      <p style={{ color: '#6b7280', margin: '16px 0' }}>Producto no encontrado</p>
      <Link to="/productos" style={s.btnBack}>← Volver al catálogo</Link>
    </div>
  )

  const handleAdd = () => {
    addToCart(prod)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const imgSrc = prod.image_url || getCategoryImg(prod.category)

  const productDesc = prod.description
    ? prod.description.slice(0, 155) + (prod.description.length > 155 ? '…' : '')
    : `Comprá ${prod.name} en ConAI. Gadget con inteligencia artificial.`

  return (
    <div style={s.wrap}>
      <Helmet>
        <title>{prod.name} — ConAI</title>
        <meta name="description" content={productDesc} />
        <meta property="og:title" content={`${prod.name} — ConAI`} />
        <meta property="og:description" content={productDesc} />
        <meta property="og:image" content={imgSrc} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://conai.vercel.app/producto/${prod.id}`} />
        <link rel="canonical" href={`https://conai.vercel.app/producto/${prod.id}`} />
      </Helmet>
      <div style={s.inner}>

        <Link to="/productos" style={s.backArrow}>← Volver</Link>

        <div style={s.breadcrumb}>
          <Link to="/" style={s.breadLink}>Inicio</Link>
          <span style={s.breadSep}> / </span>
          <Link to="/productos" style={s.breadLink}>Productos</Link>
          <span style={s.breadSep}> / </span>
          <span style={s.breadCurrent}>{prod.name}</span>
        </div>

        <div style={s.split}>

          <div style={s.imgCol}>
            <div style={s.imgBox}>
              <img src={imgSrc} alt={prod.name} style={s.imgPhoto} />
              {prod.viral && <span style={s.viralBadge}>🔥 Viral</span>}
            </div>
          </div>

          <div style={s.infoCol}>
            <p style={s.cat}>{(prod.category || '').toUpperCase()}</p>
            <h1 style={s.name}>{prod.name}</h1>
            <p style={s.price}>${prod.price}</p>

            {prod.description && <p style={s.desc}>{prod.description}</p>}

            <ul style={s.featureList}>
              {['Envío en 24-48 horas', 'Garantía de 30 días', 'Proveedor verificado', 'Alto margen de ganancia'].map(f => (
                <li key={f} style={s.featureItem}>• {f}</li>
              ))}
            </ul>

            <div style={s.qtyRow}>
              <span style={s.qtyLabel}>CANTIDAD</span>
              <div style={s.qtyControl}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={s.qtyBtn}>−</button>
                <span style={s.qtyNum}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={s.qtyBtn}>+</button>
              </div>
            </div>

            <button onClick={handleAdd} style={added ? s.btnAdded : s.btnPrimary}>
              {added ? '✅ AGREGADO AL CARRITO' : 'AGREGAR AL CARRITO'}
            </button>
            <Link to="/carrito" style={s.btnOutline}>Ver carrito →</Link>

            {prod.margin && (
              <div style={s.marginBox}>
                <div style={s.marginHeader}>
                  <span style={s.marginLabel}>Margen potencial</span>
                  <span style={s.marginPct}>{prod.margin}%</span>
                </div>
                <div style={s.marginBar}>
                  <div style={{ ...s.marginFill, width: `${prod.margin}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div style={s.related}>
            <h2 style={s.relTitle}>También te puede interesar</h2>
            <div style={s.relGrid}>
              {related.map(r => (
                <Link key={r.id} to={`/producto/${r.id}`} style={s.relCard} className="card-hover">
                  <div style={s.relImgBox}>
                    <img
                      src={r.image_url || getCategoryImg(r.category)}
                      alt={r.name}
                      style={s.relImgPhoto}
                    />
                    <div className="prod-card-btn">Ver producto →</div>
                  </div>
                  <p style={s.relName}>{r.name}</p>
                  <p style={s.relPrice}>${r.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const s = {
  wrap: { background: '#ffffff', minHeight: '100vh' },
  inner: { maxWidth: '1200px', margin: '0 auto', padding: '32px 5% 80px' },
  loading: { textAlign: 'center', padding: '120px 5%', color: '#6b7280', fontSize: '16px' },
  notFound: { textAlign: 'center', padding: '120px 5%' },
  btnBack: { background: '#0a0a0f', color: '#fff', padding: '12px 24px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 },
  backArrow: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#0a0a0f', textDecoration: 'none', marginBottom: '20px' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '40px', flexWrap: 'wrap' },
  breadLink: { fontSize: '13px', color: '#9ca3af', textDecoration: 'none' },
  breadSep: { fontSize: '13px', color: '#d1d5db' },
  breadCurrent: { fontSize: '13px', color: '#0a0a0f', fontWeight: 500 },
  split: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start', marginBottom: '80px' },
  imgCol: {},
  imgBox: { position: 'relative', aspectRatio: '4/5', background: '#f4f5f7', overflow: 'hidden' },
  imgPhoto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  viralBadge: { position: 'absolute', top: '16px', right: '16px', background: 'rgba(239,68,68,0.9)', color: '#fff', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' },
  infoCol: { display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '8px' },
  cat: { fontSize: '11px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.15em', margin: 0 },
  name: { fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-1px', color: '#0a0a0f', lineHeight: 1.1, margin: 0 },
  price: { fontSize: '26px', fontWeight: 800, color: '#0a0a0f', margin: 0 },
  desc: { fontSize: '15px', color: '#6b7280', lineHeight: 1.75, margin: 0 },
  featureList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, padding: 0 },
  featureItem: { fontSize: '14px', color: '#374151' },
  qtyRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '16px 0' },
  qtyLabel: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: '#9ca3af' },
  qtyControl: { display: 'flex', alignItems: 'center', border: '1px solid #d1d5db' },
  qtyBtn: { width: '40px', height: '40px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyNum: { width: '48px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#0a0a0f', borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db', height: '40px', lineHeight: '40px' },
  btnPrimary: { width: '100%', background: '#0a0a0f', color: '#fff', border: 'none', padding: '17px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', textAlign: 'center' },
  btnAdded: { width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '17px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', textAlign: 'center' },
  btnOutline: { width: '100%', background: 'transparent', color: '#0a0a0f', border: '1px solid #d1d5db', padding: '15px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'block', textAlign: 'center', letterSpacing: '0.04em' },
  marginBox: { background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px' },
  marginHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  marginLabel: { fontSize: '12px', color: '#9ca3af' },
  marginPct: { fontSize: '12px', fontWeight: 700, color: '#1A6FFF' },
  marginBar: { height: '4px', borderRadius: '99px', background: '#e5e7eb', overflow: 'hidden' },
  marginFill: { height: '100%', borderRadius: '99px', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)' },
  related: { borderTop: '1px solid #e5e7eb', paddingTop: '56px' },
  relTitle: { fontSize: '20px', fontWeight: 700, marginBottom: '28px', color: '#0a0a0f', letterSpacing: '-0.5px' },
  relGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  relCard: { textDecoration: 'none', display: 'block' },
  relImgBox: { aspectRatio: '4/5', overflow: 'hidden', background: '#f4f5f7', marginBottom: '12px', position: 'relative' },
  relImgPhoto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  relName: { fontSize: '13px', fontWeight: 600, color: '#0a0a0f', marginBottom: '4px' },
  relPrice: { fontSize: '14px', fontWeight: 800, color: '#0a0a0f' },
}

export default ProductDetail
