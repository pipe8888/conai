import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

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

  return (
    <div>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroBadge}>
          <span style={s.dot}></span> Tecnología del futuro, disponible hoy
        </div>
        <h1 style={s.heroTitle}>
          El futuro es<br />
          <span style={s.gradient}>inteligente.</span><br />
          Vívelo ahora.
        </h1>
        <p style={s.heroSub}>
          Descubre los gadgets con Inteligencia Artificial más innovadores de 2026.
          Salud, belleza, hogar y más — todo en un solo lugar.
        </p>
        <div style={s.heroBtns}>
          <Link to="/productos" style={s.btnPrimary}>Explorar Productos →</Link>
          <Link to="/productos" style={s.btnOutline}>Ver Categorías</Link>
        </div>
        <div style={s.heroStats}>
          {[
            { n: '30+', l: 'Productos IA' },
            { n: '6', l: 'Categorías' },
            { n: '+80%', l: 'Margen promedio' },
            { n: '2026', l: 'Tendencia #1' },
          ].map((s2, i) => (
            <div key={i} style={s.stat}>
              <div style={s.statN}>{s2.n}</div>
              <div style={s.statL}>{s2.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section style={s.sectionGray}>
        <p style={s.label}>Explora por categoría</p>
        <h2 style={s.title}>Todo con <span style={s.gradient}>Inteligencia Artificial</span></h2>
        <p style={s.sub}>Selecciona tu categoría y descubre los gadgets más innovadores.</p>
        <div style={s.catsGrid}>
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigate(`/productos?cat=${cat.slug}`)}
              style={{ ...s.catCard, cursor: 'pointer' }}
              className="card-hover"
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
        <div style={s.prodsGrid}>
          {featured.map(prod => (
            <Link key={prod.id} to={`/producto/${prod.id}`} style={s.prodCard} className="card-hover">
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
        <div style={s.featGrid}>
          {[
            { icon: '🤖', t: '100% Productos IA', d: 'Cada producto está seleccionado por su integración real con inteligencia artificial.' },
            { icon: '🚚', t: 'Envío Rápido', d: 'Despacho en 24-48h con proveedores verificados y seguimiento en tiempo real.' },
            { icon: '🔒', t: 'Compra Segura', d: 'Pago 100% seguro con encriptación SSL y garantía de devolución de 30 días.' },
            { icon: '🌟', t: 'Soporte 24/7', d: 'Nuestro equipo está disponible todo el día para ayudarte.' },
          ].map((f, i) => (
            <div key={i} style={s.feat} className="card-hover">
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
  hero: { minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 5% 60px', background: '#ffffff' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(26,111,255,0.08)', border: '1px solid rgba(26,111,255,0.2)', borderRadius: '99px', padding: '6px 16px', fontSize: '13px', color: '#1A6FFF', marginBottom: '28px' },
  dot: { width: '6px', height: '6px', borderRadius: '50%', background: '#1A6FFF', display: 'inline-block' },
  heroTitle: { fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '20px', color: '#0a0a0f' },
  gradient: { background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: '18px', color: '#6b7280', maxWidth: '520px', lineHeight: 1.6, marginBottom: '36px' },
  heroBtns: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' },
  btnPrimary: { background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
  btnOutline: { background: 'transparent', color: '#0a0a0f', border: '1px solid #d1d5db', padding: '14px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
  heroStats: { display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' },
  stat: { textAlign: 'center' },
  statN: { fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  statL: { fontSize: '12px', color: '#9ca3af', marginTop: '2px' },
  section: { padding: '80px 5%', background: '#ffffff' },
  sectionGray: { padding: '80px 5%', background: '#f8f9fa' },
  label: { fontSize: '12px', color: '#1A6FFF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' },
  title: { fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.2, marginBottom: '14px', color: '#0a0a0f' },
  sub: { fontSize: '16px', color: '#6b7280', maxWidth: '520px', lineHeight: 1.6, marginBottom: '48px' },
  catsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '14px' },
  catCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px 18px', textAlign: 'center', textDecoration: 'none', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  catIcon: { fontSize: '32px', marginBottom: '12px' },
  catName: { fontSize: '14px', fontWeight: 600, color: '#0a0a0f', marginBottom: '4px' },
  catCount: { fontSize: '12px', color: '#9ca3af' },
  prodsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '20px' },
  prodCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
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
  feat: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
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
