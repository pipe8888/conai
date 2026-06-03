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
      <section style={s.section}>
        <p style={s.label}>Explora por categoría</p>
        <h2 style={s.title}>Todo con <span style={s.gradient}>Inteligencia Artificial</span></h2>
        <p style={s.sub}>Selecciona tu categoría y descubre los gadgets más innovadores.</p>
        <div style={s.catsGrid}>
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigate(`/productos?cat=${cat.slug}`)}
              style={{ ...s.catCard, cursor: 'pointer' }}
            >
              <div style={s.catIcon}>{cat.emoji}</div>
              <div style={s.catName}>{cat.name}</div>
              <div style={s.catCount}>{cat.count} productos</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section style={{ ...s.section, paddingTop: 0 }}>
        <p style={s.label}>Más vendidos</p>
        <h2 style={s.title}>Productos <span style={s.gradient}>Destacados</span></h2>
        <p style={s.sub}>Los gadgets IA con mayor demanda y mejores márgenes.</p>
        <div style={s.prodsGrid}>
          {featured.map(prod => (
            <Link key={prod.id} to={`/producto/${prod.id}`} style={s.prodCard}>
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
      <section style={s.section}>
        <p style={s.label}>¿Por qué Dropifyai?</p>
        <h2 style={s.title}>Tu tienda IA de <span style={s.gradient}>confianza</span></h2>
        <div style={s.featGrid}>
          {[
            { icon: '🤖', t: '100% Productos IA', d: 'Cada producto está seleccionado por su integración real con inteligencia artificial.' },
            { icon: '🚚', t: 'Envío Rápido', d: 'Despacho en 24-48h con proveedores verificados y seguimiento en tiempo real.' },
            { icon: '🔒', t: 'Compra Segura', d: 'Pago 100% seguro con encriptación SSL y garantía de devolución de 30 días.' },
            { icon: '🌟', t: 'Soporte 24/7', d: 'Nuestro equipo está disponible todo el día para ayudarte.' },
          ].map((f, i) => (
            <div key={i} style={s.feat}>
              <div style={s.featIcon}>{f.icon}</div>
              <p style={s.featTitle}>{f.t}</p>
              <p style={s.featDesc}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ ...s.section, paddingTop: 0 }}>
        <div style={s.newsletter}>
          <h2 style={s.nlTitle}>Sé el primero en conocer<br />los nuevos gadgets IA</h2>
          <p style={s.nlSub}>Únete a más de 10.000 early adopters que ya reciben las últimas novedades.</p>
          <div style={s.nlForm}>
            <input style={s.nlInput} type="email" placeholder="tu@email.com" />
            <button style={s.btnPrimary}>Suscribirme →</button>
          </div>
        </div>
      </section>

    </div>
  )
}

const s = {
  hero: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 5% 60px' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '99px', padding: '6px 16px', fontSize: '13px', color: '#a78bfa', marginBottom: '28px' },
  dot: { width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block' },
  heroTitle: { fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '20px' },
  gradient: { background: 'linear-gradient(135deg,#6c63ff,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: '18px', color: '#8b8a9e', maxWidth: '520px', lineHeight: 1.6, marginBottom: '36px' },
  heroBtns: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' },
  btnPrimary: { background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
  btnOutline: { background: 'transparent', color: '#f1f0ff', border: '1px solid rgba(108,99,255,0.3)', padding: '14px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
  heroStats: { display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' },
  stat: { textAlign: 'center' },
  statN: { fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg,#6c63ff,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  statL: { fontSize: '12px', color: '#8b8a9e', marginTop: '2px' },
  section: { padding: '80px 5%' },
  label: { fontSize: '12px', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' },
  title: { fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.2, marginBottom: '14px' },
  sub: { fontSize: '16px', color: '#8b8a9e', maxWidth: '520px', lineHeight: 1.6, marginBottom: '48px' },
  catsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '14px' },
  catCard: { background: '#13131c', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '16px', padding: '24px 18px', textAlign: 'center', textDecoration: 'none', transition: 'all 0.2s', display: 'block' },
  catIcon: { fontSize: '32px', marginBottom: '12px' },
  catName: { fontSize: '14px', fontWeight: 600, color: '#f1f0ff', marginBottom: '4px' },
  catCount: { fontSize: '12px', color: '#8b8a9e' },
  prodsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '20px' },
  prodCard: { background: '#13131c', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'all 0.2s' },
  prodImg: { height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', background: 'linear-gradient(135deg,rgba(108,99,255,0.12),rgba(34,211,238,0.08))', overflow: 'hidden' },
  prodImgPhoto: { width: '100%', height: '100%', objectFit: 'cover' },
  prodInfo: { padding: '16px' },
  prodCat: { fontSize: '10px', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '6px' },
  prodName: { fontSize: '15px', fontWeight: 700, color: '#f1f0ff', marginBottom: '6px', lineHeight: 1.3 },
  prodDesc: { fontSize: '12px', color: '#8b8a9e', lineHeight: 1.5, marginBottom: '14px' },
  prodBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  prodPrice: { fontSize: '18px', fontWeight: 800, background: 'linear-gradient(135deg,#6c63ff,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  prodBadge: { fontSize: '10px', background: 'rgba(34,211,238,0.12)', color: '#22d3ee', padding: '3px 10px', borderRadius: '99px', fontWeight: 600 },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' },
  feat: { background: '#13131c', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '16px', padding: '28px 22px' },
  featIcon: { fontSize: '32px', marginBottom: '16px' },
  featTitle: { fontSize: '15px', fontWeight: 700, color: '#f1f0ff', marginBottom: '8px' },
  featDesc: { fontSize: '13px', color: '#8b8a9e', lineHeight: 1.6 },
  newsletter: { background: 'linear-gradient(135deg,rgba(108,99,255,0.15),rgba(34,211,238,0.08))', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '24px', padding: '56px', textAlign: 'center' },
  nlTitle: { fontSize: '32px', fontWeight: 800, marginBottom: '12px', color: '#f1f0ff' },
  nlSub: { color: '#8b8a9e', marginBottom: '28px', fontSize: '15px' },
  nlForm: { display: 'flex', gap: '10px', maxWidth: '440px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' },
  nlInput: { flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '99px', padding: '12px 20px', color: '#f1f0ff', fontSize: '14px', outline: 'none' },
}

export default Home
