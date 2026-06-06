import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

const CATEGORY_IMGS = {
  auricular: 'photo-1505740420928-5e560c06d30e',
  audio:     'photo-1505740420928-5e560c06d30e',
  salud:     'photo-1559757148-5c350d0d3c56',
  fitness:   'photo-1576243345690-4e4b79b05b30',
  wearable:  'photo-1523275335684-37898b6baf30',
  robot:     'photo-1485827404703-89b55fcc595e',
  hogar:     'photo-1558618666-fcd25c85cd64',
}
function getCategoryImg(cat) {
  const key = (cat || '').toLowerCase()
  for (const [k, v] of Object.entries(CATEGORY_IMGS)) {
    if (key.includes(k)) return `https://images.unsplash.com/${v}?w=600&q=85`
  }
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85'
}

function useReveal() {
  const [visible, setVisible] = useState(false)
  const obsRef = useRef(null)
  const ref = useCallback(node => {
    if (obsRef.current) { obsRef.current.disconnect(); obsRef.current = null }
    if (!node) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    obs.observe(node)
    obsRef.current = obs
  }, [])
  return [ref, visible]
}

const TICKER_ITEMS = [
  '🚚 Envío gratis +$50', '⭐ 12.847 clientes', '🔥 NUEVO: SmartWatch Pro IA',
  '↩️ 30 días sin preguntas', '🔒 Pago 100% seguro', '🚀 Código CONAI10 → -10%',
  '🚚 Envío gratis +$50', '⭐ 12.847 clientes', '🔥 NUEVO: SmartWatch Pro IA',
  '↩️ 30 días sin preguntas', '🔒 Pago 100% seguro', '🚀 Código CONAI10 → -10%',
]

const REVIEWS = [
  { init: 'MS', name: 'María S.',   city: 'Santiago, Chile',       text: 'Llegó en 2 días y la calidad es impresionante. Los auriculares con IA se adaptan solos al ruido del metro. Nunca volví a escuchar música de otra manera.' },
  { init: 'CR', name: 'Carlos R.',  city: 'Bogotá, Colombia',      text: 'El SmartWatch detectó una irregularidad en mi sueño que no sabía que tenía. Fui al médico y confirmaron. Un gadget que me ayudó a cuidar mi salud.' },
  { init: 'DM', name: 'Diego M.',   city: 'Lima, Perú',            text: 'Mi tercer pedido. Siempre rápido, siempre de calidad. 100% recomendado.' },
  { init: 'AL', name: 'Ana L.',     city: 'Ciudad de México',      text: 'La IA aprende. Después de una semana ya sabía exactamente cómo me gusta el sonido. Sin tocar nada. Solo usas el gadget.' },
  { init: 'JP', name: 'Juana P.',   city: 'Guadalajara, México',   text: 'Compré para mi papá y está encantado. El proceso de compra fue muy fácil y el envío llegó antes de lo prometido.' },
  { init: 'RV', name: 'Rodrigo V.', city: 'Montevideo, Uruguay',   text: 'Pagué, llegó el tracking al instante y en 3 días estaba en mi puerta. 10/10 recomendado.' },
]

const FAQS = [
  { q: '¿Cuánto tarda en llegar mi pedido?',        a: 'Despachamos en 24 horas hábiles. Chile 2-3 días, México y Colombia 3-5 días, resto de Latinoamérica 5-7 días. Recibirás un número de seguimiento por email al momento del despacho.' },
  { q: '¿Puedo devolver un producto?',              a: 'Sí. Tienes 30 días desde la recepción para devolver cualquier producto sin dar explicaciones. El reembolso se procesa en 3-5 días hábiles al mismo medio de pago que usaste.' },
  { q: '¿Los productos tienen garantía?',           a: 'Todos nuestros gadgets incluyen garantía de 12 meses por defectos de fabricación. Si el producto falla por uso normal, lo reemplazamos sin costo adicional.' },
  { q: '¿Qué métodos de pago aceptan?',             a: 'Aceptamos tarjetas Visa, Mastercard, Amex, PayPal, transferencia bancaria y pagos en efectivo según el país. Todos los pagos son procesados con encriptación SSL de 256 bits.' },
  { q: '¿Cómo sé si el producto me va a funcionar?', a: 'Usa nuestro quiz de recomendación IA — en 3 preguntas te decimos exactamente qué gadget se adapta mejor a tu estilo de vida. Y si compras y no te convence, devuelves sin costo.' },
]

const BADGE_LABELS  = ['🔥 HOT', '⭐ Bestseller', '✨ Nuevo', '🔥 HOT', '⭐ Bestseller', '✨ Nuevo']
const BADGE_COLORS  = ['#ef4444', '#f59e0b', '#8b5cf6', '#ef4444', '#f59e0b', '#8b5cf6']

const COMPARE = [
  { name: 'Auriculares IA Pro X1', img: 'photo-1505740420928-5e560c06d30e', price: '$49', orig: '$89',  to: '/productos?cat=auriculares', popular: false, ia: true,  ruido: true,  salud: false, bat: true,  water: false, app: true },
  { name: 'SmartWatch Pro IA',     img: 'photo-1523275335684-37898b6baf30', price: '$89', orig: '$129', to: '/productos?cat=wearables',   popular: true,  ia: true,  ruido: false, salud: true,  bat: true,  water: true,  app: true },
  { name: 'Monitor Salud IA',      img: 'photo-1559757148-5c350d0d3c56',   price: '$65', orig: '$99',  to: '/productos?cat=salud',        popular: false, ia: true,  ruido: false, salud: true,  bat: false, water: true,  app: true },
]
const COMPARE_ROWS = [
  { label: 'Inteligencia artificial', key: 'ia' },
  { label: 'Cancelación de ruido',    key: 'ruido' },
  { label: 'Monitoreo de salud',      key: 'salud' },
  { label: 'Batería 30+ horas',       key: 'bat' },
  { label: 'Resistente al agua',      key: 'water' },
  { label: 'App móvil',               key: 'app' },
]

