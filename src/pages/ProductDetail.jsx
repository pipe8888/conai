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

const EXTRA_IMGS = [
  'photo-1546868871-7041f2a55e12',
  'photo-1585386959984-a4155224a1ad',
  'photo-1491553895911-0055eca6402d',
]

const REVIEWS_POOL = [
  { name: 'Martina R.', rating: 5, text: 'Increíble calidad, llegó en 3 días. Lo recomiendo 100%, funciona exactamente como dice.' },
  { name: 'Carlos M.', rating: 5, text: 'Exactamente como en la foto. Funciona perfecto desde el primer día.' },
  { name: 'Sofía L.', rating: 4, text: 'Muy buen producto, el envío fue rápido. Estoy muy feliz con la compra.' },
  { name: 'Diego A.', rating: 5, text: 'Lo compré de regalo y quedaron encantados. Super recomendado.' },
  { name: 'Valentina P.', rating: 4, text: 'Buena relación calidad-precio. El packaging es genial.' },
  { name: 'Andrés T.', rating: 5, text: 'Segunda compra que hago acá. Siempre cumplen con lo prometido.' },
]

const FAQ_ITEMS = [
  { q: '¿Cuánto tarda el envío?', a: 'El envío estándar tarda entre 2 y 5 días hábiles. Enviamos tracking en tiempo real al email que nos dejás.' },
  { q: '¿Tienen garantía?', a: 'Todos nuestros productos tienen 30 días de garantía. Si hay algún problema, lo resolvemos sin preguntas.' },
  { q: '¿Puedo devolver el producto?', a: 'Sí, aceptamos devoluciones dentro de los primeros 30 días. Solo contactanos y coordinamos la logística sin costo.' },
  { q: '¿Cómo es el proceso de pago?', a: 'Aceptamos todas las tarjetas de crédito y débito. El pago es 100% seguro con encriptación SSL de 256 bits.' },
]

