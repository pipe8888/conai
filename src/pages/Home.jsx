import { useState, useEffect, useRef } from 'react'
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
  product:   'photo-1496181133206-80ce9b88a853',
}
function getCategoryImg(cat) {
  const key = (cat || '').toLowerCase()
  for (const [k, v] of Object.entries(CATEGORY_IMGS)) {
    if (key.includes(k)) return `https://images.unsplash.com/${v}?w=600&q=85`
  }
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85'
}

function useTextScramble(text, trigger) {
  const [display, setDisplay] = useState(text)
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'
    let frame = 0
    const total = text.length * 5
    let raf
    function tick() {
      setDisplay(
        text.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          if (Math.floor(frame / 5) > i) return ch
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
      )
      frame++
      if (frame < total) raf = requestAnimationFrame(tick)
      else setDisplay(text)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, trigger])
  return display
}

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
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
  { init: 'MS', name: 'María S.', city: 'Santiago, Chile', text: 'Llegó en 2 días y la calidad es impresionante. Los auriculares con IA se adaptan solos al ruido del metro. Nunca volví a escuchar música de otra manera.' },
  { init: 'CR', name: 'Carlos R.', city: 'Bogotá, Colombia', text: 'El SmartWatch detectó una irregularidad en mi sueño que no sabía que tenía. Fui al médico y lo confirmaron. Un gadget que me ayudó a cuidar mi salud.' },
  { init: 'DM', name: 'Diego M.', city: 'Lima, Perú', text: 'Mi tercer pedido. Siempre rápido, siempre de calidad. 100% recomendado.' },
  { init: 'AL', name: 'Ana L.', city: 'Ciudad de México', text: 'La IA aprende. Después de una semana ya sabía exactamente cómo me gusta el sonido. Sin tocar nada. Solo usas el gadget y listo.' },
  { init: 'JP', name: 'Juana P.', city: 'Guadalajara, México', text: 'Compré para mi papá y está encantado. El proceso de compra fue muy fácil y el envío llegó antes de lo prometido.' },
  { init: 'RV', name: 'Rodrigo V.', city: 'Montevideo, Uruguay', text: 'Pagué, llegó el tracking al instante y en 3 días estaba en mi puerta. 10/10 recomendado.' },
]

const FAQS = [
  { q: '¿Cuánto tarda en llegar mi pedido?', a: 'Despachamos en 24 horas hábiles. El tiempo de entrega depende de tu país: Chile 2-3 días, México y Colombia 3-5 días, resto de Latinoamérica 5-7 días. Recibirás un número de seguimiento por email al momento del despacho.' },
  { q: '¿Puedo devolver un producto?', a: 'Sí. Tienes 30 días desde la recepción para devolver cualquier producto sin dar explicaciones. El reembolso se procesa en 3-5 días hábiles al mismo medio de pago que usaste.' },
  { q: '¿Los productos tienen garantía?', a: 'Todos nuestros gadgets incluyen garantía de 12 meses por defectos de fabricación. Si el producto falla por uso normal, lo reemplazamos sin costo adicional.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, Amex), PayPal, transferencia bancaria y pagos en efectivo según el país. Todos los pagos son procesados con encriptación SSL de 256 bits.' },
  { q: '¿Cómo sé si el producto me va a funcionar?', a: 'Usa nuestro quiz de recomendación IA — en 3 preguntas te decimos exactamente qué gadget se adapta mejor a tu estilo de vida. Y si compras y no te convence, devuelves sin costo.' },
]

const PROD_BADGES   = ['🔥 HOT', '⭐ Bestseller', '✨ Nuevo', '🔥 HOT', '⭐ Bestseller', '✨ Nuevo']
const BADGE_COLORS  = ['#ef4444', '#f59e0b', '#8b5cf6', '#ef4444', '#f59e0b', '#8b5cf6']

