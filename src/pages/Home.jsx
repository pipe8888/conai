import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const SLIDES = [
  {
    badge: '🔥 OFERTA DEL DÍA',
    badgeBg: 'rgba(239,68,68,0.1)',
    badgeColor: '#ef4444',
    badgeBorder: 'rgba(239,68,68,0.25)',
    title: 'Auriculares IA',
    sub: 'que leen tu mente',
    emoji: '🎧',
    originalPrice: '$89',
    price: '$49',
    discount: '-45%',
    cta1Label: '🛒 Consíguelo ya',
    cta1To: '/productos',
    cta2Label: 'Ver detalles',
    cta2To: '/productos',
    showCountdown: true,
    bg: '#ffffff',
  },
  {
    badge: '✨ NUEVO EN 2026',
    badgeBg: 'rgba(26,111,255,0.08)',
    badgeColor: '#1A6FFF',
    badgeBorder: 'rgba(26,111,255,0.2)',
    title: 'Gadgets de Salud IA',
    sub: 'que cuidan tu cuerpo 24/7',
    emoji: '💪',
    price: 'Desde $29',
    cta1Label: 'Ver toda la categoría →',
    cta1To: '/productos',
    showCountdown: false,
    bg: '#f8fbff',
  },
  {
    badge: '⚡ TRENDING #1 EN 2026',
    badgeBg: 'rgba(245,158,11,0.1)',
    badgeColor: '#d97706',
    badgeBorder: 'rgba(245,158,11,0.25)',
    title: 'El gadget que todos',
    sub: 'están comprando',
    emoji: '🤖',
    social: '⭐ +500 vendidos esta semana',
    price: '$67',
    cta1Label: 'Comprar ahora →',
    cta1To: '/productos',
    cta2Label: '¿Qué es esto?',
    cta2To: '/productos',
    showCountdown: false,
    bg: '#fffdf8',
  },
]

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

// Efecto 14: types subtitle letter by letter with blinking cursor
function useTypewriter(text, trigger) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    let i = 0
    const iv = setInterval(() => {
      i++
      setN(i)
      if (i >= text.length) clearInterval(iv)
    }, 40)
    return () => clearInterval(iv)
  }, [text, trigger])
  return text.slice(0, n) + (n < text.length ? '|' : '')
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
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [time, setTime] = useState(2 * 3600 + 34 * 60 + 18)
  const navigate = useNavigate()

  const [catsRef, catsVisible] = useReveal()
  const [prodsRef, prodsVisible] = useReveal()
  const [featRef, featVisible] = useReveal()

  const cur = SLIDES[slide]
  const scrambledTitle = useTextScramble(cur.title, slide)
  const typedSub = useTypewriter(cur.sub, slide)

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
    if (paused) return
    const t = setInterval(() => setSlide(prev => (prev + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [paused, slide])

  useEffect(() => {
    const t = setInterval(() => setTime(prev => prev > 0 ? prev - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = String(Math.floor(time / 3600)).padStart(2, '0')
  const mm = String(Math.floor((time % 3600) / 60)).padStart(2, '0')
  const ss = String(time % 60).padStart(2, '0')

  return (
    <div>

      {/* HERO SLIDER */}
      <section
        style={{ ...s.heroWrap, background: cur.bg }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div style={s.heroLeft}>
          <span style={{
            ...s.slideBadge,
            background: cur.badgeBg,
            color: cur.badgeColor,
            border: `1px solid ${cur.badgeBorder}`,
          }}>
            {cur.badge}
          </span>

          <h1 style={s.heroTitle}>
            {scrambledTitle}<br />
            <span style={s.gradient}>{typedSub}</span>
          </h1>

          <div style={s.priceRow}>
            {cur.originalPrice && <span style={s.priceOld}>{cur.originalPrice}</span>}
            <span style={s.priceBig}>{cur.price}</span>
            {cur.discount && <span style={s.discountBadge}>{cur.discount}</span>}
          </div>

          {cur.showCountdown && (
            <div style={s.countdown}>
              <span style={s.countdownLabel}>⏱ Termina en:</span>
              <span style={s.countdownTime}>{hh}:{mm}:{ss}</span>
            </div>
          )}

          {cur.social && <p style={s.socialProof}>{cur.social}</p>}

          <div style={s.heroBtns}>
            <Link to={cur.cta1To} style={s.btnPrimary}>{cur.cta1Label}</Link>
            {cur.cta2Label && <Link to={cur.cta2To} style={s.btnOutline}>{cur.cta2Label}</Link>}
          </div>
        </div>

        <div style={s.heroRight}>
          <div style={s.emojiBox}>
            <span style={s.bigEmoji}>{cur.emoji}</span>
          </div>
        </div>

        <button style={{ ...s.arrow, left: '20px' }}
          onClick={() => setSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length)}>←</button>
        <button style={{ ...s.arrow, right: '20px' }}
          onClick={() => setSlide(prev => (prev + 1) % SLIDES.length)}>→</button>

        <div style={s.dots}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              style={i === slide ? s.dotActive : s.dotInactive} />
          ))}
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
              <div style={s.prodImg}>
                {prod.image_url
                  ? <img src={prod.image_url} alt={prod.name} style={s.prodImgPhoto} />
                  : <span style={{ fontSize: '60px' }}>{prod.emoji}</span>
                }
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
    minHeight: '520px',
    display: 'flex',
    alignItems: 'center',
    padding: '60px 8% 90px',
    gap: '48px',
    overflow: 'hidden',
    transition: 'background 0.4s ease',
  },
  heroLeft: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
    zIndex: 1,
  },
  heroRight: {
    flex: '0 0 300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '99px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: 700,
    alignSelf: 'flex-start',
  },
  heroTitle: {
    fontSize: 'clamp(32px,5vw,60px)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1.5px',
    color: '#0a0a0f',
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
    alignItems: 'center',
    gap: '10px',
    background: '#fff3f3',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '12px',
    padding: '10px 18px',
    alignSelf: 'flex-start',
  },
  countdownLabel: { fontSize: '13px', color: '#6b7280' },
  countdownTime: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#ef4444',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.04em',
  },
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
    background: 'transparent',
    color: '#0a0a0f',
    border: '1px solid #d1d5db',
    padding: '14px 32px',
    borderRadius: '99px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  emojiBox: {
    width: '260px',
    height: '260px',
    background: 'rgba(26,111,255,0.06)',
    border: '2px solid rgba(26,111,255,0.12)',
    borderRadius: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigEmoji: { fontSize: '110px', lineHeight: 1 },
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
  dotActive: {
    width: '28px', height: '8px', borderRadius: '99px',
    background: '#1A6FFF', border: 'none', cursor: 'pointer', padding: 0,
  },
  dotInactive: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#d1d5db', border: 'none', cursor: 'pointer', padding: 0,
  },
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
  prodsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '20px' },
  prodCard: {
    background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px',
    overflow: 'hidden', textDecoration: 'none', display: 'block',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  prodImg: { height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', background: '#f8f9fa', overflow: 'hidden' },
  prodImgPhoto: { width: '100%', height: '100%', objectFit: 'cover' },
  prodInfo: { padding: '16px' },
  prodCat: { fontSize: '10px', color: '#1A6FFF', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '6px' },
  prodName: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f', marginBottom: '6px', lineHeight: 1.3 },
  prodDesc: { fontSize: '12px', color: '#6b7280', lineHeight: 1.5, marginBottom: '14px' },
  prodBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  prodPrice: { fontSize: '18px', fontWeight: 800, background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
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
}

export default Home
