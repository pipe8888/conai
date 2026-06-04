import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.grid}>
        <div>
          <p style={styles.logo}>Con<span style={styles.logoBlue}>ai</span></p>
          <p style={styles.desc}>La tienda de gadgets IA más innovadora de Latinoamérica.</p>
        </div>
        <div>
          <p style={styles.colTitle}>Categorías</p>
          <Link to="/productos" style={styles.colLink}>Salud IA</Link>
          <Link to="/productos" style={styles.colLink}>Belleza Tech</Link>
          <Link to="/productos" style={styles.colLink}>Hogar Inteligente</Link>
          <Link to="/productos" style={styles.colLink}>Wearables</Link>
        </div>
        <div>
          <p style={styles.colTitle}>Empresa</p>
          <Link to="/" style={styles.colLink}>Sobre nosotros</Link>
          <Link to="/" style={styles.colLink}>Blog</Link>
          <Link to="/contacto" style={styles.colLink}>Contacto</Link>
        </div>
        <div>
          <p style={styles.colTitle}>Soporte</p>
          <Link to="/" style={styles.colLink}>Envíos</Link>
          <Link to="/" style={styles.colLink}>Devoluciones</Link>
          <Link to="/contacto" style={styles.colLink}>Ayuda</Link>
        </div>
      </div>
      <div style={styles.bottom}>
        <p style={styles.copy}>© 2026 ConAI. Todos los derechos reservados.</p>
        <p style={styles.copy}>Hecho con ❤️ en Latinoamérica</p>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: '#f8f9fa',
    borderTop: '1px solid #e5e7eb',
    padding: '48px 5% 28px',
    marginTop: '80px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '40px',
    marginBottom: '40px',
  },
  logo: {
    fontSize: '20px', fontWeight: 800, color: '#0a0a0f',
    marginBottom: '10px',
  },
  logoBlue: {
    background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  desc: { fontSize: '13px', color: '#6b7280', lineHeight: 1.6 },
  colTitle: { fontSize: '13px', fontWeight: 700, marginBottom: '14px', color: '#0a0a0f' },
  colLink: {
    display: 'block', fontSize: '13px', color: '#6b7280',
    textDecoration: 'none', marginBottom: '8px',
  },
  bottom: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '20px',
    display: 'flex', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '10px',
  },
  copy: { fontSize: '12px', color: '#9ca3af' },
}

export default Footer