function Stars({ rating, size = 14 }) {
  const filled = Math.round(rating)
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: `${size}px`, color: i <= filled ? '#f59e0b' : '#e5e7eb' }}>★</span>
      ))}
    </span>
  )
}

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [prod, setProd] = useState(null)
  const [related, setRelated] = useState([])
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [thumbIdx, setThumbIdx] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const [stickyVisible, setStickyVisible] = useState(false)

  useEffect(() => {
    setThumbIdx(0)
    setQty(1)
    setAdded(false)
    setLoading(true)
  }, [id])

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

  useEffect(() => {
    function onScroll() { setStickyVisible(window.scrollY > 400) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.loadingSplit}>
        <div style={s.loadingImg} />
        <div style={s.loadingInfo}>
          {[100, 60, 40, 80, 50].map((w, i) => (
            <div key={i} style={{ ...s.loadingLine, width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  )

  if (!prod) return (
    <div style={s.notFound}>
      <p style={{ fontSize: '48px' }}>404</p>
      <p style={{ color: '#6b7280', margin: '16px 0' }}>Producto no encontrado</p>
      <Link to="/productos" style={s.btnBack}>← Volver al catálogo</Link>
    </div>
  )

  const mainImgBase = prod.image_url || getCategoryImg(prod.category)
  const thumbImgs = [
    mainImgBase,
    `https://images.unsplash.com/${EXTRA_IMGS[prod.id % 3]}?w=800&q=80`,
    `https://images.unsplash.com/${EXTRA_IMGS[(prod.id + 1) % 3]}?w=800&q=80`,
    `https://images.unsplash.com/${EXTRA_IMGS[(prod.id + 2) % 3]}?w=800&q=80`,
  ]

  const originalPrice = prod.original_price || Math.round(prod.price * (1.28 + (prod.id % 7) * 0.04))
  const discountPct   = Math.round((1 - prod.price / originalPrice) * 100)
  const rating        = prod.rating        || parseFloat((4.1 + (prod.id % 9) * 0.1).toFixed(1))
  const reviewsCount  = prod.reviews_count || ((89 + prod.id * 43) % 420 + 67)
  const stockLeft     = prod.stock         || (3 + prod.id % 7)
  const boughtToday   = (15 + prod.id * 7) % 40 + 10

  const productReviews = [0,1,2,3].map(i => REVIEWS_POOL[(prod.id + i) % REVIEWS_POOL.length])

  const productDesc = prod.description
    ? prod.description.slice(0, 155) + (prod.description.length > 155 ? '…' : '')
    : `Comprá ${prod.name} en ConAI. Gadget con inteligencia artificial.`

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(prod)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    for (let i = 0; i < qty; i++) addToCart(prod)
    navigate('/checkout')
  }

  return (
    <div style={s.wrap}>
      <Helmet>
        <title>{prod.name} — ConAI</title>
        <meta name="description" content={productDesc} />
        <meta property="og:title" content={`${prod.name} — ConAI`} />
        <meta property="og:description" content={productDesc} />
        <meta property="og:image" content={mainImgBase} />
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

        {/* SPLIT */}
        <div style={s.split}>

          {/* ── IMAGEN ── */}
          <div style={s.imgCol}>
            <div style={s.imgBox}>
              <img src={thumbImgs[thumbIdx]} alt={prod.name} style={s.imgPhoto} />
              <span style={s.discountBadge}>-{discountPct}%</span>
              {prod.viral && <span style={s.viralBadge}>🔥 Bestseller</span>}
            </div>
            <div style={s.thumbRow}>
              {thumbImgs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setThumbIdx(i)}
                  style={{ ...s.thumb, ...(thumbIdx === i ? s.thumbActive : {}) }}
                >
                  <img src={img} alt="" style={s.thumbImg} />
                </button>
              ))}
            </div>
          </div>

          {/* ── INFO ── */}
          <div style={s.infoCol}>
            <p style={s.cat}>{(prod.category || '').toUpperCase()}</p>
            <h1 style={s.name}>{prod.name}</h1>

            {/* RATING */}
            <div style={s.ratingRow}>
              <Stars rating={rating} size={15} />
              <span style={s.ratingNum}>{rating}</span>
              <span style={s.ratingCount}>({reviewsCount} reseñas)</span>
            </div>

            {/* SOCIAL PROOF */}
            <div style={s.socialProof}>
              <span style={s.proofFire}>🔥 <strong>{boughtToday}</strong> compraron hoy</span>
              <span style={s.proofDivider}>·</span>
              <span style={s.proofStock}>⚡ Solo quedan <strong>{stockLeft}</strong></span>
            </div>

            {/* PRECIO */}
            <div style={s.priceBlock}>
              <div style={s.priceRow}>
                <span style={s.priceMain}>${prod.price} USD</span>
                <span style={s.priceOriginal}>${originalPrice} USD</span>
              </div>
              <span style={s.priceSavings}>Ahorrás ${originalPrice - prod.price} USD</span>
            </div>

            {prod.description && <p style={s.desc}>{prod.description}</p>}

            {/* TRUST BADGES */}
            <div style={s.trustGrid}>
              {[
                { icon: '🔒', label: 'Pago seguro',   sub: 'SSL 256 bits' },
                { icon: '🚚', label: 'Envío rápido',  sub: '2–5 días hábiles' },
                { icon: '🔄', label: 'Garantía',      sub: '30 días sin preguntas' },
                { icon: '⭐', label: 'Calificación',  sub: `${rating} / 5 estrellas` },
              ].map(b => (
                <div key={b.label} style={s.trustItem}>
                  <span style={s.trustIcon}>{b.icon}</span>
                  <div>
                    <p style={s.trustLabel}>{b.label}</p>
                    <p style={s.trustSub}>{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CANTIDAD */}
            <div style={s.qtyRow}>
              <span style={s.qtyLabel}>CANTIDAD</span>
              <div style={s.qtyControl}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={s.qtyBtn}>−</button>
                <span style={s.qtyNum}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={s.qtyBtn}>+</button>
              </div>
            </div>

            {/* CTAs */}
            <button onClick={handleBuyNow} style={s.btnBuyNow}>
              Comprar ahora
            </button>
            <button onClick={handleAdd} style={added ? s.btnAdded : s.btnOutline}>
              {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </button>

            {prod.margin && (
              <div style={s.marginBox}>
                <div style={s.marginHeader}>
                  <span style={s.marginLabel}>Margen potencial para revendedores</span>
                  <span style={s.marginPct}>{prod.margin}%</span>
                </div>
                <div style={s.marginBar}>
                  <div style={{ ...s.marginFill, width: `${prod.margin}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RESEÑAS */}
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Reseñas de compradores</h2>
            <div style={s.ratingBig}>
              <span style={s.ratingBigNum}>{rating}</span>
              <div>
                <Stars rating={rating} size={20} />
                <p style={s.ratingBigSub}>{reviewsCount} reseñas verificadas</p>
              </div>
            </div>
          </div>
          <div style={s.reviewGrid}>
            {productReviews.map((rev, i) => (
              <div key={i} style={s.reviewCard}>
                <div style={s.reviewTop}>
                  <div style={s.reviewAvatar}>{rev.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <p style={s.reviewName}>{rev.name}</p>
                    <Stars rating={rev.rating} size={12} />
                  </div>
                  <span style={s.reviewDate}>{rev.date}</span>
                </div>
                <p style={s.reviewText}>{rev.text}</p>
                <span style={s.reviewVerified}>✓ Compra verificada</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Preguntas frecuentes</h2>
          <div style={s.faqList}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={s.faqItem}>
                <button
                  style={s.faqQ}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <span style={{ fontSize: '20px', color: '#9ca3af', transition: 'transform 0.2s ease', transform: openFaq === i ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>+</span>
                </button>
                {openFaq === i && <p style={s.faqA}>{item.a}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* RELACIONADOS */}
        {related.length > 0 && (
          <div style={s.section}>
            <div style={s.relHeader}>
              <h2 style={{ ...s.sectionTitle, marginBottom: 0 }}>Otros también compraron</h2>
              <span style={s.relBadge}>Basado en compras recientes</span>
            </div>
            <div style={s.relGrid}>
              {related.map(r => {
                const rOrig     = r.original_price || Math.round(r.price * (1.28 + (r.id % 7) * 0.04))
                const rDiscount = Math.round((1 - r.price / rOrig) * 100)
                const rRating   = r.rating || parseFloat((4.1 + (r.id % 9) * 0.1).toFixed(1))
                return (
                  <Link key={r.id} to={`/producto/${r.id}`} style={s.relCard}>
                    <div style={s.relImgBox}>
                      <img src={r.image_url || getCategoryImg(r.category)} alt={r.name} style={s.relImgPhoto} />
                      <span style={s.relDiscountBadge}>-{rDiscount}%</span>
                    </div>
                    <p style={s.relName}>{r.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '5px' }}>
                      <Stars rating={rRating} size={11} />
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{rRating}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={s.relPrice}>${r.price}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'line-through' }}>${rOrig}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* STICKY BAR */}
      <div style={{ ...s.stickyBar, transform: stickyVisible ? 'translateY(0)' : 'translateY(110%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
            {prod.emoji || '📦'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={s.stickyName}>{prod.name.length > 28 ? prod.name.slice(0, 28) + '…' : prod.name}</p>
            <p style={s.stickyPrice}>${prod.price} USD</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button onClick={handleAdd} style={added ? s.stickyBtnAdded : s.stickyBtnOutline}>
            {added ? '✓ Agregado' : 'Agregar'}
          </button>
          <button onClick={handleBuyNow} style={s.stickyBtn}>Comprar ahora</button>
        </div>
      </div>
    </div>
  )
}

const s = {
  wrap: { background: '#fff', minHeight: '100vh' },
  inner: { maxWidth: '1200px', margin: '0 auto', padding: '32px 5% 100px' },

  // Loading skeleton
  loadingWrap: { maxWidth: '1200px', margin: '0 auto', padding: '40px 5% 80px' },
  loadingSplit: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' },
  loadingImg: { aspectRatio: '1/1', borderRadius: '12px', background: 'linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' },
  loadingInfo: { display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' },
  loadingLine: { height: '14px', borderRadius: '4px', background: 'linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' },

  notFound: { textAlign: 'center', padding: '120px 5%' },
  btnBack: { background: '#0a0a0f', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 },

  breadcrumb: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '32px', flexWrap: 'wrap' },
  breadLink: { fontSize: '13px', color: '#9ca3af', textDecoration: 'none' },
  breadSep: { fontSize: '13px', color: '#d1d5db' },
  breadCurrent: { fontSize: '13px', color: '#0a0a0f', fontWeight: 500 },

  split: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start', marginBottom: '80px' },

  // Imagen
  imgCol: {},
  imgBox: { position: 'relative', aspectRatio: '1 / 1', background: '#f4f5f7', overflow: 'hidden', borderRadius: '16px' },
  imgPhoto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  discountBadge: { position: 'absolute', top: '14px', right: '14px', background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '5px', zIndex: 1 },
  viralBadge: { position: 'absolute', top: '14px', left: '14px', background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '5px', zIndex: 1 },
  thumbRow: { display: 'flex', gap: '8px', marginTop: '12px' },
  thumb: { width: '68px', height: '68px', border: '2px solid transparent', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', padding: 0, background: '#f4f5f7', flexShrink: 0, transition: 'border-color 0.15s' },
  thumbActive: { borderColor: '#1A6FFF' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },

  // Info
  infoCol: { display: 'flex', flexDirection: 'column', gap: '20px' },
  cat: { fontSize: '11px', color: '#9ca3af', fontWeight: 700, letterSpacing: '0.15em', margin: 0 },
  name: { fontSize: 'clamp(22px, 2.4vw, 36px)', fontWeight: 800, letterSpacing: '-0.5px', color: '#0a0a0f', lineHeight: 1.15, margin: 0 },

  ratingRow: { display: 'flex', alignItems: 'center', gap: '7px' },
  ratingNum: { fontSize: '14px', fontWeight: 700, color: '#111827' },
  ratingCount: { fontSize: '13px', color: '#9ca3af' },

  socialProof: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fefce8', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', flexWrap: 'wrap' },
  proofFire: { fontSize: '13px', color: '#92400e' },
  proofDivider: { color: '#d1d5db' },
  proofStock: { fontSize: '13px', color: '#b91c1c' },

  priceBlock: { display: 'flex', flexDirection: 'column', gap: '4px' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '10px' },
  priceMain: { fontSize: '30px', fontWeight: 800, color: '#0a0a0f' },
  priceOriginal: { fontSize: '16px', color: '#9ca3af', textDecoration: 'line-through' },
  priceSavings: { fontSize: '12px', fontWeight: 700, color: '#15803d', background: '#dcfce7', display: 'inline-block', padding: '2px 9px', borderRadius: '99px', alignSelf: 'flex-start' },

  desc: { fontSize: '15px', color: '#6b7280', lineHeight: 1.75, margin: 0 },

  // Trust badges
  trustGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  trustItem: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '11px 13px' },
  trustIcon: { fontSize: '20px', lineHeight: 1, flexShrink: 0 },
  trustLabel: { fontSize: '12px', fontWeight: 600, color: '#111827', margin: '0 0 1px' },
  trustSub: { fontSize: '11px', color: '#9ca3af', margin: 0 },

  // Cantidad
  qtyRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '14px 0' },
  qtyLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#9ca3af' },
  qtyControl: { display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '7px', overflow: 'hidden' },
  qtyBtn: { width: '38px', height: '38px', background: '#f9fafb', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyNum: { width: '44px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#0a0a0f', borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db', height: '38px', lineHeight: '38px' },

  // Botones
  btnBuyNow: { width: '100%', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', color: '#fff', border: 'none', padding: '17px', fontSize: '15px', fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', borderRadius: '9px' },
  btnOutline: { width: '100%', background: 'transparent', color: '#0a0a0f', border: '1px solid #d1d5db', padding: '15px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', borderRadius: '9px' },
  btnAdded: { width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '15px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', borderRadius: '9px' },

  // Margen
  marginBox: { background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px' },
  marginHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  marginLabel: { fontSize: '12px', color: '#9ca3af' },
  marginPct: { fontSize: '12px', fontWeight: 700, color: '#1A6FFF' },
  marginBar: { height: '4px', borderRadius: '99px', background: '#e5e7eb', overflow: 'hidden' },
  marginFill: { height: '100%', borderRadius: '99px', background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)' },

  // Secciones
  section: { borderTop: '1px solid #e5e7eb', paddingTop: '56px', marginBottom: '56px' },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' },
  sectionTitle: { fontSize: '22px', fontWeight: 700, color: '#0a0a0f', letterSpacing: '-0.5px', margin: 0 },

  ratingBig: { display: 'flex', alignItems: 'center', gap: '14px' },
  ratingBigNum: { fontSize: '44px', fontWeight: 800, color: '#0a0a0f', lineHeight: 1 },
  ratingBigSub: { fontSize: '12px', color: '#9ca3af', margin: '5px 0 0' },

  // Reviews
  reviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' },
  reviewCard: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' },
  reviewTop: { display: 'flex', alignItems: 'center', gap: '10px' },
  reviewAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', color: '#fff', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  reviewName: { fontSize: '13px', fontWeight: 600, color: '#111827', margin: '0 0 2px' },
  reviewDate: { fontSize: '11px', color: '#9ca3af', marginLeft: 'auto', whiteSpace: 'nowrap' },
  reviewText: { fontSize: '13px', color: '#374151', lineHeight: 1.6, margin: 0 },
  reviewVerified: { fontSize: '11px', color: '#16a34a', fontWeight: 600 },

  // FAQ
  faqList: { borderTop: '1px solid #e5e7eb' },
  faqItem: { borderBottom: '1px solid #e5e7eb' },
  faqQ: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 600, color: '#0a0a0f', textAlign: 'left', gap: '16px' },
  faqA: { fontSize: '14px', color: '#6b7280', lineHeight: 1.75, padding: '0 0 18px', margin: 0 },

  // Relacionados
  relHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' },
  relBadge: { fontSize: '11px', fontWeight: 600, color: '#6366f1', background: 'rgba(99,102,241,0.08)', padding: '4px 10px', borderRadius: '99px', letterSpacing: '0.04em' },
  relGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
  relCard: { textDecoration: 'none', display: 'block' },
  relImgBox: { position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: '#f4f5f7', borderRadius: '10px', marginBottom: '10px' },
  relImgPhoto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' },
  relDiscountBadge: { position: 'absolute', top: '8px', right: '8px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '3px' },
  relName: { fontSize: '13px', fontWeight: 600, color: '#111827', margin: '0 0 4px', lineHeight: 1.3 },
  relPrice: { fontSize: '14px', fontWeight: 800, color: '#0a0a0f' },

  // Sticky bar
  stickyBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e5e7eb', padding: '12px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', zIndex: 200, transition: 'transform 0.3s ease', boxShadow: '0 -4px 24px rgba(0,0,0,0.09)' },
  stickyName: { fontSize: '13px', fontWeight: 600, color: '#0a0a0f', margin: '0 0 2px', lineHeight: 1.3 },
  stickyPrice: { fontSize: '16px', fontWeight: 800, color: '#1A6FFF', margin: 0 },
  stickyBtn: { background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  stickyBtnOutline: { background: 'transparent', color: '#0a0a0f', border: '1.5px solid #d1d5db', padding: '11px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  stickyBtnAdded: { background: '#16a34a', color: '#fff', border: 'none', padding: '12px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
}

export default ProductDetail
