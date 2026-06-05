import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

const HERO = {
  badge: '🔥 OFERTA DEL DÍA',
  badgeBg: 'rgba(239,68,68,0.1)',
  badgeColor: '#ef4444',
  badgeBorder: 'rgba(239,68,68,0.25)',
  title: 'Auriculares IA',
  sub: 'que leen tu mente',
  img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=85',
  originalPrice: '$89',
  price: '$49',
  discount: '-45%',
  cta1Label: '🛒 Consíguelo ya',
  cta1To: '/productos',
  cta2Label: 'Ver detalles',
  cta2To: '/productos',
  accentRgb: '26,111,255',
  accentGlow: 'rgba(26,111,255,0.3)',
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
  const [categories, setCategories] = useState([])
  const [time, setTime] = useState(2 * 3600 + 34 * 60 + 18)
  const navigate = useNavigate()

  const [catsRef, catsVisible] = useReveal()
  const [prodsRef, prodsVisible] = useReveal()
  const [featRef, featVisible] = useReveal()
  const [bentoRef, bentoVisible] = useReveal()

  const scrambledTitle = useTextScramble(HERO.title, 0)
  const blurStyle = useBlurIn(0)

  useEffect(() => {
    async function fetchData() {
      const [{ data: viral }, { data: cats }] = await Promise.all([
        supabase.from('products').select('*').eq('viral', true).limit(6),
        supabase.from('categories').select('*').order('id'),
      ])
      setFeatured(viral || [])
      setCategories(cats || [])
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
        <img src="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1600&q=85" alt="Auriculares IA" style={s.heroBg} />
        <div style={s.heroOverlay} />
        <div style={s.heroContent} className="slide-content-next">
          <span style={s.slideBadge}>{HERO.badge}</span>
          <h1 style={s.heroTitle}>
            {scrambledTitle}<br />
            <span style={{ ...s.gradient, ...blurStyle }}>{HERO.sub}</span>
          </h1>
          <div style={s.priceRow}>
            <span style={s.priceOld}>{HERO.originalPrice}</span>
            <span style={s.priceBig}>{HERO.price}</span>
            <span style={s.discountBadge}>{HERO.discount}</span>
          </div>
          <div style={s.countdown}>
            <span style={s.countdownLabel}>⚡ Oferta termina en:</span>
            <div style={s.countdownBlocks}>
              {[{ v: hh, u: 'hrs' }, { v: mm, u: 'min' }, { v: ss, u: 'seg' }].map(({ v, u }) => (
                <div key={u} style={s.countdownBlock}>
                  <span style={s.countdownNum}>{v}</span>
                  <span style={s.countdownUnit}>{u}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={s.heroBtns}>
            <Link to={HERO.cta1To} style={s.btnPrimary}>{HERO.cta1Label}</Link>
            <Link to={HERO.cta2To} style={s.btnOutline}>{HERO.cta2Label}</Link>
          </div>
          <div style={s.trustBar}>
            {['🚚 Envío gratis', '↩️ 30 días devolución', '🔒 Pago seguro'].map(t => (
              <span key={t} style={s.trustItem}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section style={s.sectionBento}>
        <p style={s.label}>Trending ahora</p>
        <h2 style={s.title}>Lo que todos <span style={s.gradient}>están comprando</span></h2>
        <p style={s.sub}>Gadgets IA seleccionados — los más buscados de esta semana.</p>
        <div ref={bentoRef} style={s.bentoGrid}>

          {[
            { area: 'big',  img: 'photo-1590658268037-6bf12165a8df', cat: 'AURICULARES IA',  name: 'ProBuds X1 con IA adaptativa',              price: '$79',  ribbon: 'MÁS VENDIDO',  ribbonColor: '#f59e0b', delay: 0    },
            { area: 'sm1',  img: 'photo-1523275335684-37898b6baf30', cat: 'WEARABLES',        name: 'SmartWatch Pro con sensor IA',               price: '$129', ribbon: 'NUEVO',         ribbonColor: '#22c55e', delay: 0.08 },
            { area: 'sm2',  img: 'photo-1576243345690-4e4b79b05b30', cat: 'FITNESS IA',       name: 'FitBand 360 — monitoreo 24/7',               price: '$49',  ribbon: '−40%',          ribbonColor: '#1A6FFF', delay: 0.16 },
            { area: 'wide', img: 'photo-1505740420928-5e560c06d30e', cat: 'AUDIO IA',         name: 'SoundMax AI — cancelación activa de ruido',  price: '$159', ribbon: 'OFERTA FLASH',  ribbonColor: '#ef4444', delay: 0.06 },
            { area: 'sm3',  img: 'photo-1485827404703-89b55fcc595e', cat: 'ROBÓTICA',         name: 'AI Companion — asistente personal',          price: '$299', ribbon: 'TRENDING',      ribbonColor: '#7B5FFF', delay: 0.22 },
          ].map(({ area, img, cat, name, price, ribbon, ribbonColor, delay }) => (
            <Link
              key={area}
              to="/productos"
              className="card-hover"
              style={{
                ...s.bentoCell,
                gridArea: area,
                opacity: bentoVisible ? 1 : 0,
                transform: bentoVisible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
              }}
            >
              <div style={s.ribbon(ribbon, ribbonColor)} />
              <img src={`https://images.unsplash.com/${img}?w=700&q=80`} alt={name} style={s.bentoImg} />
              <div style={s.bentoOverlay}>
                <span style={s.bentoCat}>{cat}</span>
                <p style={s.bentoName}>{name}</p>
                <span style={s.bentoPrice}>{price}</span>
              </div>
            </Link>
          ))}

          <div style={{
            ...s.bentoStat,
            opacity: bentoVisible ? 1 : 0,
            transform: bentoVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.55s ease 0.12s, transform 0.55s ease 0.12s',
          }}>
            {[{ num: '12.4k+', txt: 'clientes' }, { num: '4.9★', txt: 'promedio' }, { num: '−45%', txt: 'desc. máx.' }].map(({ num, txt }, i) => (
              <div key={i} style={s.statBlock}>
                {i > 0 && <div style={s.statDivider} />}
                <div style={s.statNum}>{num}</div>
                <div style={s.statTxt}>{txt}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CATEGORÍAS */}
      <section style={s.sectionGray}>
        <p style={s.label}>Explora por categoría</p>
        <h2 style={s.title}>Todo con <span style={s.gradient}>Inteligencia Artificial</span></h2>
        <p style={s.sub}>Selecciona tu categoría y descubre los gadgets más innovadores.</p>
        <div ref={catsRef} style={s.catsGrid}>
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/productos?cat=${cat.slug}`)}
              className="card-hover"
              style={{
                ...s.catCard,
                cursor: 'pointer',
                opacity: catsVisible ? 1 : 0,
                transform: catsVisible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`,
              }}
            >
              <div style={s.catIcon}>{cat.emoji}</div>
              <div style={s.catName}>{cat.name}</div>
              <div style={s.catCount}>{cat.count} productos</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section style={s.section}>
        <p style={s.label}>Más vendidos</p>
        <h2 style={s.title}>Productos <span style={s.gradient}>Destacados</span></h2>
        <p style={s.sub}>Los gadgets IA con mayor demanda y mejores márgenes.</p>
        <div ref={prodsRef} style={s.prodsGrid}>
          {featured.map((prod, i) => (
            <Link key={prod.id} to={`/producto/${prod.id}`}
              className="card-hover"
              style={{
                ...s.prodCard,
                opacity: prodsVisible ? 1 : 0,
                transform: prodsVisible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.55s ease ${i * 0.09}s, transform 0.55s ease ${i * 0.09}s`,
              }}
            >
              <div className="card-hover" style={s.prodImg}>
                <img
                  src={prod.image_url || getCategoryImg(prod.category)}
                  alt={prod.name}
                  style={s.prodImgPhoto}
                />
                <div className="prod-card-btn">Ver producto →</div>
              </div>
              <div style={s.prodInfo}>
                <p style={s.prodCat}>{prod.category.toUpperCase()}</p>
                <p style={s.prodName}>{prod.name}</p>
                <p style={s.prodDesc}>{prod.description}</p>
                <div style={s.prodBottom}>
                  <span style={s.prodPrice}>${prod.price}</span>
                  <span style={s.prodBadge}>{prod.badge}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/productos" style={s.btnPrimary}>Ver todos los productos →</Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={s.sectionGray}>
        <p style={s.label}>¿Por qué ConAI?</p>
        <h2 style={s.title}>Tu tienda IA de <span style={s.gradient}>confianza</span></h2>
        <div ref={featRef} style={s.featGrid}>
          {[
            { icon: '🤖', t: '100% Productos IA', d: 'Cada producto está seleccionado por su integración real con inteligencia artificial.' },
            { icon: '🚚', t: 'Envío Rápido', d: 'Despacho en 24-48h con proveedores verificados y seguimiento en tiempo real.' },
            { icon: '🔒', t: 'Compra Segura', d: 'Pago 100% seguro con encriptación SSL y garantía de devolución de 30 días.' },
            { icon: '🌟', t: 'Soporte 24/7', d: 'Nuestro equipo está disponible todo el día para ayudarte.' },
          ].map((f, i) => (
            <div key={i}
              className="card-hover"
              style={{
                ...s.feat,
                opacity: featVisible ? 1 : 0,
                transform: featVisible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.55s ease ${i * 0.1}s, transform 0.55s ease ${i * 0.1}s`,
              }}
            >
              <div style={s.featIcon}>{f.icon}</div>
              <p style={s.featTitle}>{f.t}</p>
              <p style={s.featDesc}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={s.section}>
        <div style={s.newsletter}>
          <h2 style={s.nlTitle}>Sé el primero en conocer<br />los nuevos gadgets IA</h2>
          <p style={s.nlSub}>Únete a más de 10.000 early adopters que ya reciben las últimas novedades.</p>
          <div style={s.nlForm}>
            <input style={s.nlInput} type="email" placeholder="tu@email.com" />
            <button style={s.nlBtn}>Suscribirme →</button>
          </div>
        </div>
      </section>

    </div>
  )
}

const s = {
  heroWrap: {
    position: 'relative',
    height: '620px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 30%',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.62) 100%)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '20px',
    padding: '0 24px',
    maxWidth: '680px',
    width: '100%',
  },
  slideBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '99px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: 700,
    background: 'rgba(239,68,68,0.18)',
    color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.35)',
  },
  heroTitle: {
    fontSize: 'clamp(36px,5.5vw,68px)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-2px',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'monospace',
  },
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
    color: 'rgba(255,255,255,0.5)',
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
    alignSelf: 'flex-start',
  },
  countdownLabel: { fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' },
  countdownBlocks: { display: 'flex', alignItems: 'center', gap: '6px' },
  countdownBlock: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: '6px 12px', minWidth: '52px',
  },
  countdownNum: { fontSize: '26px', fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 },
  countdownUnit: { fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: '3px', textTransform: 'uppercase' },
  socialProof: { fontSize: '14px', color: '#374151', fontWeight: 600, margin: 0 },
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
  imageGlow: (glow) => ({
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: glow,
    boxShadow: `0 0 100px 50px ${glow}`,
    pointerEvents: 'none',
    transition: 'all 0.6s ease',
  }),
  heroImg: {
    width: '380px',
    height: '380px',
    borderRadius: '36px',
    objectFit: 'cover',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 32px 80px rgba(26,111,255,0.18), 0 8px 24px rgba(0,0,0,0.12)',
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
  trustBar: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  trustItem: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.65)',
    fontWeight: 500,
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 2,
    padding: 0,
  },
  dots: {
    position: 'absolute',
    bottom: '28px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 2,
  },
  dotWrap: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  dot: { height: '8px', borderRadius: '99px', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' },
  dotFill: (pct) => ({
    position: 'absolute', top: 0, left: 0, height: '100%',
    width: `${pct}%`, background: 'rgba(0,0,0,0.18)',
    borderRadius: '99px', transition: 'width 0.05s linear',
  }),
  section: { padding: '80px 5%', background: '#ffffff' },
  sectionGray: { padding: '80px 5%', background: '#f8f9fa' },
  label: { fontSize: '12px', color: '#1A6FFF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' },
  title: { fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.2, marginBottom: '14px', color: '#0a0a0f' },
  sub: { fontSize: '16px', color: '#6b7280', maxWidth: '520px', lineHeight: 1.6, marginBottom: '48px' },
  catsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '14px' },
  catCard: {
    background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px',
    padding: '24px 18px', textAlign: 'center', textDecoration: 'none',
    display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  catIcon: { fontSize: '32px', marginBottom: '12px' },
  catName: { fontSize: '14px', fontWeight: 600, color: '#0a0a0f', marginBottom: '4px' },
  catCount: { fontSize: '12px', color: '#9ca3af' },
  prodsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '16px' },
  prodCard: {
    background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px',
    overflow: 'hidden', textDecoration: 'none', display: 'block',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  prodImg: { aspectRatio: '4/5', position: 'relative', overflow: 'hidden', background: '#f0f2f5' },
  prodImgPhoto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  prodInfo: { padding: '16px' },
  prodCat: { fontSize: '10px', color: '#1A6FFF', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '6px' },
  prodName: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f', marginBottom: '6px', lineHeight: 1.3 },
  prodDesc: { fontSize: '12px', color: '#6b7280', lineHeight: 1.5, marginBottom: '14px' },
  prodBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  prodPrice: { fontSize: '18px', fontWeight: 800, color: '#e63946' },
  prodBadge: { fontSize: '10px', background: 'rgba(26,111,255,0.1)', color: '#1A6FFF', padding: '3px 10px', borderRadius: '99px', fontWeight: 600 },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' },
  feat: {
    background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px',
    padding: '28px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  featIcon: { fontSize: '32px', marginBottom: '16px' },
  featTitle: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f', marginBottom: '8px' },
  featDesc: { fontSize: '13px', color: '#6b7280', lineHeight: 1.6 },
  newsletter: { background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', borderRadius: '24px', padding: '56px', textAlign: 'center' },
  nlTitle: { fontSize: '32px', fontWeight: 800, marginBottom: '12px', color: '#ffffff' },
  nlSub: { color: 'rgba(255,255,255,0.85)', marginBottom: '28px', fontSize: '15px' },
  nlForm: { display: 'flex', gap: '10px', maxWidth: '440px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' },
  nlInput: { flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '99px', padding: '12px 20px', color: '#ffffff', fontSize: '14px', outline: 'none' },
  nlBtn: { background: '#ffffff', color: '#1A6FFF', border: 'none', padding: '12px 28px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  sectionBento: { padding: '80px 5%', background: '#f8f9fa' },
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.3fr 1fr',
    gridTemplateRows: '220px 220px 200px',
    gridTemplateAreas: '"big sm1 stat" "big sm2 stat" "wide wide sm3"',
    gap: '12px',
  },
  bentoCell: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'block',
  },
  ribbon: (text, color) => ({
    position: 'absolute',
    top: '24px',
    left: '-28px',
    width: '115px',
    textAlign: 'center',
    background: color,
    color: '#fff',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.07em',
    padding: '5px 0',
    transform: 'rotate(-45deg)',
    zIndex: 3,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  }),
  bentoImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  bentoOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
    padding: '28px 16px 16px',
    zIndex: 2,
  },
  bentoCat: { fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.1em', display: 'block', marginBottom: '4px' },
  bentoName: { fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 6px 0', lineHeight: 1.3 },
  bentoPrice: { fontSize: '16px', fontWeight: 800, color: '#fff' },
  bentoStat: {
    gridArea: 'stat',
    background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
  },
  statBlock: { width: '100%', textAlign: 'center', padding: '10px 0' },
  statDivider: { width: '40px', height: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 auto' },
  statNum: { fontSize: '28px', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '4px' },
  statTxt: { fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: '0.05em' },
}

export default Home
