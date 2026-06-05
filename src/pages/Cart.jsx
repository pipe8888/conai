import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'

function TrustItem({ icon, text }) {
  const icons = {
    lock: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2" y="6" width="10" height="7" rx="2" stroke="#9ca3af" strokeWidth="1.4"/>
        <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    truck: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="4" width="8" height="6" rx="1" stroke="#9ca3af" strokeWidth="1.3"/>
        <path d="M9 6h2.5L13 9v1H9V6z" stroke="#9ca3af" strokeWidth="1.3" strokeLinejoin="round"/>
        <circle cx="3.5" cy="11" r="1.2" stroke="#9ca3af" strokeWidth="1.3"/>
        <circle cx="10.5" cy="11" r="1.2" stroke="#9ca3af" strokeWidth="1.3"/>
      </svg>
    ),
    ret: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7a5 5 0 1 0 1-3" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M2 4v3h3" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icons[icon]}
      <span style={{ fontSize: '12px', color: '#6b7280' }}>{text}</span>
    </div>
  )
}

function Cart() {
  const { items, total, count, removeFromCart, clearCart, updateQuantity } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div style={s.empty}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <path d="M7 7h7l7 31.5a3.5 3.5 0 0 0 3.5 2.5h24.5a3.5 3.5 0 0 0 3.43-2.8l4.2-19.2H17.5" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24.5" cy="49" r="3.5" stroke="#d1d5db" strokeWidth="2.5"/>
        <circle cx="42" cy="49" r="3.5" stroke="#d1d5db" strokeWidth="2.5"/>
      </svg>
      <h2 style={s.emptyTitle}>Tu carrito está vacío</h2>
      <p style={s.emptySub}>Explora nuestros gadgets con IA</p>
      <Link to="/productos" style={s.btnPrimary}>Explorar productos →</Link>
    </div>
  )

  return (
    <div style={s.wrap}>

      <div style={s.header}>
        <h1 style={s.title}>Tu carrito</h1>
        <p style={s.sub}>{count} {count === 1 ? 'artículo' : 'artículos'}</p>
      </div>

      <div style={s.layout}>

        {/* LISTA DE PRODUCTOS */}
        <div style={s.itemsList}>
          {items.map(item => (
            <div key={item.id} style={s.item}>
              <div style={s.itemImg}>{item.emoji}</div>

              <div style={s.itemInfo}>
                <div style={s.itemTop}>
                  <div>
                    <span style={s.itemCat}>{item.category}</span>
                    <p style={s.itemName}>{item.name}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={s.removeBtn} title="Eliminar">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <line x1="1" y1="1" x2="10" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <line x1="10" y1="1" x2="1" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                <div style={s.itemBottom}>
                  <div style={s.qtyControls}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={s.qtyBtn}
                    >−</button>
                    <span style={s.qtyNum}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={s.qtyBtn}
                    >+</button>
                  </div>
                  <span style={s.itemSubtotal}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} style={s.clearBtn}>Vaciar carrito</button>
        </div>

        {/* RESUMEN */}
        <div style={s.summary}>
          <h2 style={s.summaryTitle}>Resumen del pedido</h2>

          <div style={s.summaryRows}>
            {items.map(item => (
              <div key={item.id} style={s.summaryRow}>
                <span style={s.summaryName}>{item.name} ×{item.quantity}</span>
                <span style={s.summaryPrice}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={s.divider}/>

          <div style={s.totalRow}>
            <span style={s.totalLabel}>Total</span>
            <span style={s.totalPrice}>${total.toFixed(2)}</span>
          </div>

          <button style={s.checkoutBtn} onClick={() => navigate('/checkout')}>
            Proceder al pago →
          </button>

          <div style={s.trustBadges}>
            <TrustItem icon="lock" text="Pago 100% seguro"/>
            <TrustItem icon="truck" text="Envío en 24–48h"/>
            <TrustItem icon="ret"   text="Devolución en 30 días"/>
          </div>

          <Link to="/productos" style={s.continueLink}>← Continuar comprando</Link>
        </div>

      </div>
    </div>
  )
}

const s = {
  wrap: { padding: '48px 5% 80px', background: '#ffffff', minHeight: '100vh' },
  empty: { textAlign: 'center', padding: '120px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', minHeight: '100vh' },
  emptyTitle: { fontSize: '22px', fontWeight: 700, color: '#0a0a0f', marginTop: '8px' },
  emptySub: { fontSize: '15px', color: '#9ca3af' },
  header: { marginBottom: '36px' },
  title: { fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.5px', color: '#0a0a0f', marginBottom: '4px' },
  sub: { fontSize: '14px', color: '#9ca3af' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
  },
  itemImg: {
    fontSize: '40px',
    width: '80px', height: '80px', minWidth: '80px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f9fafb', borderRadius: '12px',
  },
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' },
  itemTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' },
  itemCat: {
    display: 'inline-block', fontSize: '10px', fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: '#6366f1', background: 'rgba(99,102,241,0.08)',
    borderRadius: '4px', padding: '2px 6px', marginBottom: '5px',
  },
  itemName: { fontSize: '15px', fontWeight: 600, color: '#0a0a0f', lineHeight: 1.3 },
  itemBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  qtyControls: {
    display: 'flex', alignItems: 'center',
    background: '#f3f4f6', borderRadius: '99px', padding: '3px',
  },
  qtyBtn: {
    width: '28px', height: '28px', borderRadius: '99px',
    border: 'none', background: 'transparent', cursor: 'pointer',
    fontSize: '17px', fontWeight: 400, color: '#374151',
    display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
  },
  qtyNum: { fontSize: '14px', fontWeight: 600, color: '#0a0a0f', minWidth: '26px', textAlign: 'center' },
  itemSubtotal: { fontSize: '16px', fontWeight: 700, color: '#0a0a0f' },
  removeBtn: {
    background: 'transparent', border: '1px solid #e5e7eb',
    color: '#9ca3af', borderRadius: '99px',
    width: '28px', height: '28px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  clearBtn: {
    background: 'transparent', border: 'none',
    color: '#9ca3af', fontSize: '13px', cursor: 'pointer',
    padding: '6px 0', alignSelf: 'flex-start', textDecoration: 'underline',
  },
  summary: {
    background: '#f9fafb', borderRadius: '20px', padding: '28px',
    position: 'sticky', top: '80px',
  },
  summaryTitle: { fontSize: '17px', fontWeight: 700, color: '#0a0a0f', marginBottom: '20px' },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' },
  summaryName: { fontSize: '13px', color: '#6b7280', flex: 1, lineHeight: 1.4 },
  summaryPrice: { fontSize: '13px', fontWeight: 600, color: '#0a0a0f', flexShrink: 0 },
  divider: { height: '1px', background: '#e5e7eb', margin: '16px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  totalLabel: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f' },
  totalPrice: { fontSize: '26px', fontWeight: 800, color: '#0a0a0f' },
  checkoutBtn: {
    width: '100%', background: '#0a0a0f', color: '#fff',
    border: 'none', padding: '15px', borderRadius: '12px',
    fontSize: '15px', fontWeight: 700, cursor: 'pointer',
    marginBottom: '20px', letterSpacing: '0.01em',
  },
  trustBadges: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' },
  continueLink: { display: 'block', textAlign: 'center', fontSize: '13px', color: '#9ca3af', textDecoration: 'none' },
  btnPrimary: {
    background: '#0a0a0f', color: '#fff', border: 'none',
    padding: '14px 32px', borderRadius: '12px',
    fontSize: '15px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none',
  },
}

export default Cart
