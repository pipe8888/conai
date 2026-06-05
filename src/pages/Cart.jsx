import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'

function Cart() {
  const { items, total, count, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div style={s.empty}>
      <p style={{ fontSize: '72px' }}>🛒</p>
      <h2 style={s.emptyTitle}>Tu carrito está vacío</h2>
      <p style={s.emptySub}>Agrega productos increíbles con IA a tu carrito.</p>
      <Link to="/productos" style={s.btnPrimary}>Explorar productos →</Link>
    </div>
  )

  return (
    <div style={s.wrap}>

      {/* HEADER */}
      <div style={s.header}>
        <h1 style={s.title}>Tu <span style={s.gradient}>Carrito</span></h1>
        <p style={s.sub}>{count} producto{count !== 1 ? 's' : ''} agregado{count !== 1 ? 's' : ''}</p>
      </div>

      <div style={s.layout}>

        {/* LISTA DE ITEMS */}
        <div style={s.itemsList}>
          {items.map(item => (
            <div key={item.id} style={s.item}>
              <div style={s.itemImg}>{item.emoji}</div>
              <div style={s.itemInfo}>
                <p style={s.itemCat}>{item.category.toUpperCase()}</p>
                <p style={s.itemName}>{item.name}</p>
                <p style={s.itemDesc}>{item.description}</p>
                <div style={s.itemBottom}>
                  <span style={s.itemPrice}>${item.price}</span>
                  <span style={s.itemQty}>x{item.quantity}</span>
                  <span style={s.itemSubtotal}>
                    = ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                style={s.removeBtn}
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}

          {/* LIMPIAR CARRITO */}
          <button onClick={clearCart} style={s.clearBtn}>
            🗑️ Vaciar carrito
          </button>
        </div>

        {/* RESUMEN */}
        <div style={s.summary}>
          <h2 style={s.summaryTitle}>Resumen del pedido</h2>

          <div style={s.summaryRows}>
            {items.map(item => (
              <div key={item.id} style={s.summaryRow}>
                <span style={s.summaryName}>{item.emoji} {item.name}</span>
                <span style={s.summaryPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={s.divider} />

          <div style={s.totalRow}>
            <span style={s.totalLabel}>Total</span>
            <span style={s.totalPrice}>${total.toFixed(2)}</span>
          </div>

          <div style={s.marginBox}>
            <p style={s.marginLabel}>💰 Ganancia estimada (margen promedio 74%)</p>
            <p style={s.marginValue}>${(total * 0.74).toFixed(2)} USD</p>
          </div>

          <button style={s.checkoutBtn} onClick={() => navigate('/checkout')}>
            Proceder al pago →
          </button>

          <div style={s.trustBadges}>
            <div style={s.trustItem}><span>🔒</span><span style={{ color: '#22c55e' }}>Pago 100% seguro</span></div>
            <div style={s.trustItem}><span>🚚</span><span style={{ color: '#3b82f6' }}>Envío en 24-48h</span></div>
            <div style={s.trustItem}><span>↩️</span><span style={{ color: '#6b7280' }}>Devolución en 30 días</span></div>
          </div>

          <Link to="/productos" style={s.continueLink}>
            ← Continuar comprando
          </Link>
        </div>

      </div>
    </div>
  )
}

const s = {
  wrap: { padding: '40px 5% 80px', background: '#f8f9fa', minHeight: '100vh' },
  empty: { textAlign: 'center', padding: '120px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: '#f8f9fa', minHeight: '100vh' },
  emptyTitle: { fontSize: '28px', fontWeight: 800, color: '#0a0a0f' },
  emptySub: { fontSize: '16px', color: '#6b7280' },
  header: { marginBottom: '40px' },
  title: { fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '8px', color: '#0a0a0f' },
  gradient: { background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sub: { fontSize: '16px', color: '#6b7280' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  item: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  itemImg: { fontSize: '48px', minWidth: '64px', textAlign: 'center', background: '#f8f9fa', borderRadius: '12px', padding: '12px' },
  itemInfo: { flex: 1 },
  itemCat: { fontSize: '10px', color: '#1A6FFF', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px' },
  itemName: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f', marginBottom: '4px' },
  itemDesc: { fontSize: '12px', color: '#6b7280', lineHeight: 1.5, marginBottom: '12px' },
  itemBottom: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  itemPrice: { fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  itemQty: { fontSize: '13px', color: '#6b7280', background: '#f3f4f6', padding: '3px 10px', borderRadius: '99px' },
  itemSubtotal: { fontSize: '14px', fontWeight: 700, color: '#374151' },
  removeBtn: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '99px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, flexShrink: 0 },
  clearBtn: { background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '99px', padding: '8px 20px', fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-start' },
  summary: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '28px', position: 'sticky', top: '80px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  summaryTitle: { fontSize: '18px', fontWeight: 700, color: '#0a0a0f', marginBottom: '20px' },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' },
  summaryName: { fontSize: '13px', color: '#6b7280', flex: 1 },
  summaryPrice: { fontSize: '13px', fontWeight: 600, color: '#0a0a0f' },
  divider: { height: '1px', background: '#e5e7eb', margin: '16px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  totalLabel: { fontSize: '16px', fontWeight: 700, color: '#0a0a0f' },
  totalPrice: { fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  marginBox: { background: 'rgba(26,111,255,0.06)', border: '1px solid rgba(26,111,255,0.15)', borderRadius: '12px', padding: '14px', marginBottom: '20px' },
  marginLabel: { fontSize: '12px', color: '#6b7280', marginBottom: '4px' },
  marginValue: { fontSize: '20px', fontWeight: 800, color: '#1A6FFF' },
  checkoutBtn: { width: '100%', background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', border: 'none', padding: '14px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '12px' },
  trustBadges: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '14px' },
  trustItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500 },
  continueLink: { display: 'block', textAlign: 'center', fontSize: '13px', color: '#6b7280', textDecoration: 'none' },
  btnPrimary: { background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' },
}

export default Cart
