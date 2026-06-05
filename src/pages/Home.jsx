import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

const HERO = {
  title: 'Auriculares IA',
  sub: 'que se adaptan a ti',
  img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=85',
  originalPrice: '$89',
  price: '$49',
  discount: '-45%',
  cta1Label: 'Comprar ahora →',
  cta1To: '/productos?cat=auriculares',
  cta2Label: 'Ver todo el catálogo',
  cta2To: '/productos',
}


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

// Efecto 18: title scrambles with random chars before revealing
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

// Efecto 14: subtitle fades in from blurry to sharp on each slide change
function useBlurIn(trigger) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(false)
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [trigger])
  return {
    opacity: ready ? 1 : 0,
    filter: ready ? 'blur(0px)' : 'blur(18px)',
    transition: 'opacity 0.65s ease, filter 0.65s ease',
  }
}

// Efecto 16: trigger once when section enters viewport
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

function Home() {
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [deals, setDeals] = useState([])
  const [time, setTime] = useState(2 * 3600 + 34 * 60 + 18)

  const [dealsRef, dealsVisible] = useReveal()
  const [prodsRef, prodsVisible] = useReveal()
  const [featRef, featVisible] = useReveal()
  const [bentoRef, bentoVisible] = useReveal()
  const [testiRef, testiVisible] = useReveal()

  const scrambledTitle = useTextScramble(HERO.title, 0)
  const blurStyle = useBlurIn(0)

  useEffect(() => {
    async function fetchData() {
      const { data: viral } = await supabase.from('products').select('*').eq('viral', true).limit(12)
      const all = viral || []
      setTrending(all.slice(0, 4))
      setFeatured(all.slice(0, 6))
      setDeals(all.slice(2, 6))
    }
    fetchData()
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTime(prev => prev > 0 ? prev - 1 : 0), 1000)
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
        <meta name="description" content="Descubrí los mejores gadgets con IA: auriculares, wearables, dispositivos de salud y más. Envío gratis en pedidos +$50 USD." />
        <meta property="og:title" content="ConAI — Gadgets con Inteligencia Artificial" />
        <meta property="og:description" content="Descubrí los mejores gadgets con IA. Envío gratis en pedidos +$50 USD." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://conai.vercel.app/" />
        <link rel="canonical" href="https://conai.vercel.app/" />
      </Helmet>

      {/* HERO */}
      <section style={s.heroWrap}>
        <div style={s.heroInner}>

          {/* LEFT */}
          <div style={s.heroLeft}>
            <div style={s.heroChipRow}>
              <span style={s.heroChip}>Auriculares IA</span>
              <span style={s.heroBestChip}>⭐ Más vendido</span>
            </div>

            <h1 style={s.heroTitle}>
              {scrambledTitle}<br />
              <span style={{ ...s.gradient, ...blurStyle }}>{HERO.sub}</span>
            </h1>

            <p style={s.heroFeatures}>IA adaptativa al entorno &nbsp;·&nbsp; 30h de batería &nbsp;·&nbsp; Cancelación activa de ruido</p>

            <div style={s.heroRatingRow}>
              <span style={s.heroStars}>⭐⭐⭐⭐⭐</span>
              <span style={s.heroRatingNum}>4.9</span>
              <span style={s.heroRatingCount}>2,847 reseñas verificadas</span>
            </div>

            <div style={s.heroDivider} />

            <div style={s.priceRow}>
              <span style={s.priceOld}>{HERO.originalPrice}</span>
              <span style={s.heroPriceDark}>{HERO.price}</span>
              <span style={s.discountBadge}>{HERO.discount}</span>
            </div>

            <div style={s.heroBtns}>
              <Link to={HERO.cta1To} style={s.heroBtnDark}>{HERO.cta1Label}</Link>
              <Link to={HERO.cta2To} style={s.heroBtnGhost}>{HERO.cta2Label}</Link>
            </div>

            <div style={s.heroTrustRow}>
              {['🚚 Envío gratis', '↩️ 30 días', '🔒 Pago seguro'].map((t, i) => (
                <span key={t} style={s.heroTrustItem}>
                  {i > 0 && <span style={s.heroTrustSep}>·</span>}
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={s.heroRight}>
            <div style={s.heroImgCard}>
              <img src={HERO.img} alt="Auriculares IA" style={s.heroImg} />
            </div>
          </div>

        </div>
      </section>

      {/* TRENDING GRID */}
      <section style={s.sectionBento}>
        <p style={s.label}>Trending ahora</p>
        <h2 style={s.title}>Lo que todos <span style={s.gradient}>están comprando</span></h2>
        <p style={s.sub}>Gadgets IA seleccionados — los más buscados de esta semana.</p>
        <div ref={bentoRef} className="scroll-track" style={s.scrollTrack}>
          {trending.map((prod, i) => (
            <Link
              key={prod.id}
              to={`/producto/${prod.id}`}
              className="card-hover"
              style={{
                ...s.appleCard,
                opacity: bentoVisible ? 1 : 0,
                transform: bentoVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.45s ease ${i * 0.06}s, transform 0.45s ease ${i * 0.06}s`,
              }}
            >
              <div style={s.appleCardTop}>
                <span style={s.appleChip}>{prod.category.toUpperCase()}</span>
                <span style={{ ...s.appleBadge, background: '#f59e0b' }}>TRENDING</span>
              </div>
              <div style={s.appleImgWrap}>
                <img src={prod.image_url || getCategoryImg(prod.category)} alt={prod.name} style={s.appleImg} />
              </div>
              <div style={s.appleInfo}>
                <p style={s.appleName}>{prod.name}</p>
                <div style={s.appleBottom}>
                  <span style={s.applePrice}>${prod.price}</span>
                  <span style={s.appleCta}>Ver →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section style={s.section}>
        <p style={s.label}>Más vendidos</p>
        <h2 style={s.title}>Productos <span style={s.gradient}>Destacados</span></h2>
        <p style={s.sub}>Los gadgets IA con mayor demanda y mejores márgenes.</p>
        <div ref={prodsRef} className="scroll-track" style={s.scrollTrack}>
          {featured.map((prod, i) => (
            <Link
              key={prod.id}
              to={`/producto/${prod.id}`}
              className="card-hover"
              style={{
                ...s.appleCard,
                opacity: prodsVisible ? 1 : 0,
                transform: prodsVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.45s ease ${i * 0.09}s, transform 0.45s ease ${i * 0.09}s`,
              }}
            >
              <div style={s.appleCardTop}>
                <span style={s.appleChip}>{prod.category.toUpperCase()}</span>
              </div>
              <div style={s.appleImgWrap}>
                <img
                  src={prod.image_url || getCategoryImg(prod.category)}
                  alt={prod.name}
                  style={s.appleImg}
                />
              </div>
              <div style={s.appleInfo}>
                <p style={s.appleName}>{prod.name}</p>
                <p style={s.appleDesc}>{prod.description}</p>
                <div style={s.appleBottom}>
                  <span style={s.applePrice}>${prod.price}</span>
                  <span style={s.appleCta}>Ver →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/productos" style={s.btnPrimary}>Ver todos los productos →</Link>
        </div>
      </section>

      {/* OFERTAS */}
      <section style={s.sectionGray}>
        <p style={s.label}>Solo por hoy</p>
        <h2 style={s.title}>Ofertas <span style={s.gradient}>del día</span></h2>
        <p style={s.sub}>Descuentos limitados en los gadgets más populares.</p>
        <div ref={dealsRef} className="scroll-track" style={s.scrollTrack}>
          {deals.map((prod, i) => (
            <Link key={prod.id} to={`/producto/${prod.id}`} className="card-hover" style={{
              ...s.appleCard,
              opacity: dealsVisible ? 1 : 0,
              transform: dealsVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.45s ease ${i * 0.06}s, transform 0.45s ease ${i * 0.06}s`,
            }}>
              <div style={s.appleCardTop}>
                <span style={s.appleChip}>{prod.category.toUpperCase()}</span>
                <span style={{ ...s.appleBadge, background: '#ef4444' }}>OFERTA</span>
              </div>
              <div style={s.appleImgWrap}>
                <img src={prod.image_url || getCategoryImg(prod.category)} alt={prod.name} style={s.appleImg} />
              </div>
              <div style={s.appleInfo}>
                <p style={s.appleName}>{prod.name}</p>
                <div style={s.appleBottom}>
                  <span style={s.applePrice}>${prod.price}</span>
                  <span style={s.appleCta}>Ver →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section style={s.section}>
        <p style={s.label}>Clientes reales</p>
        <h2 style={s.title}>Lo que dicen <span style={s.gradient}>nuestros clientes</span></h2>
        <p style={s.sub}>Más de 12.000 personas ya eligieron ConAI en Latinoamérica.</p>
        <div ref={testiRef} style={s.testiGrid}>
          {[
            { name: 'María S.', city: 'Santiago, Chile', text: 'Llegó en 2 días, impecable. Los auriculares superaron mis expectativas. La calidad del sonido con IA es increíble.', avatar: 'MS' },
            { name: 'Carlos R.', city: 'Bogotá, Colombia', text: 'Compré el SmartWatch para mi trabajo y es un cambio total. El proceso de compra fue súper fácil y el envío muy rápido.', avatar: 'CR' },
            { name: 'Ana L.', city: 'Ciudad de México', text: 'Lo compré para mi hijo y le encantó. La atención es excelente y el producto exactamente como se describe. 10/10.', avatar: 'AL' },
            { name: 'Diego M.', city: 'Lima, Perú', text: 'Ya es mi tercera compra en ConAI. Siempre llega rápido y los productos son de primera calidad. 100% recomendado.', avatar: 'DM' },
          ].map(({ name, city, text, avatar }, i) => (
            <div key={name} style={{
              ...s.testiCard,
              opacity: testiVisible ? 1 : 0,
              transform: testiVisible ? 'translateY(0)' : 'translateY(28px)',
              transition: `opacity 0.55s ease ${i * 0.08}s, transform 0.55s ease ${i * 0.08}s`,
            }}>
              <div style={s.testiStars}>⭐⭐⭐⭐⭐</div>
              <p style={s.testiText}>"{text}"</p>
              <div style={s.testiAuthor}>
                <div style={s.testiAvatar}>{avatar}</div>
                <div>
                  <p style={s.testiName}>{name}</p>
                  <p style={s.testiCity}>{city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={s.section}>
        <p style={s.label}>¿Por qué ConAI?</p>
        <h2 style={s.title}>Tu tienda IA de <span style={s.gradient}>confianza</span></h2>
        <div ref={featRef} className="scroll-track" style={s.scrollTrack}>
          {[
            { icon: '🤖', t: '100% Productos IA', d: 'Cada producto está seleccionado por su integración real con inteligencia artificial.' },
            { icon: '🚚', t: 'Envío Rápido', d: 'Despacho en 24-48h con proveedores verificados y seguimiento en tiempo real.' },
            { icon: '🔒', t: 'Compra Segura', d: 'Pago 100% seguro con encriptación SSL y garantía de devolución de 30 días.' },
            { icon: '🌟', t: 'Soporte 24/7', d: 'Asistente IA + chat en vivo disponibles en todo momento.' },
          ].map((f, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                ...s.appleCard,
                flex: '0 0 220px',
                opacity: featVisible ? 1 : 0,
                transform: featVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.45s ease ${i * 0.1}s, transform 0.45s ease ${i * 0.1}s`,
              }}
            >
              <div style={s.appleFeatIcon}>{f.icon}</div>
              <p style={s.appleFeatTitle}>{f.t}</p>
              <p style={s.appleFeatDesc}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INFOGRAFÍA — Cómo funciona */}
      <section style={s.infoSection}>
        <div style={s.infoWrap}>
          <p style={{ ...s.label, color: '#66AAFF' }}>Simple y rápido</p>
          <h2 style={{ ...s.title, color: '#fff' }}>De la tienda a tus manos<br /><span style={s.gradient}>en 4 pasos</span></h2>
          <div style={s.stepsRow}>
            {[
              { n: '01', icon: '🔍', t: 'Explorás', d: 'Navegás el catálogo IA y encontrás el gadget ideal para vos.' },
              { n: '02', icon: '🛒', t: 'Comprás', d: 'Pago seguro con SSL. Visa, Mastercard, PayPal y más.' },
              { n: '03', icon: '📦', t: 'Despachamos', d: 'En 24h hábiles tu pedido sale con número de seguimiento.' },
              { n: '04', icon: '🚀', t: 'Activás la IA', d: 'Lo recibís, lo activás y el gadget empieza a aprender de vos.' },
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
              { val: '73%', label: 'Mejoran su productividad' },
              { val: '2.3×', label: 'Mayor satisfacción vs normal' },
              { val: '89%', label: 'Recompraría en ConAI' },
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
      <section style={s.ctaWrap}>
        <div style={s.heroBlobA} />
        <div style={s.heroBlobB} />
        <div style={s.ctaInner}>
          <div style={s.ctaLeft}>
            <p style={{ ...s.label, color: '#66AAFF' }}>Tu momento es ahora</p>
            <h2 style={s.ctaTitle}>¿Listo para tu<br />primer gadget IA?</h2>
            <ul style={s.ctaList}>
              {[
                '🚚 Envío en 24-48h garantizado',
                '↩️ 30 días de devolución sin preguntas',
                '⭐ +12.000 clientes satisfechos',
                '🔒 Pago 100% seguro con SSL',
              ].map(item => (
                <li key={item} style={s.ctaItem}>{item}</li>
              ))}
            </ul>
            <Link to="/productos" style={s.btnPrimary}>Ver catálogo completo →</Link>
          </div>
          {star && (
            <Link to={`/producto/${star.id}`} className="card-hover" style={s.ctaCard}>
              <img
                src={star.image_url || getCategoryImg(star.category)}
                alt={star.name}
                style={s.ctaCardImg}
              />
              <div style={s.ctaCardInfo}>
                <p style={s.ctaCardCat}>{star.category.toUpperCase()}</p>
                <p style={s.ctaCardName}>{star.name}</p>
                <div style={s.ctaCardPriceRow}>
                  <span style={s.ctaCardPrice}>${star.price}</span>
                  <span style={s.ctaCardBadge}>⭐ Más vendido</span>
                </div>
                <div style={s.ctaCardBtn}>Comprar ahora →</div>
              </div>
            </Link>
          )}
        </div>
      </section>

    </div>
  )
}

const s = {
  heroWrap: {
    background: '#f5f5f7',
    minHeight: '680px',
    display: 'flex',
    alignItems: 'center',
    padding: '80px 5%',
    overflow: 'hidden',
  },
  heroBlobA: {
    position: 'absolute',
    width: '520px',
    height: '520px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(26,111,255,0.13) 0%, transparent 70%)',
    top: '-100px',
    right: '12%',
    pointerEvents: 'none',
  },
  heroBlobB: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102,170,255,0.08) 0%, transparent 70%)',
    bottom: '-60px',
    left: '4%',
    pointerEvents: 'none',
  },
  heroInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '64px',
    maxWidth: '1100px',
    width: '100%',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '24px',
    flex: '1 1 400px',
    minWidth: 0,
  },
  heroRight: {
    flex: '0 0 420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImgCard: {
    borderRadius: '28px',
    overflow: 'hidden',
    width: '100%',
    aspectRatio: '4/5',
    boxShadow: '0 24px 64px rgba(0,0,0,0.1)',
    background: '#e8e8ed',
  },
  heroChipRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  heroChip: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#1A6FFF',
    background: 'rgba(26,111,255,0.1)',
    padding: '6px 14px',
    borderRadius: '99px',
    letterSpacing: '0.04em',
  },
  heroBestChip: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#0a0a0f',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    padding: '6px 14px',
    borderRadius: '99px',
  },
  heroTitle: {
    fontSize: 'clamp(44px, 6vw, 84px)',
    fontWeight: 900,
    lineHeight: 0.96,
    letterSpacing: '-3.5px',
    color: '#0a0a0f',
    margin: 0,
    fontFamily: 'inherit',
  },
  heroFeatures: {
    fontSize: '15px',
    color: '#6b7280',
    fontWeight: 500,
    margin: 0,
    lineHeight: 1.6,
  },
  heroRatingRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  heroStars: { fontSize: '16px', letterSpacing: '1px' },
  heroRatingNum: { fontSize: '16px', fontWeight: 800, color: '#0a0a0f' },
  heroRatingCount: { fontSize: '14px', color: '#6b7280', fontWeight: 500 },
  heroDivider: { width: '100%', height: '1px', background: '#e5e7eb' },
  heroPriceDark: {
    fontSize: '48px',
    fontWeight: 800,
    color: '#0a0a0f',
    lineHeight: 1,
  },
  heroBtnDark: {
    background: '#0a0a0f',
    color: '#ffffff',
    padding: '16px 36px',
    borderRadius: '99px',
    fontSize: '15px',
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-block',
    letterSpacing: '-0.2px',
  },
  heroBtnGhost: {
    background: 'transparent',
    color: '#0a0a0f',
    border: '1.5px solid #0a0a0f',
    padding: '15px 32px',
    borderRadius: '99px',
    fontSize: '15px',
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-block',
  },
  heroTrustRow: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  heroTrustItem: { fontSize: '13px', color: '#6b7280', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' },
  heroTrustSep: { color: '#d1d5db' },
  socialProofRow: { fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' },
  slideBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '99px', padding: '6px 16px', fontSize: '13px', fontWeight: 700, background: 'rgba(239,68,68,0.18)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.35)' },
  gradient: {
    background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: 'inherit',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  priceOld: {
    fontSize: '20px',
    color: '#9ca3af',
    textDecoration: 'line-through',
    fontWeight: 500,
  },
  priceBig: {
    fontSize: '44px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1,
  },
  discountBadge: {
    background: '#ef4444',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 800,
    padding: '5px 14px',
    borderRadius: '99px',
  },
  countdown: {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '8px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '14px',
    padding: '14px 20px',
    backdropFilter: 'blur(8px)',
  },
  countdownLabel: { fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' },
  countdownBlocks: { display: 'flex', alignItems: 'center', gap: '6px' },
  countdownBlock: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: '6px 12px', minWidth: '52px',
  },
  countdownNum: { fontSize: '26px', fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 },
  countdownUnit: { fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: '3px', textTransform: 'uppercase' },
  heroBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  btnPrimary: {
    background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)',
    color: '#fff',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '99px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  btnOutline: {
    background: 'rgba(255,255,255,0.12)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '14px 32px',
    borderRadius: '99px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    backdropFilter: 'blur(8px)',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  discountPill: {
    position: 'absolute',
    top: '-14px',
    right: '-14px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 800,
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    boxShadow: '0 4px 20px rgba(239,68,68,0.45)',
    letterSpacing: '-0.5px',
  },
  trustBar: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  trustItem: { fontSize: '12px', color: '#6b7280', fontWeight: 500 },

  // Avatar row
  avatarRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatarCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)',
    border: '2px solid #0a1628',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },
  avatarLabel: { display: 'flex', flexDirection: 'column', gap: '2px' },
  avatarStars: { fontSize: '12px', lineHeight: 1 },
  avatarCount: { fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 },

  // Stock bar
  stockWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '12px',
    padding: '12px 16px',
  },
  stockTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  stockLabel: { fontSize: '13px', fontWeight: 700, color: '#fca5a5' },
  stockCount: { fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' },
  stockBar: { height: '6px', borderRadius: '99px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  stockFill: { height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #ef4444, #f97316)', transition: 'width 1s ease' },

  // Floating review card
  floatReview: {
    position: 'absolute',
    bottom: '-20px',
    left: '-30px',
    background: 'rgba(255,255,255,0.96)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    padding: '14px 16px',
    width: '230px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    zIndex: 2,
  },
  floatReviewTop: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  floatAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    flexShrink: 0,
  },
  floatName: { fontSize: '12px', fontWeight: 700, color: '#0a0a0f', margin: 0 },
  floatStars: { fontSize: '11px' },
  floatText: { fontSize: '12px', color: '#374151', lineHeight: 1.5, margin: 0, fontStyle: 'italic' },

  // Floating orders badge
  floatOrders: {
    position: 'absolute',
    top: '-16px',
    right: '-16px',
    background: 'rgba(10,10,15,0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '99px',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 2,
    whiteSpace: 'nowrap',
  },
  floatOrdersDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 8px rgba(34,197,94,0.8)',
    flexShrink: 0,
  },
  section: { padding: '80px 5%', background: '#ffffff' },
  sectionGray: { padding: '80px 5%', background: '#f8f9fa' },
  label: { fontSize: '11px', color: '#1A6FFF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' },
  title: { fontSize: 'clamp(30px,4.5vw,54px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.08, marginBottom: '14px', color: '#0a0a0f' },
  sub: { fontSize: '16px', color: '#6b7280', maxWidth: '520px', lineHeight: 1.65, marginBottom: '48px' },

  // Apple/Linear shared
  scrollTrack: {
    display: 'flex',
    gap: '14px',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    paddingBottom: '8px',
  },
  appleCard: {
    flex: '0 0 240px',
    scrollSnapAlign: 'start',
    background: '#ffffff',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  appleCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
    gap: '8px',
  },
  appleChip: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#1A6FFF',
    background: 'rgba(26,111,255,0.08)',
    padding: '4px 10px',
    borderRadius: '99px',
    letterSpacing: '0.06em',
    flexShrink: 0,
  },
  appleBadge: {
    fontSize: '10px',
    fontWeight: 800,
    color: '#fff',
    padding: '3px 10px',
    borderRadius: '99px',
    flexShrink: 0,
  },
  appleImgWrap: {
    height: '160px',
    borderRadius: '14px',
    overflow: 'hidden',
    background: '#f5f5f7',
    marginBottom: '16px',
  },
  appleImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  appleInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  appleName: { fontSize: '14px', fontWeight: 700, color: '#0a0a0f', lineHeight: 1.35, margin: 0 },
  appleDesc: { fontSize: '12px', color: '#6b7280', lineHeight: 1.5, margin: 0 },
  appleBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px' },
  appleOrig: { fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 },
  applePrice: { fontSize: '18px', fontWeight: 800, color: '#e63946' },
  appleCta: { fontSize: '13px', fontWeight: 600, color: '#1A6FFF' },
  appleFeatIcon: { fontSize: '36px', marginBottom: '16px' },
  appleFeatTitle: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f', margin: '0 0 8px 0' },
  appleFeatDesc: { fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 },

  // Testimonios
  testiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  testiCard: {
    background: '#f8f9fa',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  testiStars: { fontSize: '15px', letterSpacing: '1px' },
  testiText: { fontSize: '14px', color: '#374151', lineHeight: 1.65, fontStyle: 'italic', margin: 0, flex: 1 },
  testiAuthor: { display: 'flex', alignItems: 'center', gap: '12px' },
  testiAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 700,
    flexShrink: 0,
  },
  testiName: { fontSize: '14px', fontWeight: 700, color: '#0a0a0f', margin: 0 },
  testiCity: { fontSize: '12px', color: '#9ca3af', margin: 0 },

  // Infografía
  infoSection: { padding: '80px 5%', background: '#050508', overflow: 'hidden' },
  infoWrap: { maxWidth: '1100px', margin: '0 auto' },
  stepsRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 0,
    marginTop: '56px',
    marginBottom: '72px',
    flexWrap: 'wrap',
  },
  stepOuter: { display: 'flex', alignItems: 'center', flex: '1 1 180px', minWidth: 0 },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
    padding: '0 8px',
  },
  stepNum: {
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '0.14em',
    color: '#1A6FFF',
    marginBottom: '14px',
  },
  stepIcon: {
    fontSize: '40px',
    marginBottom: '16px',
    background: 'rgba(26,111,255,0.1)',
    border: '1px solid rgba(26,111,255,0.2)',
    borderRadius: '20px',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: '17px',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.3px',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  stepDesc: { fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0, maxWidth: '160px' },
  stepConnector: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '0 4px',
    flexShrink: 0,
    marginTop: '-36px',
  },
  stepLine: { width: '32px', height: '1px', background: 'rgba(26,111,255,0.3)' },
  stepArrow: { fontSize: '14px', color: 'rgba(26,111,255,0.5)', lineHeight: 1 },
  infoStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: '1px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  infoStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 20px',
    background: 'rgba(255,255,255,0.02)',
    gap: '8px',
    textAlign: 'center',
  },
  infoStatVal: {
    fontSize: 'clamp(28px,3.5vw,44px)',
    fontWeight: 900,
    letterSpacing: '-2px',
    lineHeight: 1,
    background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  infoStatLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, lineHeight: 1.4 },

  // Trending section bg
  sectionBento: { padding: '80px 5%', background: '#f8f9fa' },

  // CTA Final
  ctaWrap: {
    position: 'relative',
    background: 'linear-gradient(135deg, #060912 0%, #0a1628 55%, #0e0a1e 100%)',
    overflow: 'hidden',
    padding: '80px 5%',
  },
  ctaInner: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '48px',
    maxWidth: '1100px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  ctaLeft: {
    flex: '1 1 380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  ctaTitle: {
    fontSize: 'clamp(28px, 4vw, 50px)',
    fontWeight: 800,
    letterSpacing: '-1.5px',
    lineHeight: 1.15,
    color: '#ffffff',
    margin: 0,
  },
  ctaList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  ctaItem: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.82)',
    fontWeight: 500,
  },
  ctaCard: {
    flex: '0 0 300px',
    background: '#ffffff',
    borderRadius: '20px',
    overflow: 'hidden',
    textDecoration: 'none',
    boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
    display: 'block',
  },
  ctaCardImg: {
    width: '100%',
    height: '210px',
    objectFit: 'cover',
    display: 'block',
  },
  ctaCardInfo: {
    padding: '20px',
  },
  ctaCardCat: { fontSize: '10px', color: '#1A6FFF', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '6px', display: 'block' },
  ctaCardName: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f', marginBottom: '12px', lineHeight: 1.3 },
  ctaCardPriceRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  ctaCardPrice: { fontSize: '22px', fontWeight: 800, color: '#e63946' },
  ctaCardBadge: { fontSize: '11px', background: 'rgba(26,111,255,0.1)', color: '#1A6FFF', padding: '3px 10px', borderRadius: '99px', fontWeight: 600 },
  ctaCardBtn: {
    marginTop: '14px',
    background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '99px',
    fontSize: '14px',
    fontWeight: 700,
    textAlign: 'center',
  },
}

export default Home
