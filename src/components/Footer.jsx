import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.grid}>
        <div>
          <p style={styles.logo}>Dropifyai</p>
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
        <p style={styles.copy}>© 2026 Dropifyai. Todos los derechos reservados.</p>
        <p style={styles.copy}>Hecho con ❤️ en Latinoamérica</p>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: '#111118',
    borderTop: '1px solid rgba(108,99,255,0.2)',
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
    fontSize: '20px', fontWeight: 700,
    background: 'linear-gradient(135deg,#6c63ff,#22d3ee)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
  },
  desc: { fontSize: '13px', color: '#8b8a9e', lineHeight: 1.6 },
  colTitle: { fontSize: '13px', fontWeight: 700, marginBottom: '14px', color: '#f1f0ff' },
  colLink: {
    display: 'block', fontSize: '13px', color: '#8b8a9e',
    textDecoration: 'none', marginBottom: '8px',
  },
  bottom: {
    borderTop: '1px solid rgba(108,99,255,0.2)',
    paddingTop: '20px',
    display: 'flex', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '10px',
  },
  copy: { fontSize: '12px', color: '#8b8a9e' },
}

export default Footer
