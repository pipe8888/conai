import { useParams, Link, useNavigate } from 'react-router-dom'
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

const TABS = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'especificaciones', label: 'Especificaciones' },
  { id: 'envio', label: 'Envío y Devolución' },
]

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [prod, setProd] = useState(null)
  const [related, setRelated] = useState([])
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('descripcion')

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
    for (let i = 0; i < qty; i++) addToCart(prod)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) addToCart(prod)
    navigate('/carrito')
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

        {/* BREADCRUMB */}
        <div style={s.breadcrumb}>
          <Link to="/" style={s.breadLink}>Inicio</Link>
          <span style={s.breadSep}>/</span>
          <Link to="/productos" style={s.breadLink}>Productos</Link>
          <span style={s.breadSep}>/</span>
          <span style={s.breadCurrent}>{prod.name}</span>
        </div>

        {/* MAIN SPLIT */}
        <div style={s.split}>

          {/* IMAGEN */}
          <div style={s.imgCol}>
            <div style={s.imgBox}>
              <img src={imgSrc} alt={prod.name} style={s.imgPhoto} />
              {prod.viral && <span style={s.viralBadge}>🔥 Más vendido</span>}
            </div>
            <div style={s.imgTrust}>
              <div style={s.trustItem}>
                <span style={s.trustIcon}>🔒</span>
                <span style={s.trustText}>Pago 100% seguro</span>
              </div>
              <div style={s.trustItem}>
                <span style={s.trustIcon}>↩</span>
                <span style={s.trustText}>30 días devolución</span>
              </div>
              <div style={s.trustItem}>
                <span style={s.trustIcon}>🚚</span>
                <span style={s.trustText}>Envío gratis</span>
              </div>
            </div>
          </div>

          {/* INFO */}
          <div style={s.infoCol}>

            {/* Categoría + badge */}
            <div style={s.topRow}>
              <span style={s.catChip}>{prod.category || 'Gadget'}</span>
              <span style={s.soldBadge}>+500 vendidos</span>
            </div>

            <h1 style={s.name}>{prod.name}</h1>

            {/* Rating */}
            <div style={s.ratingRow}>
              <span style={s.stars}>★★★★★</span>
              <span style={s.ratingText}>4.8 · 128 reseñas</span>
            </div>

            {/* Precio */}
            <div style={s.priceBlock}>
              <span style={s.price}>${prod.price}</span>
              <span style={s.curr}>USD</span>
              {prod.original_price && (
                <span style={s.priceOld}>${prod.original_price}</span>
              )}
            </div>

            {/* Urgencia de stock */}
            <div style={s.stockRow}>
              <span style={s.stockDot} />
              <span style={s.stockText}>¡Solo quedan 7 unidades disponibles!</span>
            </div>

            {/* Descripción corta */}
            {prod.description && (
              <p style={s.desc}>{prod.description}</p>
            )}

            {/* Features */}
            <div style={s.features}>
              {['Envío en 24-48 horas hábiles', 'Garantía de 30 días', 'Proveedor verificado', 'Soporte post-venta incluido'].map(f => (
                <div key={f} style={s.featureRow}>
                  <span style={s.featureCheck}>✓</span>
                  <span style={s.featureText}>{f}</span>
                </div>
              ))}
            </div>

            {/* Cantidad */}
            <div style={s.qtyRow}>
              <span style={s.qtyLabel}>Cantidad</span>
              <div style={s.qtyControl}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={s.qtyBtn}>−</button>
                <span style={s.qtyNum}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={s.qtyBtn}>+</button>
              </div>
            </div>

            {/* CTAs */}
            <div style={s.ctaStack}>
              <button onClick={handleBuyNow} style={s.btnBuyNow}>
                ⚡ Comprar ahora
              </button>
              <button onClick={handleAdd} style={added ? s.btnAdded : s.btnAddCart}>
                {added ? '✓ Agregado al carrito' : '+ Agregar al carrito'}
              </button>
            </div>

            {/* Métodos de pago */}
            <div style={s.payRow}>
              <span style={s.payLabel}>Aceptamos:</span>
              {['Visa', 'Mastercard', 'Amex'].map(m => (
                <span key={m} style={s.payChip}>{m}</span>
              ))}
            </div>

            {/* Margen (si existe en la BD) */}
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

        {/* TABS */}
        <div style={s.tabsSection}>
          <div style={s.tabsNav}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                style={{ ...s.tabBtn, ...(activeTab === tab.id ? s.tabBtnActive : {}) }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={s.tabContent}>
            {activeTab === 'descripcion' && (
              <p style={s.tabText}>
                {prod.description || 'Producto de alta tecnología con inteligencia artificial integrada. Diseñado para mejorar tu calidad de vida con funcionalidades avanzadas.'}
              </p>
            )}
            {activeTab === 'especificaciones' && (
              <div style={s.specGrid}>
                {[
                  ['Categoría', prod.category || '—'],
                  ['Garantía', '30 días'],
                  ['Origen', 'Internacional'],
                  ['Tiempo de envío', '24-48 horas hábiles'],
                  ['Proveedor', 'Verificado ConAI'],
                  ['Compatibilidad', 'Universal'],
                ].map(([label, val]) => (
                  <div key={label} style={s.specRow}>
                    <span style={s.specLabel}>{label}</span>
                    <span style={s.specVal}>{val}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'envio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={s.tabText}>🚚 <strong>Envío gratis</strong> en todos los pedidos. Estimado: 24-48 horas hábiles desde la confirmación.</p>
                <p style={s.tabText}>↩️ <strong>Devoluciones sin costo</strong> dentro de los 30 días. Contactanos y coordinamos el retiro.</p>
                <p style={s.tabText}>📦 <strong>Seguimiento en tiempo real</strong> — recibirás un enlace de tracking al confirmar el pedido.</p>
              </div>
            )}
          </div>
        </div>

        {/* RELACIONADOS */}
        {related.length > 0 && (
          <div style={s.related}>
            <h2 style={s.relTitle}>También te puede interesar</h2>
            <div style={s.relGrid}>
              {related.map(r => (
                <Link key={r.id} to={`/producto/${r.id}`} style={s.relCard}>
                  <div style={s.relImgBox}>
                    <img
                      src={r.image_url || getCategoryImg(r.category)}
                      alt={r.name}
                      style={s.relImgPhoto}
                    />
                  </div>
                  <p style={s.relName}>{r.name}</p>
                  <p style={s.relPrice}>${r.price} <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 400 }}>USD</span></p>
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
  wrap: { background: '#f9fafb', minHeight: '100vh' },
  inner: { maxWidth: '1200px', margin: '0 auto', padding: '32px 5% 80px' },
  loading: { textAlign: 'center', padding: '120px 5%', color: '#6b7280', fontSize: '16px' },
  notFound: { textAlign: 'center', padding: '120px 5%' },
  btnBack: { background: '#0a0a0f', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 },

  breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' },
  breadLink: { fontSize: '13px', color: '#9ca3af', textDecoration: 'none' },
  breadSep: { fontSize: '13px', color: '#d1d5db' },
  breadCurrent: { fontSize: '13px', color: '#374151', fontWeight: 500 },

  split: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start', marginBottom: '64px' },

  imgCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  imgBox: { position: 'relative', aspectRatio: '1 / 1', background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  imgPhoto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  viralBadge: { position: 'absolute', top: '14px', left: '14px', background: 'linear-gradient(135deg,#ef4444,#f97316)', color: '#fff', borderRadius: '8px', padding: '5px 12px', fontSize: '11px', fontWeight: 700 },
  imgTrust: { display: 'flex', justifyContent: 'space-between', background: '#fff', borderRadius: '12px', padding: '14px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' },
  trustItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  trustIcon: { fontSize: '18px' },
  trustText: { fontSize: '10px', color: '#6b7280', fontWeight: 600, textAlign: 'center' },

  infoCol: { display: 'flex', flexDirection: 'column', gap: '18px' },
  topRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  catChip: { fontSize: '11px', fontWeight: 700, color: '#1A6FFF', background: 'rgba(26,111,255,0.08)', padding: '4px 12px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.06em' },
  soldBadge: { fontSize: '11px', fontWeight: 600, color: '#16a34a', background: 'rgba(22,163,74,0.08)', padding: '4px 12px', borderRadius: '99px' },

  name: { fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.5px', color: '#0a0a0f', lineHeight: 1.15, margin: 0 },

  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  stars: { color: '#f59e0b', fontSize: '16px', letterSpacing: '2px' },
  ratingText: { fontSize: '13px', color: '#6b7280' },

  priceBlock: { display: 'flex', alignItems: 'baseline', gap: '8px' },
  price: { fontSize: '36px', fontWeight: 800, color: '#1A6FFF', letterSpacing: '-1px' },
  curr: { fontSize: '16px', fontWeight: 600, color: '#9ca3af' },
  priceOld: { fontSize: '18px', color: '#9ca3af', textDecoration: 'line-through', fontWeight: 400 },

  stockRow: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', padding: '10px 14px' },
  stockDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0, boxShadow: '0 0 6px rgba(239,68,68,0.6)' },
  stockText: { fontSize: '13px', fontWeight: 600, color: '#b91c1c' },

  desc: { fontSize: '15px', color: '#6b7280', lineHeight: 1.7, margin: 0 },

  features: { display: 'flex', flexDirection: 'column', gap: '10px' },
  featureRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  featureCheck: { width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureText: { fontSize: '14px', color: '#374151', fontWeight: 500 },

  qtyRow: { display: 'flex', alignItems: 'center', gap: '16px' },
  qtyLabel: { fontSize: '13px', fontWeight: 600, color: '#374151' },
  qtyControl: { display: 'flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' },
  qtyBtn: { width: '42px', height: '42px', background: '#f9fafb', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  qtyNum: { width: '48px', textAlign: 'center', fontSize: '15px', fontWeight: 700, color: '#0a0a0f', borderLeft: '1.5px solid #e5e7eb', borderRight: '1.5px solid #e5e7eb', height: '42px', lineHeight: '42px' },

  ctaStack: { display: 'flex', flexDirection: 'column', gap: '10px' },
  btnBuyNow: { width: '100%', height: '52px', background: 'linear-gradient(135deg,#1A6FFF,#4F94FF)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.02em' },
  btnAddCart: { width: '100%', height: '52px', background: '#0a0a0f', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' },
  btnAdded: { width: '100%', height: '52px', background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' },

  payRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  payLabel: { fontSize: '12px', color: '#9ca3af', fontWeight: 500 },
  payChip: { fontSize: '11px', fontWeight: 700, color: '#374151', background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '4px 12px', borderRadius: '6px' },

  marginBox: { background: '#f8faff', border: '1px solid rgba(26,111,255,0.15)', borderRadius: '10px', padding: '14px' },
  marginHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  marginLabel: { fontSize: '12px', color: '#6b7280' },
  marginPct: { fontSize: '13px', fontWeight: 700, color: '#1A6FFF' },
  marginBar: { height: '4px', borderRadius: '99px', background: '#e5e7eb', overflow: 'hidden' },
  marginFill: { height: '100%', borderRadius: '99px', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)' },

  tabsSection: { marginBottom: '64px' },
  tabsNav: { display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '28px', gap: '0' },
  tabBtn: { padding: '14px 24px', background: 'none', border: 'none', borderBottom: '2px solid transparent', fontSize: '14px', fontWeight: 600, color: '#9ca3af', cursor: 'pointer', transition: 'all 0.15s' },
  tabBtnActive: { color: '#0a0a0f', borderBottomColor: '#1A6FFF' },
  tabContent: {},
  tabText: { fontSize: '15px', color: '#6b7280', lineHeight: 1.75, margin: '0 0 8px' },
  specGrid: { display: 'flex', flexDirection: 'column', gap: '0' },
  specRow: { display: 'flex', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
  specLabel: { width: '200px', fontSize: '13px', color: '#9ca3af', fontWeight: 600, flexShrink: 0 },
  specVal: { fontSize: '13px', color: '#374151', fontWeight: 500 },

  related: { borderTop: '1px solid #e5e7eb', paddingTop: '48px' },
  relTitle: { fontSize: '22px', fontWeight: 700, marginBottom: '28px', color: '#0a0a0f', letterSpacing: '-0.5px' },
  relGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  relCard: { textDecoration: 'none', display: 'block', background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  relImgBox: { aspectRatio: '1 / 1', overflow: 'hidden', background: '#f4f5f7' },
  relImgPhoto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  relName: { fontSize: '13px', fontWeight: 600, color: '#0a0a0f', margin: '12px 14px 4px', lineHeight: 1.4 },
  relPrice: { fontSize: '16px', fontWeight: 800, color: '#1A6FFF', margin: '0 14px 14px' },
}

export default ProductDetail