function Home() {
  const [featured, setFeatured] = useState([])
  const [deals,    setDeals]    = useState([])
  const [time,     setTime]     = useState(2 * 3600 + 34 * 60 + 18)
  const [hovProd,  setHovProd]  = useState(null)
  const [quizStep, setQuizStep] = useState(1)
  const [openFaq,  setOpenFaq]  = useState(null)
  const [nlEmail,  setNlEmail]  = useState('')

  const [statsRef,   statsVisible]   = useReveal()
  const [bentoRef,   bentoVisible]   = useReveal()
  const [prodsRef,   prodsVisible]   = useReveal()
  const [dealsRef,   dealsVisible]   = useReveal()
  const [reviewsRef, reviewsVisible] = useReveal()

  const scrambled = useTextScramble('Auriculares IA', 0)

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
    <div>
      <Helmet>
        <title>ConAI — Gadgets con Inteligencia Artificial</title>
        <meta name="description" content="Descubre los mejores gadgets con IA: auriculares, wearables, dispositivos de salud y más. Envío gratis en pedidos +$50 USD." />
        <meta property="og:title" content="ConAI — Gadgets con Inteligencia Artificial" />
        <meta property="og:description" content="Descubre los mejores gadgets con IA. Envío gratis en pedidos +$50 USD." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://conai.vercel.app/" />
        <link rel="canonical" href="https://conai.vercel.app/" />
        <style>{`@keyframes tickerSlide{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </Helmet>

      {/* TICKER */}
      <div style={s.tickerWrap}>
        <div style={s.tickerTrack}>
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} style={s.tickerItem}>{item}<span style={s.tickerDot}>·</span></span>
          ))}
        </div>
      </div>

      {/* HERO DARK */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.heroGrid} />
        <div style={s.heroInner}>
          <div>
            <div style={s.heroLabel}><span style={s.heroDot} />Producto #1 esta semana</div>
            <h1 style={s.heroH1}>
              {scrambled}<br />
              <em style={s.heroEm}>que te<br />entienden</em>
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
                  {t}{i < 2 && <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 6px' }}>·</span>}
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
              <img
                style={s.heroImg}
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=85"
                alt="Auriculares IA"
              />
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

      {/* STATS BAND */}
      <div ref={statsRef} style={s.statsBand}>
        {[
          { num: '12', unit: 'K+', label: 'Clientes satisfechos' },
          { num: '4.9', unit: '★', label: 'Rating promedio' },
          { num: '98', unit: '%', label: 'Recomendarían' },
          { num: '24', unit: 'h', label: 'Envío garantizado' },
        ].map(({ num, unit, label }, i) => (
          <div key={i} style={{
            ...s.statItem,
            borderRight: i < 3 ? '1px solid #f0f0f0' : 'none',
            opacity: statsVisible ? 1 : 0,
            transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
          }}>
            <span style={s.statNum}><span style={s.statGrad}>{num}</span>{unit}</span>
            <span style={s.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* CATEGORIES GRID */}
      <section style={s.section}>
        <div style={s.secInner}>
          <p style={s.label}>Explora por categoría</p>
          <h2 style={s.title}>Todo el universo<br /><span style={s.gradient}>IA</span> en un lugar</h2>
          <div style={s.catGrid}>
            {[
              { to: '/productos?cat=auriculares', img: 'photo-1505740420928-5e560c06d30e', name: 'Audio IA', count: '24 productos', wide: true },
              { to: '/productos?cat=wearables',   img: 'photo-1523275335684-37898b6baf30', name: 'Wearables', count: '18 productos' },
              { to: '/productos?cat=salud',        img: 'photo-1559757148-5c350d0d3c56', name: 'Salud IA', count: '12 productos' },
              { to: '/productos?cat=robot',        img: 'photo-1485827404703-89b55fcc595e', name: 'Robots IA', count: '9 productos' },
              { to: '/productos?cat=hogar',        img: 'photo-1558618666-fcd25c85cd64', name: 'Hogar IA', count: '15 productos' },
            ].map(({ to, img, name, count, wide }) => (
              <Link key={name} to={to} style={{
                ...s.catCard,
                gridColumn: wide ? 'span 2' : 'span 1',
                aspectRatio: wide ? '16/7' : '4/3',
              }}>
                <img style={s.catImg} src={`https://images.unsplash.com/${img}?w=800&q=85`} alt={name} />
                <div style={s.catOverlay} />
                <div style={s.catContent}>
                  <div style={s.catName}>{name}</div>
                  <div style={s.catCount}>{count}</div>
                </div>
                <div style={s.catArrow}>→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO GRID */}
      {star && (
        <section style={s.sectionGray}>
          <div style={s.secInner}>
            <p style={s.label}>Más vendidos</p>
            <h2 style={s.title}>Lo que todos<br />están <span style={s.gradient}>comprando</span></h2>
            <div ref={bentoRef} style={s.bentoGrid}>
              <Link to={`/producto/${star.id}`} className="card-hover" style={{
                ...s.bentoMain,
                opacity: bentoVisible ? 1 : 0,
                transform: bentoVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}>
                <img style={s.bentoMainImg} src={star.image_url || getCategoryImg(star.category)} alt={star.name} />
                <div style={s.bentoMainInfo}>
                  <p style={s.bentoCat}>{star.category.toUpperCase()}</p>
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
                transform: bentoVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
              }}>
                <div style={s.bentoStatNum}>2.8K</div>
                <div style={s.bentoStatLabel}>unidades vendidas este mes</div>
              </div>
              <div style={{
                ...s.bentoRev,
                opacity: bentoVisible ? 1 : 0,
                transform: bentoVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
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

      {/* PRODUCT GRID 3-col */}
      <section style={s.section}>
        <div style={s.secInner}>
          <p style={s.label}>Catálogo</p>
          <h2 style={s.title}>Gadgets <span style={s.gradient}>IA</span> destacados</h2>
          <div ref={prodsRef} style={s.prodGrid}>
            {featured.map((prod, i) => (
              <Link
                key={prod.id}
                to={`/producto/${prod.id}`}
                style={{
                  ...s.prodCard,
                  opacity: prodsVisible ? 1 : 0,
                  boxShadow: hovProd === prod.id ? '0 20px 48px rgba(0,0,0,0.12)' : '0 2px 16px rgba(0,0,0,0.07)',
                  transform: !prodsVisible
                    ? 'translateY(20px)'
                    : hovProd === prod.id ? 'translateY(-5px)' : 'translateY(0)',
                  transition: !prodsVisible
                    ? `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`
                    : 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={() => setHovProd(prod.id)}
                onMouseLeave={() => setHovProd(null)}
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
                    {PROD_BADGES[i % PROD_BADGES.length]}
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
                  <p style={s.prodCat}>{prod.category.toUpperCase()}</p>
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

      {/* BUNDLE */}
      <section style={s.sectionGray}>
        <div style={s.secInner}>
          <p style={s.label}>Kits con descuento</p>
          <h2 style={s.title}>Arma tu <span style={s.gradient}>setup IA</span><br />y ahorra más</h2>
          <p style={s.sub}>Combos seleccionados para maximizar tu experiencia. Precio especial al llevarlos juntos.</p>
          <div style={s.bundleGrid}>
            <div style={s.bundleCard}>
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
            <div style={{ ...s.bundleCard, borderColor: '#1A6FFF', background: 'linear-gradient(135deg,rgba(26,111,255,0.03) 0%,#fff 100%)', position: 'relative' }}>
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

      {/* FULL BLEED BANNER */}
      <div style={s.banner}>
        <img style={s.bannerImg} src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&q=85" alt="" />
        <div style={s.bannerOverlay} />
        <div style={s.bannerContent}>
          <div>
            <span style={s.bannerChip}>✦ Producto estrella</span>
            <h2 style={s.bannerH2}>El gadget<br />que todos<br />quieren</h2>
            <p style={s.bannerSub}>Tecnología IA accesible para todos en Latinoamérica.</p>
            <Link to="/productos?cat=auriculares" style={s.bannerBtn}>Comprar ahora $49 →</Link>
          </div>
        </div>
      </div>

      {/* BEFORE / AFTER */}
      <section style={s.section}>
        <div style={s.secInner}>
          <p style={s.label}>La diferencia</p>
          <h2 style={s.title}>Tu vida con y sin<br /><span style={s.gradient}>gadgets IA</span></h2>
          <div style={s.baGrid}>
            <div style={s.baColBefore}>
              <div style={s.baHeader}>
                <span style={{ fontSize: '20px' }}>😩</span>
                <span style={s.baLabelBefore}>Sin ConAI</span>
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-1px', color: '#374151', margin: 0 }}>Lo de antes</h3>
              <div style={s.baItems}>
                {['Auriculares que no cancelan el ruido del ambiente', 'Batería que dura 4 horas y te deja sin música', 'Sin seguimiento real de tu salud ni actividad', 'Gadgets que no aprenden tus hábitos', 'Precios altos por tecnología desactualizada'].map((item, i) => (
                  <div key={i} style={s.baItemBefore}><span style={s.baX}>✗</span><span>{item}</span></div>
                ))}
              </div>
            </div>
            <div style={s.baColAfter}>
              <div style={s.baHeader}>
                <span style={{ fontSize: '20px' }}>🚀</span>
                <span style={s.baLabelAfter}>Con ConAI</span>
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-1px', color: '#fff', margin: 0 }}>El futuro ahora</h3>
              <div style={s.baItems}>
                {['IA adaptativa que cancela el ruido del metro, oficina o calle', '30 horas de batería real con carga rápida en 45 min', 'Monitoreo 24/7 con alertas inteligentes de salud', 'Aprende y se adapta a tus rutinas en 7 días', 'Tecnología de punta al mejor precio de LatAm'].map((item, i) => (
                  <div key={i} style={s.baItemAfter}><span style={s.baCheck}>✓</span><span>{item}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEALS */}
      <section style={s.sectionDark}>
        <div style={s.secInner}>
          <div style={s.dealsHeader}>
            <div>
              <p style={{ ...s.label, color: '#ef4444' }}>⚡ Solo por hoy</p>
              <h2 style={s.dealsH2}>Ofertas flash</h2>
            </div>
            <div style={s.dealsCd}>
              {[{ n: hh, u: 'hrs' }, { n: mm, u: 'min' }, { n: ss, u: 'seg' }].map(({ n, u }, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {i > 0 && <span style={s.dcSep}>:</span>}
                  <div style={s.dcBlock}><span style={s.dcNum}>{n}</span><span style={s.dcUnit}>{u}</span></div>
                </span>
              ))}
            </div>
          </div>
          <div ref={dealsRef} className="scroll-track" style={s.dealsTrack}>
            {deals.map((prod, i) => (
              <Link key={prod.id} to={`/producto/${prod.id}`} style={{
                ...s.dealCard,
                opacity: dealsVisible ? 1 : 0,
                transform: dealsVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
              }}>
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

      {/* QUIZ */}
      <section style={s.section}>
        <div style={s.secInner}>
          <p style={{ ...s.label, textAlign: 'center' }}>Recomendador IA</p>
          <h2 style={{ ...s.title, textAlign: 'center' }}>¿Qué gadget IA<br />es <span style={s.gradient}>para ti</span>?</h2>
          <div style={s.quizWrap}>
            {quizStep !== 'result' && (
              <div style={s.quizProgress}>
                {[1, 2, 3].map(n => (
                  <div key={n} style={{ ...s.quizProgDot, background: (typeof quizStep === 'number' && quizStep >= n) ? '#1A6FFF' : '#e5e7eb' }} />
                ))}
              </div>
            )}
            {quizStep === 1 && (
              <div>
                <p style={s.quizQ}>¿Para qué usarías tu gadget IA?</p>
                <p style={s.quizSub}>Selecciona la opción que mejor te describa</p>
                <div style={s.quizOptions}>
                  {[['🎵', 'Música y entretenimiento'], ['💪', 'Salud y fitness'], ['💼', 'Trabajo y productividad'], ['🏠', 'Hogar inteligente']].map(([icon, label]) => (
                    <div key={label} style={s.quizOpt} onClick={() => setQuizStep(2)}><span style={{ fontSize: '22px' }}>{icon}</span>{label}</div>
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
                    <div key={label} style={s.quizOpt} onClick={() => setQuizStep(3)}><span style={{ fontSize: '22px' }}>{icon}</span>{label}</div>
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
                    <div key={label} style={s.quizOpt} onClick={() => setQuizStep('result')}><span style={{ fontSize: '22px' }}>{icon}</span>{label}</div>
                  ))}
                </div>
              </div>
            )}
            {quizStep === 'result' && (
              <div style={{ textAlign: 'center' }}>
                <p style={s.quizResultLabel}>🎯 Tu gadget ideal</p>
                <img style={s.quizResultImg} src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=85" alt="" />
                <div style={s.quizResultName}>Auriculares IA Pro X1</div>
                <p style={s.quizResultDesc}>Basado en tus respuestas, este es el gadget que mejor se adapta a tu estilo de vida y presupuesto.</p>
                <div style={s.quizResultPrice}>
                  $49 <span style={{ fontSize: '18px', color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 }}>$89</span>
                </div>
                <Link to="/productos?cat=auriculares" style={s.quizResultBtn}>Comprar ahora →</Link>
                <br />
                <span style={s.quizRestart} onClick={() => setQuizStep(1)}>Hacer el quiz de nuevo</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* REVIEWS MASONRY */}
      <section style={s.sectionGray}>
        <div style={s.secInner}>
          <p style={s.label}>Clientes reales</p>
          <h2 style={s.title}><span style={s.gradient}>12.847</span> personas<br />ya eligieron ConAI</h2>
          <div ref={reviewsRef} style={s.reviewsGrid}>
            {REVIEWS.map(({ init, name, city, text }, i) => (
              <div key={i} style={{
                ...s.revCard,
                opacity: reviewsVisible ? 1 : 0,
                transition: `opacity 0.6s ease ${i * 0.1}s`,
              }}>
                <div style={{ fontSize: '13px', marginBottom: '8px' }}>⭐⭐⭐⭐⭐</div>
                <p style={s.revText}>"{text}"</p>
                <div style={s.revAuthor}>
                  <div style={s.revAv}>{init}</div>
                  <div>
                    <p style={s.revName}>{name}</p>
                    <p style={s.revCity}>{city}</p>
                    <p style={s.revVerified}>✓ Compra verificada</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEES */}
      <section style={s.section}>
        <div style={s.secInner}>
          <p style={{ ...s.label, textAlign: 'center' }}>Sin riesgos</p>
          <h2 style={{ ...s.title, textAlign: 'center' }}>Compra con<br /><span style={s.gradient}>total confianza</span></h2>
          <div style={s.guaranteeGrid}>
            {[
              { icon: '↩️', title: '30 días de devolución', desc: 'Si no te convence, te devolvemos el 100% del dinero sin hacer preguntas. Así de simple.' },
              { icon: '🚚', title: 'Envío garantizado', desc: 'Entrega en 24-48 horas con seguimiento en tiempo real. Si no llega, te lo reenviamos gratis.' },
              { icon: '🔒', title: 'Pago 100% seguro', desc: 'Encriptación SSL de 256 bits. Tus datos nunca se comparten. Aceptamos todos los medios de pago.' },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} style={s.guarCard}>
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

      {/* FAQ */}
      <section style={s.sectionGray}>
        <div style={s.secInner}>
          <p style={{ ...s.label, textAlign: 'center' }}>Preguntas frecuentes</p>
          <h2 style={{ ...s.title, textAlign: 'center' }}>Todo lo que<br />necesitas <span style={s.gradient}>saber</span></h2>
          <div style={s.faqList}>
            {FAQS.map((item, i) => (
              <div key={i} style={s.faqItem}>
                <div style={s.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {item.q}
                  <span style={{ fontSize: '18px', color: '#9ca3af', display: 'inline-block', transition: 'transform 0.25s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </div>
                {openFaq === i && <div style={s.faqA}>{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={s.nlSection}>
        <div style={s.nlInner}>
          <p style={{ ...s.label, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Newsletter</p>
          <h2 style={s.nlH2}>Ofertas antes<br />que <span style={s.gradient}>nadie</span></h2>
          <p style={s.nlSub}>Suscríbete y recibe descuentos exclusivos, lanzamientos y acceso anticipado a las mejores ofertas de gadgets IA.</p>
          <div style={s.nlForm}>
            <input
              style={s.nlInput}
              type="email"
              value={nlEmail}
              onChange={e => setNlEmail(e.target.value)}
              placeholder="tu@email.com"
            />
            <button style={s.nlBtn}>Suscribirse →</button>
          </div>
          <p style={s.nlDisclaimer}>Sin spam. Puedes cancelar cuando quieras.</p>
        </div>
      </section>

      {/* INFOGRAFÍA */}
      <section style={s.infoSection}>
        <div style={s.infoWrap}>
          <p style={{ ...s.label, color: '#66AAFF' }}>Simple y rápido</p>
          <h2 style={{ ...s.title, color: '#fff' }}>De la tienda a tus manos<br /><span style={s.gradient}>en 4 pasos</span></h2>
          <div style={s.stepsRow}>
            {[
              { n: '01', icon: '🔍', t: 'Exploras', d: 'Navega el catálogo IA y encuentra el gadget ideal para ti.' },
              { n: '02', icon: '🛒', t: 'Compras', d: 'Pago seguro con SSL. Visa, Mastercard, PayPal y más.' },
              { n: '03', icon: '📦', t: 'Despachamos', d: 'En 24h hábiles tu pedido sale con número de seguimiento.' },
              { n: '04', icon: '🚀', t: 'Activa la IA', d: 'Lo recibes, lo activas y el gadget empieza a aprender de ti.' },
            ].map((step, i) => (
              <div key={i} style={s.stepOuter}>
                <div style={s.stepItem}>
                  <div style={s.stepNum}>{step.n}</div>
                  <div style={s.stepIcon}>{step.icon}</div>
                  <p style={s.stepTitle}>{step.t}</p>
                  <p style={s.stepDesc}>{step.d}</p>
                </div>
                {i < 3 && <div style={s.stepConnector}><div style={s.stepLine} /><span style={s.stepArrow}>→</span></div>}
              </div>
            ))}
          </div>
          <div style={s.infoStats}>
            {[
              { val: '$420B', label: 'Mercado IA gadgets 2025' },
              { val: '73%',  label: 'Mejoran su productividad' },
              { val: '2.3×', label: 'Mayor satisfacción vs normal' },
              { val: '89%',  label: 'Recompraría en ConAI' },
            ].map(({ val, label }, i) => (
              <div key={i} style={s.infoStat}>
                <span style={s.infoStatVal}>{val}</span>
                <span style={s.infoStatLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={s.ctaFinal}>
        <div style={s.ctaGlow} />
        <h2 style={s.ctaH2}>COMPRA<br />EL <em style={s.ctaEm}>FUTURO</em><br />HOY</h2>
        <p style={s.ctaSub}>Gadgets con inteligencia artificial al mejor precio de Latinoamérica. Envío garantizado en 24h.</p>
        <div style={s.ctaBtnRow}>
          <Link to="/productos" style={s.ctaBtnMain}>Ver catálogo completo →</Link>
          <Link to="/productos" style={s.ctaBtnGhost}>Ver ofertas del día</Link>
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
  hero: {
    background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center',
    position: 'relative', overflow: 'hidden', padding: '80px 5%',
  },
  heroGlow: {
    position: 'absolute', width: '700px', height: '700px',
    background: 'radial-gradient(circle,rgba(26,111,255,0.15) 0%,transparent 65%)',
    borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-10%,-50%)', pointerEvents: 'none',
  },
  heroGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
    backgroundSize: '60px 60px', pointerEvents: 'none',
  },
  heroInner: {
    maxWidth: '1100px', margin: '0 auto', width: '100%',
    display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '48px',
    position: 'relative', zIndex: 1,
  },
  heroLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1A6FFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  heroDot:   { width: '6px', height: '6px', background: '#1A6FFF', borderRadius: '50%', display: 'inline-block' },
  heroH1:    { fontSize: 'clamp(48px,6.5vw,86px)', fontWeight: 900, lineHeight: 0.93, letterSpacing: '-4px', color: '#fff', marginBottom: '24px' },
  heroEm:    { fontStyle: 'normal', background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub:   { fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: '380px', marginBottom: '28px' },

  heroCountdown: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '14px 18px', display: 'inline-flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  cdLabel:  { fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' },
  cdBlocks: { display: 'flex', alignItems: 'center', gap: '6px' },
  cdBlock:  { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '7px 13px', minWidth: '52px' },
  cdNum:    { fontSize: '26px', fontWeight: 900, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  cdUnit:   { fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' },
  cdSep:    { fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.3)' },

  heroStock: { marginBottom: '20px' },
  stockTop:  { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  stockLbl:  { fontSize: '12px', fontWeight: 700, color: '#fca5a5' },
  stockNum:  { fontSize: '12px', color: 'rgba(255,255,255,0.35)' },
  stockBar:  { height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' },
  stockFill: { height: '100%', width: '23%', background: 'linear-gradient(90deg,#ef4444,#f97316)', borderRadius: '99px' },

  heroPriceRow: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' },
  priceOld:  { fontSize: '18px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', fontWeight: 500 },
  priceNew:  { fontSize: '54px', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1 },
  priceDisc: { background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '99px' },

  heroBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' },
  btnBlue:  { background: '#1A6FFF', color: '#fff', padding: '15px 36px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' },
  btnGhost: { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 28px', borderRadius: '99px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' },

  heroTrust:     { display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' },
  heroTrustItem: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 },
  heroPayIcons:  { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  payIcon:       { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' },

  heroRight:  { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroImg:    { width: '420px', height: '520px', objectFit: 'cover', borderRadius: '32px', display: 'block' },
  heroFloatA: { position: 'absolute', top: '28px', right: '-28px', background: 'rgba(255,255,255,0.96)', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' },
  floatDot:   { width: '7px', height: '7px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px rgba(34,197,94,0.8)', flexShrink: 0 },
  floatText:  { fontSize: '12px', fontWeight: 700, color: '#0a0a0f' },
  heroFloatB: { position: 'absolute', bottom: '28px', left: '-36px', background: 'rgba(255,255,255,0.96)', borderRadius: '12px', padding: '12px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', maxWidth: '200px' },
  fbText:     { fontSize: '11px', color: '#374151', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '6px' },
  fbName:     { fontSize: '10px', fontWeight: 700, color: '#0a0a0f' },

  /* ── STATS BAND ── */
  statsBand: { background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '44px 5%', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', maxWidth: '100%' },
  statItem:  { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '0 20px' },
  statNum:   { fontSize: '44px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1, color: '#0a0a0f' },
  statGrad:  { background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  statLabel: { fontSize: '13px', color: '#9ca3af', fontWeight: 500, textAlign: 'center' },

  /* ── SECTION COMMONS ── */
  section:     { padding: '80px 5%', background: '#ffffff' },
  sectionGray: { padding: '80px 5%', background: '#f8f9fa' },
  sectionDark: { padding: '80px 5%', background: '#0a0a0f' },
  secInner:    { maxWidth: '1100px', margin: '0 auto' },
  label:       { fontSize: '11px', color: '#1A6FFF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' },
  title:       { fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.08, color: '#0a0a0f', marginBottom: '14px' },
  sub:         { fontSize: '16px', color: '#6b7280', maxWidth: '520px', lineHeight: 1.65, marginBottom: '48px' },
  gradient:    { background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'inherit' },

  /* ── CATEGORIES ── */
  catGrid:    { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginTop: '40px' },
  catCard:    { position: 'relative', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', display: 'block', textDecoration: 'none' },
  catImg:     { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  catOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(5,5,8,0.75) 0%,rgba(5,5,8,0.1) 60%)' },
  catContent: { position: 'absolute', bottom: 0, left: 0, padding: '20px' },
  catName:    { fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', marginBottom: '4px' },
  catCount:   { fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 },
  catArrow:   { position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: '99px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#fff' },

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
  bundleGrid:    { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px', marginTop: '0' },
  bundleCard:    { background: '#fff', borderRadius: '24px', border: '2px solid #e5e7eb', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' },
  bundleProducts:{ display: 'flex', alignItems: 'center', gap: '12px' },
  bundleProdImg: { width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', background: '#f5f5f7', flexShrink: 0, display: 'block' },
  bundlePlus:    { fontSize: '20px', fontWeight: 700, color: '#9ca3af' },
  bundleName:    { fontSize: '16px', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.3px', marginBottom: '6px' },
  bundleIncludes:{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5 },
  bundlePriceRow:{ display: 'flex', alignItems: 'center', gap: '12px' },
  bundleOrig:    { fontSize: '15px', color: '#9ca3af', textDecoration: 'line-through' },
  bundlePrice:   { fontSize: '32px', fontWeight: 900, color: '#0a0a0f', letterSpacing: '-1px' },
  bundleSave:    { fontSize: '12px', fontWeight: 800, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '4px 12px', borderRadius: '99px' },
  bundleBtn:     { background: '#0a0a0f', color: '#fff', padding: '13px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'block' },
  bundlePopBadge:{ position: 'absolute', top: 0, right: '24px', background: '#1A6FFF', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '5px 14px', borderRadius: '0 0 10px 10px', letterSpacing: '0.06em' },

  /* ── BANNER ── */
  banner:        { position: 'relative', height: '520px', overflow: 'hidden' },
  bannerImg:     { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  bannerOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(5,5,8,0.88) 0%,rgba(5,5,8,0.45) 55%,transparent 100%)' },
  bannerContent: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 8%' },
  bannerChip:    { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#66AAFF', marginBottom: '16px', display: 'block' },
  bannerH2:      { fontSize: 'clamp(36px,5vw,68px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 0.95, color: '#fff', marginBottom: '20px' },
  bannerSub:     { fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '32px' },
  bannerBtn:     { background: '#fff', color: '#0a0a0f', padding: '14px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' },

  /* ── BEFORE / AFTER ── */
  baGrid:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: '24px', overflow: 'hidden', marginTop: '48px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },
  baColBefore:  { padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8f9fa', borderRight: '2px solid #e5e7eb' },
  baColAfter:   { padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#0a0a0f' },
  baHeader:     { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  baLabelBefore:{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' },
  baLabelAfter: { fontSize: '13px', fontWeight: 700, color: '#66AAFF', textTransform: 'uppercase', letterSpacing: '0.08em' },
  baItems:      { display: 'flex', flexDirection: 'column', gap: '14px' },
  baItemBefore: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', lineHeight: 1.5, color: '#6b7280' },
  baItemAfter:  { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', lineHeight: 1.5, color: 'rgba(255,255,255,0.75)' },
  baX:          { fontSize: '16px', color: '#ef4444', flexShrink: 0 },
  baCheck:      { fontSize: '16px', color: '#1A6FFF', flexShrink: 0 },

  /* ── DEALS ── */
  dealsHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  dealsH2:     { fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-1.5px', color: '#fff' },
  dealsCd:     { display: 'flex', alignItems: 'center', gap: '6px' },
  dcBlock:     { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 14px', minWidth: '58px' },
  dcNum:       { fontSize: '30px', fontWeight: 900, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  dcUnit:      { fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' },
  dcSep:       { fontSize: '22px', fontWeight: 700, color: 'rgba(255,255,255,0.25)' },
  dealsTrack:  { display: 'flex', gap: '14px', paddingBottom: '8px' },
  dealCard:    { flex: '0 0 220px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', textDecoration: 'none', display: 'block' },
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
  quizProgDot:    { height: '4px', flex: 1, borderRadius: '99px', transition: 'background 0.3s' },
  quizQ:          { fontSize: '22px', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.5px', marginBottom: '8px' },
  quizSub:        { fontSize: '14px', color: '#9ca3af', marginBottom: '28px' },
  quizOptions:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  quizOpt:        { border: '2px solid #e5e7eb', borderRadius: '14px', padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600, color: '#374151' },
  quizResultLabel:{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A6FFF', marginBottom: '12px' },
  quizResultImg:  { width: '160px', height: '160px', objectFit: 'cover', borderRadius: '20px', margin: '0 auto 20px', display: 'block' },
  quizResultName: { fontSize: '22px', fontWeight: 800, color: '#0a0a0f', marginBottom: '8px' },
  quizResultDesc: { fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '24px' },
  quizResultPrice:{ fontSize: '36px', fontWeight: 900, color: '#0a0a0f', marginBottom: '20px' },
  quizResultBtn:  { background: '#1A6FFF', color: '#fff', padding: '14px 36px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginBottom: '12px' },
  quizRestart:    { fontSize: '13px', color: '#9ca3af', cursor: 'pointer', textDecoration: 'underline', display: 'block', marginTop: '8px' },

  /* ── REVIEWS MASONRY ── */
  reviewsGrid: { columnCount: 3, columnGap: '14px', marginTop: '48px' },
  revCard:     { breakInside: 'avoid', background: '#fff', borderRadius: '16px', padding: '22px', marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.06)', display: 'inline-block', width: '100%', boxSizing: 'border-box' },
  revText:     { fontSize: '14px', color: '#374151', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '14px' },
  revAuthor:   { display: 'flex', alignItems: 'center', gap: '10px' },
  revAv:       { width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 },
  revName:     { fontSize: '13px', fontWeight: 700, color: '#0a0a0f', margin: 0 },
  revCity:     { fontSize: '11px', color: '#9ca3af', margin: 0 },
  revVerified: { fontSize: '10px', color: '#22c55e', fontWeight: 600, margin: 0 },

  /* ── GUARANTEES ── */
  guaranteeGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginTop: '48px' },
  guarCard:      { background: '#f8f9fa', borderRadius: '20px', padding: '32px 28px', textAlign: 'center', border: '1px solid #e5e7eb' },
  guarIcon:      { fontSize: '44px', marginBottom: '18px' },
  guarTitle:     { fontSize: '18px', fontWeight: 800, color: '#0a0a0f', letterSpacing: '-0.3px', marginBottom: '10px' },
  guarDesc:      { fontSize: '14px', color: '#6b7280', lineHeight: 1.65 },
  payBand:       { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '36px', paddingTop: '36px', borderTop: '1px solid #e5e7eb' },
  payChip:       { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, color: '#374151' },

  /* ── FAQ ── */
  faqList: { display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '760px', margin: '48px auto 0' },
  faqItem: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden' },
  faqQ:    { padding: '20px 24px', fontSize: '15px', fontWeight: 700, color: '#0a0a0f', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', userSelect: 'none' },
  faqA:    { padding: '16px 24px 20px', fontSize: '14px', color: '#6b7280', lineHeight: 1.7, borderTop: '1px solid #f0f0f0' },

  /* ── NEWSLETTER ── */
  nlSection:    { background: 'linear-gradient(135deg,#0a0a0f 0%,#0e1628 100%)', padding: '80px 5%' },
  nlInner:      { maxWidth: '560px', margin: '0 auto', textAlign: 'center' },
  nlH2:         { fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.08, color: '#fff', marginBottom: '12px' },
  nlSub:        { fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: '32px' },
  nlForm:       { display: 'flex', gap: '8px', maxWidth: '440px', margin: '0 auto 16px' },
  nlInput:      { flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '99px', padding: '14px 20px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'inherit' },
  nlBtn:        { background: '#1A6FFF', color: '#fff', padding: '14px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: 'inherit', flexShrink: 0 },
  nlDisclaimer: { fontSize: '11px', color: 'rgba(255,255,255,0.25)' },

  /* ── INFOGRAFÍA ── */
  infoSection: { padding: '80px 5%', background: '#050508', overflow: 'hidden' },
  infoWrap:    { maxWidth: '1100px', margin: '0 auto' },
  stepsRow:    { display: 'flex', alignItems: 'flex-start', gap: 0, marginTop: '56px', marginBottom: '72px', flexWrap: 'wrap' },
  stepOuter:   { display: 'flex', alignItems: 'center', flex: '1 1 180px', minWidth: 0 },
  stepItem:    { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, padding: '0 8px' },
  stepNum:     { fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', color: '#1A6FFF', marginBottom: '14px' },
  stepIcon:    { fontSize: '40px', marginBottom: '16px', background: 'rgba(26,111,255,0.1)', border: '1px solid rgba(26,111,255,0.2)', borderRadius: '20px', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepTitle:   { fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', margin: '0 0 8px 0' },
  stepDesc:    { fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0, maxWidth: '160px' },
  stepConnector:{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '0 4px', flexShrink: 0, marginTop: '-36px' },
  stepLine:    { width: '32px', height: '1px', background: 'rgba(26,111,255,0.3)' },
  stepArrow:   { fontSize: '14px', color: 'rgba(26,111,255,0.5)', lineHeight: 1 },
  infoStats:   { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' },
  infoStat:    { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px', background: 'rgba(255,255,255,0.02)', gap: '8px', textAlign: 'center' },
  infoStatVal: { fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1, background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  infoStatLabel:{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, lineHeight: 1.4 },

  /* ── CTA FINAL ── */
  ctaFinal:   { background: '#050508', padding: '120px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '28px', position: 'relative', overflow: 'hidden' },
  ctaGlow:    { position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(26,111,255,0.1) 0%,transparent 65%)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' },
  ctaH2:      { fontSize: 'clamp(60px,11vw,130px)', fontWeight: 900, letterSpacing: '-6px', lineHeight: 0.88, color: '#fff', position: 'relative', zIndex: 1, margin: 0 },
  ctaEm:      { fontStyle: 'normal', background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  ctaSub:     { fontSize: '18px', color: 'rgba(255,255,255,0.35)', maxWidth: '420px', lineHeight: 1.6, position: 'relative', zIndex: 1 },
  ctaBtnRow:  { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 },
  ctaBtnMain: { background: '#1A6FFF', color: '#fff', padding: '17px 48px', borderRadius: '99px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' },
  ctaBtnGhost:{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', padding: '16px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' },
}

export default Home