export default function Home() {
  const [featured,  setFeatured]  = useState([])
  const [deals,     setDeals]     = useState([])
  const [time,      setTime]      = useState(2 * 3600 + 34 * 60 + 18)
  const [hovProd,   setHovProd]   = useState(null)
  const [hovCat,    setHovCat]    = useState(null)
  const [hovBundle, setHovBundle] = useState(null)
  const [quizStep,  setQuizStep]  = useState(1)
  const [openFaq,   setOpenFaq]   = useState(null)
  const [nlEmail,   setNlEmail]   = useState('')

  const [statsRef,   statsVisible]   = useReveal()
  const [bentoRef,   bentoVisible]   = useReveal()
  const [prodsRef,   prodsVisible]   = useReveal()
  const [reviewsRef, reviewsVisible] = useReveal()

  useEffect(() => {
    supabase.from('products').select('*').eq('viral', true).limit(12).then(({ data }) => {
      const all = data || []
      setFeatured(all.slice(0, 6))
      setDeals(all.slice(0, 4))
    })
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTime(p => p > 0 ? p - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = String(Math.floor(time / 3600)).padStart(2, '0')
  const mm = String(Math.floor((time % 3600) / 60)).padStart(2, '0')
  const ss = String(time % 60).padStart(2, '0')
  const star = featured[0]

  return (
    <div style={{ overflowX: 'hidden' }}>
      <Helmet>
        <title>ConAI — Gadgets con Inteligencia Artificial</title>
        <style>{`@keyframes tickerSlide{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </Helmet>

      {/* ── TICKER ── */}
      <div style={s.tickerWrap}>
        <div style={s.tickerTrack}>
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} style={s.tickerItem}>
              {item}<span style={s.tickerDot}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.heroGrid} />
        <div style={s.heroInner}>
          <div>
            <div style={s.heroLabel}><span style={s.heroDot} />Producto #1 esta semana</div>
            <h1 style={s.heroH1}>
              Auriculares<br />
              <em style={s.heroEm}>IA</em><br />
              que te<br />
              entienden
            </h1>
            <p style={s.heroSub}>Tecnología adaptativa que aprende tu entorno. 30h de batería. Cancelación activa de ruido de siguiente generación.</p>

            <div style={s.heroCountdown}>
              <div style={s.cdLabel}>⚡ Oferta termina en</div>
              <div style={s.cdBlocks}>
                <div style={s.cdBlock}><span style={s.cdNum}>{hh}</span><span style={s.cdUnit}>hrs</span></div>
                <span style={s.cdSep}>:</span>
                <div style={s.cdBlock}><span style={s.cdNum}>{mm}</span><span style={s.cdUnit}>min</span></div>
                <span style={s.cdSep}>:</span>
                <div style={s.cdBlock}><span style={s.cdNum}>{ss}</span><span style={s.cdUnit}>seg</span></div>
              </div>
            </div>

            <div style={s.heroStock}>
              <div style={s.stockTop}>
                <span style={s.stockLbl}>🔴 Stock crítico</span>
                <span style={s.stockNum}>Solo 23 disponibles</span>
              </div>
              <div style={s.stockBar}><div style={s.stockFill} /></div>
            </div>

            <div style={s.heroPriceRow}>
              <span style={s.priceOld}>$89</span>
              <span style={s.priceNew}>$49</span>
              <span style={s.priceDisc}>-45%</span>
            </div>

            <div style={s.heroBtns}>
              <Link to="/productos?cat=auriculares" style={s.btnBlue}>Comprar ahora →</Link>
              <Link to="/productos" style={s.btnGhost}>Ver catálogo</Link>
            </div>

            <div style={s.heroTrust}>
              {['🚚 Envío gratis', '↩️ 30 días', '🔒 Pago seguro'].map((t, i) => (
                <span key={i} style={s.heroTrustItem}>
                  {t}{i < 2 && <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 8px' }}>·</span>}
                </span>
              ))}
            </div>

            <div style={s.heroPayIcons}>
              {['VISA', 'MASTERCARD', 'PAYPAL', 'AMEX', 'SSL ✓'].map(p => (
                <span key={p} style={s.payIcon}>{p}</span>
              ))}
            </div>
          </div>

          <div style={s.heroRight}>
            <div style={{ position: 'relative' }}>
              <img style={s.heroImg} src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=85" alt="Auriculares IA" />
              <div style={s.heroFloatA}>
                <div style={s.floatDot} />
                <span style={s.floatText}>47 personas viendo ahora</span>
              </div>
              <div style={s.heroFloatB}>
                <div style={{ fontSize: '12px', marginBottom: '5px' }}>⭐⭐⭐⭐⭐</div>
                <p style={s.fbText}>"El mejor gadget que compré en años."</p>
                <span style={s.fbName}>— María S., Santiago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div ref={statsRef} style={s.statsBand}>
        <div style={s.statsInner}>
          {[
            { num: '12', unit: 'K+', label: 'Clientes satisfechos' },
            { num: '4.9', unit: '★', label: 'Rating promedio' },
            { num: '98', unit: '%',  label: 'Recomendarían' },
            { num: '24', unit: 'h',  label: 'Envío garantizado' },
          ].map(({ num, unit, label }, i) => (
            <div key={i} style={{
              ...s.statItem,
              borderRight: i < 3 ? '1px solid #f0f0f0' : 'none',
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`,
            }}>
              <span style={s.statNum}><span style={s.statGrad}>{num}</span>{unit}</span>
              <span style={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CÓMO FUNCIONA ── */}
      <section style={{ ...s.sec, borderTop: '1px solid #f0f0f0' }}>
        <div style={s.secInner}>
          <p style={{ ...s.secLabel, textAlign: 'center' }}>Simple y rápido</p>
          <h2 style={{ ...s.secH2, textAlign: 'center', marginBottom: '56px' }}>¿Cómo <em style={s.secEm}>funciona</em>?</h2>
          <div style={s.howGrid}>
            {[
              { num: '01', icon: '🔍', title: 'Elige tu gadget',     desc: 'Usa el quiz IA o explora por categoría. En segundos encuentras el producto perfecto para tu estilo de vida.' },
              { num: '02', icon: '🛒', title: 'Compra seguro',        desc: 'Paga con tarjeta, PayPal o transferencia. Encriptación SSL 256-bit y tu dinero protegido en todo momento.' },
              { num: '03', icon: '🚀', title: 'Recíbelo en casa',     desc: 'Despachamos en 24h con número de seguimiento. Llega en 2-5 días a cualquier país de Latinoamérica.' },
            ].map(({ num, icon, title, desc }, i) => (
              <div key={num} style={{ ...s.howCard, borderRight: i < 2 ? '1px dashed #e5e7eb' : 'none' }}>
                <div style={s.howNum}>{num}</div>
                <div style={s.howIcon}>{icon}</div>
                <div style={s.howTitle}>{title}</div>
                <p style={s.howDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES PILLS ── */}
      <section style={s.sec}>
        <div style={s.secInner}>
          <p style={s.secLabel}>Explorar por categoría</p>
          <h2 style={s.secH2}>Todo el universo<br /><em style={s.secEm}>IA</em> en un lugar</h2>
          <div style={s.catPills}>
            {[
              { to: '/productos?cat=auriculares', icon: '🎧', name: 'Audio IA',  count: '24 productos', color: '#1A6FFF', bg: 'rgba(26,111,255,0.1)' },
              { to: '/productos?cat=wearables',   icon: '⌚', name: 'Wearables', count: '18 productos', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
              { to: '/productos?cat=salud',        icon: '🧠', name: 'Salud IA',  count: '12 productos', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
              { to: '/productos?cat=robot',        icon: '🤖', name: 'Robots IA', count: '9 productos',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
              { to: '/productos?cat=hogar',        icon: '🏠', name: 'Hogar IA',  count: '15 productos', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
            ].map(({ to, icon, name, count, color, bg }) => (
              <Link
                key={name}
                to={to}
                onMouseEnter={() => setHovCat(name)}
                onMouseLeave={() => setHovCat(null)}
                style={{
                  ...s.catPill,
                  borderColor: hovCat === name ? '#1A6FFF' : '#e5e7eb',
                  boxShadow: hovCat === name ? '0 8px 24px rgba(26,111,255,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ ...s.catPillIcon, background: bg, color }}>{icon}</div>
                <div>
                  <div style={s.catPillName}>{name}</div>
                  <div style={s.catPillCount}>{count}</div>
                </div>
                <span style={{ ...s.catPillArrow, color: hovCat === name ? '#1A6FFF' : '#d1d5db' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID ── */}
      {star && (
        <section style={s.secGray}>
          <div style={s.secInner}>
            <p style={s.secLabel}>Más vendidos</p>
            <h2 style={s.secH2}>Lo que todos<br />están <em style={s.secEm}>comprando</em></h2>
            <div ref={bentoRef} style={s.bentoGrid}>
              <Link to={`/producto/${star.id}`} className="card-hover" style={{
                ...s.bentoMain,
                opacity: bentoVisible ? 1 : 0,
                transform: bentoVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}>
                <img style={s.bentoMainImg} src={star.image_url || getCategoryImg(star.category)} alt={star.name} />
                <div style={s.bentoMainInfo}>
                  <p style={s.bentoCat}>{(star.category || '').toUpperCase()}</p>
                  <h3 style={s.bentoName}>{star.name}</h3>
                  <p style={s.bentoDesc}>{star.description}</p>
                  <div style={s.bentoPriceRow}>
                    <span style={s.bentoOrig}>${Math.round(star.price * 1.43)}</span>
                    <span style={s.bentoPrice}>${star.price}</span>
                  </div>
                  <span style={s.bentoBtn}>Ver producto →</span>
                </div>
              </Link>

              <div style={{
                ...s.bentoStat,
                opacity: bentoVisible ? 1 : 0,
                transform: bentoVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
              }}>
                <div style={s.bentoStatNum}>2.8K</div>
                <div style={s.bentoStatLabel}>unidades vendidas este mes</div>
              </div>

              <div style={{
                ...s.bentoRev,
                opacity: bentoVisible ? 1 : 0,
                transform: bentoVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
              }}>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>⭐⭐⭐⭐⭐</div>
                <p style={s.bentoRevText}>"Llegó en 2 días. Calidad increíble. El gadget detectó cosas de mi salud que ni sabía."</p>
                <div style={s.bentoRevAuthor}>
                  <div style={s.bentoRevAv}>CR</div>
                  <div>
                    <p style={s.bentoRevName}>Carlos R.</p>
                    <p style={s.bentoRevCity}>Bogotá, Colombia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUCT GRID ── */}
      {featured.length > 0 && (
        <section style={s.sec}>
          <div style={s.secInner}>
            <p style={s.secLabel}>Catálogo</p>
            <h2 style={s.secH2}>Gadgets <em style={s.secEm}>IA</em> destacados</h2>
            <div ref={prodsRef} style={s.prodGrid}>
              {featured.map((prod, i) => (
                <Link
                  key={prod.id}
                  to={`/producto/${prod.id}`}
                  onMouseEnter={() => setHovProd(prod.id)}
                  onMouseLeave={() => setHovProd(null)}
                  style={{
                    ...s.prodCard,
                    opacity: prodsVisible ? 1 : 0,
                    boxShadow: hovProd === prod.id ? '0 20px 48px rgba(0,0,0,0.12)' : '0 2px 16px rgba(0,0,0,0.07)',
                    transform: !prodsVisible
                      ? 'translateY(20px)'
                      : hovProd === prod.id ? 'translateY(-5px)' : 'translateY(0)',
                    transition: !prodsVisible
                      ? `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`
                      : 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <div style={s.prodImgWrap}>
                    <img
                      style={{
                        ...s.prodImg,
                        transform: hovProd === prod.id ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 0.4s ease',
                      }}
                      src={prod.image_url || getCategoryImg(prod.category)}
                      alt={prod.name}
                    />
                    <div style={{ ...s.prodBadge, background: BADGE_COLORS[i % BADGE_COLORS.length] }}>
                      {BADGE_LABELS[i % BADGE_LABELS.length]}
                    </div>
                    <div style={{
                      ...s.prodAddBtn,
                      transform: hovProd === prod.id ? 'translateY(0)' : 'translateY(100%)',
                      transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
                    }}>
                      + Agregar al carrito
                    </div>
                  </div>
                  <div style={s.prodInfo}>
                    <p style={s.prodCat}>{(prod.category || '').toUpperCase()}</p>
                    <p style={s.prodName}>{prod.name}</p>
                    <div style={s.prodRating}>
                      <span style={{ fontSize: '11px' }}>⭐⭐⭐⭐⭐</span>
                      <span style={s.prodRnum}>4.9</span>
                      <span style={s.prodRcount}>(1,234)</span>
                    </div>
                    <div style={s.prodPriceRow}>
                      <span style={s.prodOrig}>${Math.round(prod.price * 1.43)}</span>
                      <span style={s.prodPrice}>${prod.price}</span>
                      <span style={s.prodDisc}>-30%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/productos" style={s.btnBlue}>Ver todos los productos →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── COMPARADOR ── */}
      <section style={s.secGray}>
        <div style={s.secInner}>
          <p style={s.secLabel}>Encuentra tu favorito</p>
          <h2 style={s.secH2}>Compara y <em style={s.secEm}>elige</em></h2>
          <p style={s.secSub}>Los 3 gadgets más populares, lado a lado.</p>
          <div style={s.compGrid}>
            {COMPARE.map((prod, i) => (
              <div key={i} style={{
                ...s.compCard,
                borderColor: prod.popular ? '#1A6FFF' : '#e5e7eb',
                background: prod.popular ? 'linear-gradient(180deg,rgba(26,111,255,0.04) 0%,#fff 30%)' : '#fff',
                position: 'relative',
              }}>
                {prod.popular && <div style={s.compBadge}>⭐ MÁS POPULAR</div>}
                <img style={s.compImg} src={`https://images.unsplash.com/${prod.img}?w=400&q=80`} alt={prod.name} />
                <div style={s.compName}>{prod.name}</div>
                <div style={s.compPriceRow}>
                  <span style={s.compOrig}>{prod.orig}</span>
                  <span style={s.compPrice}>{prod.price}</span>
                </div>
                <div style={s.compRows}>
                  {COMPARE_ROWS.map(row => (
                    <div key={row.key} style={s.compRow}>
                      <span style={s.compRowLabel}>{row.label}</span>
                      <span style={{ ...s.compRowVal, color: prod[row.key] ? '#22c55e' : '#d1d5db' }}>
                        {prod[row.key] ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to={prod.to} style={{ ...s.compBtn, background: prod.popular ? '#1A6FFF' : '#0a0a0f' }}>
                  Ver producto →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUNDLE ── */}
      <section style={s.secGray}>
        <div style={s.secInner}>
          <p style={s.secLabel}>Kits con descuento</p>
          <h2 style={s.secH2}>Arma tu <em style={s.secEm}>setup IA</em><br />y ahorra más</h2>
          <p style={s.secSub}>Combos seleccionados para maximizar tu experiencia. Precio especial al llevarlos juntos.</p>
          <div style={s.bundleGrid}>
            <div
              onMouseEnter={() => setHovBundle(0)}
              onMouseLeave={() => setHovBundle(null)}
              style={{ ...s.bundleCard, borderColor: hovBundle === 0 ? '#1A6FFF' : '#e5e7eb' }}
            >
              <div style={s.bundleProducts}>
                <img style={s.bundleProdImg} src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80" alt="" />
                <span style={s.bundlePlus}>+</span>
                <img style={s.bundleProdImg} src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" alt="" />
              </div>
              <div>
                <div style={s.bundleName}>Kit Audio + Watch</div>
                <div style={s.bundleIncludes}>Auriculares IA Pro X1<br />SmartWatch Pro IA</div>
              </div>
              <div style={s.bundlePriceRow}>
                <span style={s.bundleOrig}>$169</span>
                <span style={s.bundlePrice}>$99</span>
                <span style={s.bundleSave}>Ahorra $70</span>
              </div>
              <Link to="/productos" style={s.bundleBtn}>Agregar kit al carrito</Link>
            </div>

            <div
              onMouseEnter={() => setHovBundle(1)}
              onMouseLeave={() => setHovBundle(null)}
              style={{ ...s.bundleCard, borderColor: hovBundle === 1 ? '#1A6FFF' : '#e5e7eb', background: 'linear-gradient(135deg,rgba(26,111,255,0.03) 0%,#fff 100%)', position: 'relative' }}
            >
              <div style={s.bundlePopBadge}>⭐ MÁS POPULAR</div>
              <div style={s.bundleProducts}>
                <img style={s.bundleProdImg} src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80" alt="" />
                <span style={s.bundlePlus}>+</span>
                <img style={s.bundleProdImg} src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" alt="" />
                <span style={s.bundlePlus}>+</span>
                <img style={s.bundleProdImg} src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&q=80" alt="" />
              </div>
              <div>
                <div style={s.bundleName}>Setup IA Completo</div>
                <div style={s.bundleIncludes}>Auriculares + SmartWatch + Monitor Salud</div>
              </div>
              <div style={s.bundlePriceRow}>
                <span style={s.bundleOrig}>$264</span>
                <span style={s.bundlePrice}>$149</span>
                <span style={s.bundleSave}>Ahorra $115</span>
              </div>
              <Link to="/productos" style={{ ...s.bundleBtn, background: '#1A6FFF' }}>Agregar kit al carrito</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BANNER FULL BLEED ── */}
      <div style={s.banner}>
        <img style={s.bannerImg} src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&q=85" alt="" />
        <div style={s.bannerOverlay} />
        <div style={s.bannerContent}>
          <div style={s.bannerInner}>
            <span style={s.bannerChip}>✦ Producto estrella</span>
            <h2 style={s.bannerH2}>El gadget<br />que todos<br />quieren</h2>
            <p style={s.bannerSub}>Tecnología IA accesible para todos en Latinoamérica.</p>
            <Link to="/productos" style={s.bannerBtn}>Comprar ahora $49 →</Link>
          </div>
        </div>
      </div>

      {/* ── BEFORE / AFTER ── */}
      <section style={s.sec}>
        <div style={s.secInner}>
          <p style={s.secLabel}>La diferencia</p>
          <h2 style={s.secH2}>Tu vida con y sin<br /><em style={s.secEm}>gadgets IA</em></h2>
          <div style={s.baGrid}>
            <div style={{ ...s.baCol, borderRight: '2px solid #e5e7eb', background: '#f8f9fa' }}>
              <div style={s.baHeader}>
                <span style={{ fontSize: '20px' }}>😩</span>
                <span style={s.baLabelBefore}>Sin ConAI</span>
              </div>
              <h3 style={{ ...s.baTitle, color: '#374151' }}>Lo de antes</h3>
              <div style={s.baItems}>
                {[
                  'Auriculares que no cancelan el ruido del ambiente',
                  'Batería que dura 4 horas y te deja sin música',
                  'Sin seguimiento real de tu salud ni actividad',
                  'Gadgets que no aprenden tus hábitos',
                  'Precios altos por tecnología desactualizada',
                ].map((t, i) => (
                  <div key={i} style={s.baItem}>
                    <span style={{ color: '#ef4444', flexShrink: 0 }}>✗</span>
                    <span style={{ color: '#6b7280' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...s.baCol, background: '#0a0a0f' }}>
              <div style={s.baHeader}>
                <span style={{ fontSize: '20px' }}>🚀</span>
                <span style={s.baLabelAfter}>Con ConAI</span>
              </div>
              <h3 style={{ ...s.baTitle, color: '#fff' }}>El futuro ahora</h3>
              <div style={s.baItems}>
                {[
                  'IA adaptativa que cancela el ruido del metro, oficina o calle',
                  '30 horas de batería real con carga rápida en 45 min',
                  'Monitoreo 24/7 con alertas inteligentes de salud',
                  'Aprende y se adapta a tus rutinas en 7 días',
                  'Tecnología de punta al mejor precio de LatAm',
                ].map((t, i) => (
                  <div key={i} style={s.baItem}>
                    <span style={{ color: '#1A6FFF', flexShrink: 0 }}>✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.75)' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEALS ── */}
      <section style={s.secDark}>
        <div style={s.secInner}>
          <div style={s.dealsHeader}>
            <div>
              <p style={{ ...s.secLabel, color: '#ef4444' }}>⚡ Solo por hoy</p>
              <h2 style={{ ...s.secH2, color: '#fff' }}>Ofertas flash</h2>
            </div>
            <div style={s.dealsCd}>
              {[{ v: hh, u: 'hrs' }, { v: mm, u: 'min' }, { v: ss, u: 'seg' }].map(({ v, u }, i) => (
                <span key={i} style={{ display: 'contents' }}>
                  {i > 0 && <span style={s.dcSep}>:</span>}
                  <div style={s.dcBlock}>
                    <span style={s.dcNum}>{v}</span>
                    <span style={s.dcUnit}>{u}</span>
                  </div>
                </span>
              ))}
            </div>
          </div>
          <div className="scroll-track" style={s.dealsTrack}>
            {(deals.length > 0 ? deals : featured).map((prod, i) => (
              <Link key={prod.id} to={`/producto/${prod.id}`} style={s.dealCard}>
                <img style={s.dealImg} src={prod.image_url || getCategoryImg(prod.category)} alt={prod.name} />
                <div style={s.dealInfo}>
                  <span style={s.dealBadge}>-30% OFERTA</span>
                  <p style={s.dealName}>{prod.name}</p>
                  <div style={s.dealPriceRow}>
                    <span style={s.dealOrig}>${Math.round(prod.price * 1.43)}</span>
                    <span style={s.dealPrice}>${prod.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section style={s.sec}>
        <div style={s.secInner}>
          <p style={{ ...s.secLabel, textAlign: 'center' }}>Recomendador IA</p>
          <h2 style={{ ...s.secH2, textAlign: 'center' }}>¿Qué gadget IA<br />es <em style={s.secEm}>para ti</em>?</h2>
          <div style={s.quizWrap}>
            <div style={s.quizProgress}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ ...s.quizDot, background: quizStep >= n ? '#1A6FFF' : '#e5e7eb' }} />
              ))}
            </div>

            {quizStep === 1 && (
              <div>
                <p style={s.quizQ}>¿Para qué usarías tu gadget IA?</p>
                <p style={s.quizSub}>Selecciona la opción que mejor te describa</p>
                <div style={s.quizOptions}>
                  {[['🎵', 'Música y entretenimiento'], ['💪', 'Salud y fitness'], ['💼', 'Trabajo y productividad'], ['🏠', 'Hogar inteligente']].map(([icon, label]) => (
                    <button key={label} onClick={() => setQuizStep(2)} style={s.quizOpt}>
                      <span style={{ fontSize: '22px' }}>{icon}</span>{label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div>
                <p style={s.quizQ}>¿Cuánto quieres gastar?</p>
                <p style={s.quizSub}>Te mostramos las mejores opciones en tu rango</p>
                <div style={s.quizOptions}>
                  {[['💰', 'Menos de $50'], ['💎', '$50 – $100'], ['🏆', 'Más de $100'], ['🤷', 'Lo que sea necesario']].map(([icon, label]) => (
                    <button key={label} onClick={() => setQuizStep(3)} style={s.quizOpt}>
                      <span style={{ fontSize: '22px' }}>{icon}</span>{label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div>
                <p style={s.quizQ}>¿Qué más valoras?</p>
                <p style={s.quizSub}>Últimas preferencias para tu recomendación perfecta</p>
                <div style={s.quizOptions}>
                  {[['🔋', 'Batería larga duración'], ['🎨', 'Diseño y estética'], ['📱', 'Integración con celular'], ['🔇', 'Cancelación de ruido']].map(([icon, label]) => (
                    <button key={label} onClick={() => setQuizStep('result')} style={s.quizOpt}>
                      <span style={{ fontSize: '22px' }}>{icon}</span>{label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 'result' && (
              <div style={{ textAlign: 'center' }}>
                <p style={s.quizResultLabel}>🎯 Tu gadget ideal</p>
                <img style={s.quizResultImg} src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=85" alt="" />
                <p style={s.quizResultName}>Auriculares IA Pro X1</p>
                <p style={s.quizResultDesc}>Basado en tus respuestas, este es el gadget que mejor se adapta a tu estilo de vida y presupuesto.</p>
                <p style={s.quizResultPrice}>$49 <span style={{ fontSize: '18px', color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 }}>$89</span></p>
                <Link to="/productos?cat=auriculares" style={s.quizResultBtn}>Comprar ahora →</Link>
                <button onClick={() => setQuizStep(1)} style={s.quizRestart}>Hacer el quiz de nuevo</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── REVIEWS MASONRY ── */}
      <section style={s.secGray}>
        <div style={s.secInner}>
          <p style={s.secLabel}>Clientes reales</p>
          <h2 style={s.secH2}><em style={s.secEm}>12.847</em> personas<br />ya eligieron ConAI</h2>
          <div ref={reviewsRef} style={s.reviewsGrid}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{
                ...s.revCard,
                opacity: reviewsVisible ? 1 : 0,
                transform: reviewsVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`,
              }}>
                <div style={{ fontSize: '13px', marginBottom: '8px' }}>⭐⭐⭐⭐⭐</div>
                <p style={s.revText}>"{r.text}"</p>
                <div style={s.revAuthor}>
                  <div style={s.revAv}>{r.init}</div>
                  <div>
                    <p style={s.revName}>{r.name}</p>
                    <p style={s.revCity}>{r.city}</p>
                    <p style={s.revVerified}>✓ Compra verificada</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARANTEES ── */}
      <section style={s.sec}>
        <div style={s.secInner}>
          <p style={{ ...s.secLabel, textAlign: 'center' }}>Sin riesgos</p>
          <h2 style={{ ...s.secH2, textAlign: 'center' }}>Compra con<br /><em style={s.secEm}>total confianza</em></h2>
          <div style={s.guarGrid}>
            {[
              { icon: '↩️', title: '30 días de devolución', desc: 'Si no te convence, te devolvemos el 100% del dinero sin hacer preguntas. Así de simple.' },
              { icon: '🚚', title: 'Envío garantizado',     desc: 'Entrega en 24-48 horas con seguimiento en tiempo real. Si no llega, te lo reenviamos gratis.' },
              { icon: '🔒', title: 'Pago 100% seguro',      desc: 'Encriptación SSL de 256 bits. Tus datos nunca se comparten. Aceptamos todos los medios de pago.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={s.guarCard}>
                <div style={s.guarIcon}>{icon}</div>
                <div style={s.guarTitle}>{title}</div>
                <p style={s.guarDesc}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={s.payBand}>
            {['💳 VISA', '💳 MASTERCARD', '🅿️ PAYPAL', '💳 AMEX', '🔒 SSL 256-bit', '✓ Compra Protegida'].map(p => (
              <span key={p} style={s.payChip}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={s.secGray}>
        <div style={s.secInner}>
          <p style={{ ...s.secLabel, textAlign: 'center' }}>Preguntas frecuentes</p>
          <h2 style={{ ...s.secH2, textAlign: 'center' }}>Todo lo que<br />necesitas <em style={s.secEm}>saber</em></h2>
          <div style={s.faqList}>
            {FAQS.map((faq, i) => (
              <div key={i} style={s.faqItem}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={s.faqQ}
                >
                  {faq.q}
                  <span style={{ ...s.faqArrow, transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </button>
                {openFaq === i && <div style={s.faqA}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section style={s.nlSection}>
        <div style={s.nlInner}>
          <p style={{ ...s.secLabel, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Newsletter</p>
          <h2 style={s.nlH2}>Ofertas antes<br />que <em style={s.secEm}>nadie</em></h2>
          <p style={s.nlSub}>Suscríbete y recibe descuentos exclusivos, lanzamientos y acceso anticipado a las mejores ofertas de gadgets IA.</p>
          <div style={s.nlForm}>
            <input
              style={s.nlInput}
              type="email"
              placeholder="tu@email.com"
              value={nlEmail}
              onChange={e => setNlEmail(e.target.value)}
            />
            <button style={s.nlBtn}>Suscribirse →</button>
          </div>
          <p style={s.nlDisclaimer}>Sin spam. Puedes cancelar cuando quieras.</p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={s.ctaFinal}>
        <div style={s.ctaGlow} />
        <h2 style={s.ctaH2}>COMPRA<br />EL <em style={s.secEm}>FUTURO</em><br />HOY</h2>
        <p style={s.ctaSub}>Gadgets con inteligencia artificial al mejor precio de Latinoamérica. Envío garantizado en 24h.</p>
        <div style={s.ctaBtnRow}>
          <Link to="/productos" style={s.ctaBtnMain}>Ver catálogo completo →</Link>
          <Link to="/contacto" style={s.ctaBtnGhost}>Hablar por WhatsApp</Link>
        </div>
      </section>
    </div>
  )
}

const s = {
  /* ── TICKER ── */
  tickerWrap:  { background: '#0a0a0f', padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap' },
  tickerTrack: { display: 'inline-flex', animation: 'tickerSlide 28s linear infinite' },
  tickerItem:  { fontSize: '12px', fontWeight: 600, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 28px' },
  tickerDot:   { color: '#1A6FFF', padding: '0 8px' },

  /* ── HERO ── */
  hero:       { background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '80px 5%' },
  heroGlow:   { position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle,rgba(26,111,255,0.15) 0%,transparent 65%)', borderRadius: '50%', top: '50%', left: '45%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' },
  heroGrid:   { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' },
  heroInner:  { maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '48px', position: 'relative', zIndex: 1 },
  heroLabel:  { fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1A6FFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  heroDot:    { width: '6px', height: '6px', background: '#1A6FFF', borderRadius: '50%', display: 'inline-block' },
  heroH1:     { fontSize: 'clamp(48px,6.5vw,86px)', fontWeight: 900, lineHeight: 0.93, letterSpacing: '-4px', color: '#fff', marginBottom: '24px' },
  heroEm:     { fontStyle: 'normal', background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub:    { fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: '380px', marginBottom: '28px' },
  heroCountdown: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '14px 18px', display: 'inline-flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  cdLabel:    { fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' },
  cdBlocks:   { display: 'flex', alignItems: 'center', gap: '6px' },
  cdBlock:    { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '7px 13px', minWidth: '52px' },
  cdNum:      { fontSize: '26px', fontWeight: 900, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  cdUnit:     { fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' },
  cdSep:      { fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.3)' },
  heroStock:  { marginBottom: '20px' },
  stockTop:   { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  stockLbl:   { fontSize: '12px', fontWeight: 700, color: '#fca5a5' },
  stockNum:   { fontSize: '12px', color: 'rgba(255,255,255,0.35)' },
  stockBar:   { height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' },
  stockFill:  { height: '100%', width: '23%', background: 'linear-gradient(90deg,#ef4444,#f97316)', borderRadius: '99px' },
  heroPriceRow: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' },
  priceOld:   { fontSize: '18px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', fontWeight: 500 },
  priceNew:   { fontSize: '54px', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1 },
  priceDisc:  { background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '99px' },
  heroBtns:   { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' },
  btnBlue:    { background: '#1A6FFF', color: '#fff', padding: '15px 36px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, display: 'inline-block', textDecoration: 'none' },
  btnGhost:   { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 28px', borderRadius: '99px', fontSize: '14px', fontWeight: 600, display: 'inline-block', textDecoration: 'none' },
  heroTrust:  { display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' },
  heroTrustItem: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 },
  heroPayIcons: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  payIcon:    { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em' },
  heroRight:  { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroImg:    { width: '420px', height: '520px', objectFit: 'cover', borderRadius: '32px', display: 'block' },
  heroFloatA: { position: 'absolute', top: '28px', right: '-28px', background: 'rgba(255,255,255,0.96)', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' },
  floatDot:   { width: '7px', height: '7px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px rgba(34,197,94,0.8)', flexShrink: 0 },
  floatText:  { fontSize: '12px', fontWeight: 700, color: '#0a0a0f' },
  heroFloatB: { position: 'absolute', bottom: '28px', left: '-36px', background: 'rgba(255,255,255,0.96)', borderRadius: '12px', padding: '12px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', maxWidth: '200px' },
  fbText:     { fontSize: '11px', color: '#374151', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '6px' },
  fbName:     { fontSize: '10px', fontWeight: 700, color: '#0a0a0f' },

  /* ── STATS BAND ── */
  statsBand:  { background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '44px 5%' },
  statsInner: { maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' },
  statItem:   { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '0 20px' },
  statNum:    { fontSize: '44px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1, color: '#0a0a0f' },
  statGrad:   { background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  statLabel:  { fontSize: '13px', color: '#9ca3af', fontWeight: 500, textAlign: 'center' },

  /* ── SECTION COMMONS ── */
  sec:        { padding: '80px 5%' },
  secGray:    { padding: '80px 5%', background: '#f8f9fa' },
  secDark:    { padding: '80px 5%', background: '#0a0a0f' },
  secInner:   { maxWidth: '1100px', margin: '0 auto' },
  secLabel:   { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1A6FFF', marginBottom: '10px' },
  secH2:      { fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.08, color: '#0a0a0f', marginBottom: '14px' },
  secEm:      { fontStyle: 'normal', background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  secSub:     { fontSize: '16px', color: '#6b7280', maxWidth: '520px', lineHeight: 1.65, marginBottom: '48px' },

  /* ── CÓMO FUNCIONA ── */
  howGrid:  { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' },
  howCard:  { padding: '32px 36px', textAlign: 'center' },
  howNum:   { fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', color: '#1A6FFF', marginBottom: '16px', textTransform: 'uppercase' },
  howIcon:  { fontSize: '42px', marginBottom: '16px' },
  howTitle: { fontSize: '18px', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.3px', marginBottom: '10px' },
  howDesc:  { fontSize: '14px', color: '#6b7280', lineHeight: 1.65, maxWidth: '240px', margin: '0 auto' },

  /* ── COMPARADOR ── */
  compGrid:     { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginTop: '48px' },
  compCard:     { borderRadius: '24px', border: '2px solid #e5e7eb', padding: '28px', display: 'flex', flexDirection: 'column', gap: '0', overflow: 'hidden' },
  compBadge:    { position: 'absolute', top: 0, right: '24px', background: '#1A6FFF', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '5px 14px', borderRadius: '0 0 10px 10px', letterSpacing: '0.06em' },
  compImg:      { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '16px', display: 'block', marginBottom: '20px' },
  compName:     { fontSize: '16px', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.3px', marginBottom: '8px' },
  compPriceRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' },
  compOrig:     { fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through' },
  compPrice:    { fontSize: '28px', fontWeight: 900, color: '#0a0a0f', letterSpacing: '-1px' },
  compRows:     { display: 'flex', flexDirection: 'column', borderTop: '1px solid #f0f0f0', marginBottom: '24px', flex: 1 },
  compRow:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' },
  compRowLabel: { color: '#6b7280', fontWeight: 500 },
  compRowVal:   { fontSize: '16px', fontWeight: 700 },
  compBtn:      { color: '#fff', padding: '12px 20px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'block' },

  /* ── CATEGORIES ── */
  catPills:     { display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '40px' },
  catPill:      { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderRadius: '16px', border: '2px solid #e5e7eb', background: '#fff', textDecoration: 'none', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s', minWidth: '210px', flex: '1 1 auto' },
  catPillIcon:  { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 },
  catPillName:  { fontSize: '15px', fontWeight: 700, color: '#0a0a0f', letterSpacing: '-0.2px', marginBottom: '3px' },
  catPillCount: { fontSize: '12px', color: '#9ca3af', fontWeight: 500 },
  catPillArrow: { fontSize: '18px', fontWeight: 700, marginLeft: 'auto', transition: 'color 0.2s', flexShrink: 0 },

  /* ── BENTO ── */
  bentoGrid:     { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gridTemplateRows: 'auto auto', gap: '12px', marginTop: '48px' },
  bentoMain:     { gridRow: 'span 2', background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', textDecoration: 'none' },
  bentoMainImg:  { width: '100%', height: '280px', objectFit: 'cover', display: 'block' },
  bentoMainInfo: { padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' },
  bentoCat:      { fontSize: '10px', fontWeight: 700, color: '#1A6FFF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' },
  bentoName:     { fontSize: '22px', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.5px', marginBottom: '8px' },
  bentoDesc:     { fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: 'auto' },
  bentoPriceRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0 16px' },
  bentoOrig:     { fontSize: '15px', color: '#9ca3af', textDecoration: 'line-through' },
  bentoPrice:    { fontSize: '34px', fontWeight: 900, color: '#0a0a0f', letterSpacing: '-1px' },
  bentoBtn:      { background: '#0a0a0f', color: '#fff', padding: '13px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, display: 'inline-block', alignSelf: 'flex-start', cursor: 'pointer' },
  bentoStat:     { background: '#0a0a0f', borderRadius: '20px', padding: '28px' },
  bentoStatNum:  { fontSize: '50px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1, background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  bentoStatLabel:{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' },
  bentoRev:      { background: '#fff', borderRadius: '20px', padding: '22px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' },
  bentoRevText:  { fontSize: '13px', color: '#374151', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '14px' },
  bentoRevAuthor:{ display: 'flex', alignItems: 'center', gap: '10px' },
  bentoRevAv:    { width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 },
  bentoRevName:  { fontSize: '13px', fontWeight: 700, color: '#0a0a0f', margin: 0 },
  bentoRevCity:  { fontSize: '11px', color: '#9ca3af', margin: 0 },

  /* ── PRODUCT GRID ── */
  prodGrid:    { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginTop: '48px' },
  prodCard:    { background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', position: 'relative', textDecoration: 'none', display: 'block' },
  prodImgWrap: { position: 'relative', overflow: 'hidden', height: '220px', background: '#f5f5f7' },
  prodImg:     { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  prodBadge:   { position: 'absolute', top: '12px', left: '12px', fontSize: '10px', fontWeight: 800, color: '#fff', padding: '4px 10px', borderRadius: '99px' },
  prodAddBtn:  { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(10,10,15,0.88)', color: '#fff', textAlign: 'center', padding: '13px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em' },
  prodInfo:    { padding: '18px' },
  prodCat:     { fontSize: '10px', fontWeight: 700, color: '#1A6FFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '5px' },
  prodName:    { fontSize: '15px', fontWeight: 700, color: '#0a0a0f', lineHeight: 1.3, marginBottom: '8px' },
  prodRating:  { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' },
  prodRnum:    { fontSize: '12px', fontWeight: 700, color: '#0a0a0f' },
  prodRcount:  { fontSize: '11px', color: '#9ca3af' },
  prodPriceRow:{ display: 'flex', alignItems: 'center', gap: '8px' },
  prodOrig:    { fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through' },
  prodPrice:   { fontSize: '22px', fontWeight: 900, color: '#0a0a0f', letterSpacing: '-0.5px' },
  prodDisc:    { fontSize: '10px', fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '3px 7px', borderRadius: '99px' },

  /* ── BUNDLE ── */
  bundleGrid:     { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px', marginTop: '48px' },
  bundleCard:     { background: '#fff', borderRadius: '24px', border: '2px solid #e5e7eb', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' },
  bundlePopBadge: { position: 'absolute', top: 0, right: '24px', background: '#1A6FFF', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '5px 14px', borderRadius: '0 0 10px 10px', letterSpacing: '0.06em' },
  bundleProducts: { display: 'flex', alignItems: 'center', gap: '12px' },
  bundleProdImg:  { width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', background: '#f5f5f7', flexShrink: 0, display: 'block' },
  bundlePlus:     { fontSize: '20px', fontWeight: 700, color: '#9ca3af' },
  bundleName:     { fontSize: '16px', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.3px', marginBottom: '6px' },
  bundleIncludes: { fontSize: '13px', color: '#6b7280', lineHeight: 1.5 },
  bundlePriceRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  bundleOrig:     { fontSize: '15px', color: '#9ca3af', textDecoration: 'line-through' },
  bundlePrice:    { fontSize: '32px', fontWeight: 900, color: '#0a0a0f', letterSpacing: '-1px' },
  bundleSave:     { fontSize: '12px', fontWeight: 800, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '4px 12px', borderRadius: '99px' },
  bundleBtn:      { background: '#0a0a0f', color: '#fff', padding: '13px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'block' },

  /* ── BANNER ── */
  banner:        { position: 'relative', height: '520px', overflow: 'hidden' },
  bannerImg:     { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  bannerOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(5,5,8,0.88) 0%,rgba(5,5,8,0.45) 55%,transparent 100%)' },
  bannerContent: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 8%' },
  bannerInner:   { maxWidth: '500px' },
  bannerChip:    { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#66AAFF', marginBottom: '16px', display: 'block' },
  bannerH2:      { fontSize: 'clamp(36px,5vw,68px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 0.95, color: '#fff', marginBottom: '20px' },
  bannerSub:     { fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '32px' },
  bannerBtn:     { background: '#fff', color: '#0a0a0f', padding: '14px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, display: 'inline-block', textDecoration: 'none' },

  /* ── BEFORE / AFTER ── */
  baGrid:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: '24px', overflow: 'hidden', marginTop: '48px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },
  baCol:        { padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '20px' },
  baHeader:     { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  baLabelBefore:{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' },
  baLabelAfter: { fontSize: '13px', fontWeight: 700, color: '#66AAFF', textTransform: 'uppercase', letterSpacing: '0.08em' },
  baTitle:      { fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' },
  baItems:      { display: 'flex', flexDirection: 'column', gap: '14px' },
  baItem:       { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', lineHeight: 1.5 },

  /* ── DEALS ── */
  dealsHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  dealsCd:     { display: 'flex', alignItems: 'center', gap: '6px' },
  dcBlock:     { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 14px', minWidth: '58px' },
  dcNum:       { fontSize: '30px', fontWeight: 900, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  dcUnit:      { fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' },
  dcSep:       { fontSize: '22px', fontWeight: 700, color: 'rgba(255,255,255,0.25)' },
  dealsTrack:  { display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' },
  dealCard:    { flexShrink: 0, width: '220px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block' },
  dealImg:     { width: '100%', height: '155px', objectFit: 'cover', display: 'block' },
  dealInfo:    { padding: '16px' },
  dealBadge:   { fontSize: '10px', fontWeight: 800, color: '#fff', background: '#ef4444', padding: '3px 10px', borderRadius: '99px', display: 'inline-block', marginBottom: '8px' },
  dealName:    { fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '10px' },
  dealPriceRow:{ display: 'flex', alignItems: 'center', gap: '8px' },
  dealOrig:    { fontSize: '12px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' },
  dealPrice:   { fontSize: '20px', fontWeight: 900, color: '#fff' },

  /* ── QUIZ ── */
  quizWrap:       { background: '#fff', borderRadius: '28px', border: '1px solid #e5e7eb', padding: '48px', maxWidth: '700px', margin: '48px auto 0', boxShadow: '0 4px 32px rgba(0,0,0,0.07)' },
  quizProgress:   { display: 'flex', gap: '6px', marginBottom: '28px' },
  quizDot:        { height: '4px', flex: 1, borderRadius: '99px', transition: 'background 0.3s' },
  quizQ:          { fontSize: '22px', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.5px', marginBottom: '8px' },
  quizSub:        { fontSize: '14px', color: '#9ca3af', marginBottom: '28px' },
  quizOptions:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  quizOpt:        { border: '2px solid #e5e7eb', borderRadius: '14px', padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600, color: '#374151', background: '#fff', fontFamily: 'inherit', textAlign: 'left' },
  quizResultLabel:{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A6FFF', marginBottom: '12px' },
  quizResultImg:  { width: '160px', height: '160px', objectFit: 'cover', borderRadius: '20px', margin: '0 auto 20px', display: 'block' },
  quizResultName: { fontSize: '22px', fontWeight: 800, color: '#0a0a0f', marginBottom: '8px' },
  quizResultDesc: { fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '24px' },
  quizResultPrice:{ fontSize: '36px', fontWeight: 900, color: '#0a0a0f', marginBottom: '20px' },
  quizResultBtn:  { background: '#1A6FFF', color: '#fff', padding: '14px 36px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, display: 'inline-block', textDecoration: 'none', marginBottom: '12px' },
  quizRestart:    { fontSize: '13px', color: '#9ca3af', cursor: 'pointer', textDecoration: 'underline', display: 'block', marginTop: '12px', background: 'none', border: 'none', fontFamily: 'inherit' },

  /* ── REVIEWS ── */
  reviewsGrid: { columnCount: 3, columnGap: '14px', marginTop: '48px' },
  revCard:     { breakInside: 'avoid', background: '#fff', borderRadius: '16px', padding: '22px', marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.06)', display: 'inline-block', width: '100%', boxSizing: 'border-box' },
  revText:     { fontSize: '14px', color: '#374151', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '14px' },
  revAuthor:   { display: 'flex', alignItems: 'center', gap: '10px' },
  revAv:       { width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 },
  revName:     { fontSize: '13px', fontWeight: 700, color: '#0a0a0f', margin: 0 },
  revCity:     { fontSize: '11px', color: '#9ca3af', margin: 0 },
  revVerified: { fontSize: '10px', color: '#22c55e', fontWeight: 600, margin: 0 },

  /* ── GUARANTEES ── */
  guarGrid:  { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginTop: '48px' },
  guarCard:  { background: '#f8f9fa', borderRadius: '20px', padding: '32px 28px', textAlign: 'center', border: '1px solid #e5e7eb' },
  guarIcon:  { fontSize: '44px', marginBottom: '18px' },
  guarTitle: { fontSize: '18px', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.3px', marginBottom: '10px' },
  guarDesc:  { fontSize: '14px', color: '#6b7280', lineHeight: 1.65 },
  payBand:   { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '36px', paddingTop: '36px', borderTop: '1px solid #e5e7eb' },
  payChip:   { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, color: '#374151' },

  /* ── FAQ ── */
  faqList: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '48px', maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' },
  faqItem: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden' },
  faqQ:    { padding: '20px 24px', fontSize: '15px', fontWeight: 700, color: '#0a0a0f', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%', background: 'none', border: 'none', textAlign: 'left', fontFamily: 'inherit' },
  faqArrow:{ fontSize: '18px', color: '#9ca3af', transition: 'transform 0.25s', flexShrink: 0 },
  faqA:    { padding: '0 24px 20px', fontSize: '14px', color: '#6b7280', lineHeight: 1.7, borderTop: '1px solid #f0f0f0', paddingTop: '16px' },

  /* ── NEWSLETTER ── */
  nlSection:    { background: 'linear-gradient(135deg,#0a0a0f 0%,#0e1628 100%)', padding: '80px 5%' },
  nlInner:      { maxWidth: '560px', margin: '0 auto', textAlign: 'center' },
  nlH2:         { fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.08, color: '#fff', marginBottom: '12px' },
  nlSub:        { fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: '32px' },
  nlForm:       { display: 'flex', gap: '8px', maxWidth: '440px', margin: '0 auto 16px' },
  nlInput:      { flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '99px', padding: '14px 20px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'inherit' },
  nlBtn:        { background: '#1A6FFF', color: '#fff', padding: '14px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: 'inherit', flexShrink: 0 },
  nlDisclaimer: { fontSize: '11px', color: 'rgba(255,255,255,0.25)' },

  /* ── CTA FINAL ── */
  ctaFinal:    { background: '#050508', padding: '120px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '28px', position: 'relative', overflow: 'hidden' },
  ctaGlow:     { position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(26,111,255,0.1) 0%,transparent 65%)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' },
  ctaH2:       { fontSize: 'clamp(60px,11vw,130px)', fontWeight: 900, letterSpacing: '-6px', lineHeight: 0.88, color: '#fff', position: 'relative', zIndex: 1, margin: 0 },
  ctaSub:      { fontSize: '18px', color: 'rgba(255,255,255,0.35)', maxWidth: '420px', lineHeight: 1.6, position: 'relative', zIndex: 1 },
  ctaBtnRow:   { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 },
  ctaBtnMain:  { background: '#1A6FFF', color: '#fff', padding: '17px 48px', borderRadius: '99px', fontSize: '16px', fontWeight: 700, display: 'inline-block', textDecoration: 'none' },
  ctaBtnGhost: { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', padding: '16px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 600, display: 'inline-block', textDecoration: 'none' },
}
