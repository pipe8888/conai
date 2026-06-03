import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

function Cart() {
  const { items, total, count, removeFromCart, clearCart } = useCart()

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

          <button style={s.checkoutBtn}>
            Proceder al pago →
          </button>

          <Link to="/productos" style={s.continueLink}>
            ← Continuar comprando
          </Link>
        </div>

      </div>
    </div>
  )
}

const s = {
  wrap: { padding: '40px 5% 80px' },
  empty: { textAlign: 'center', padding: '120px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  emptyTitle: { fontSize: '28px', fontWeight: 800, color: '#f1f0ff' },
  emptySub: { fontSize: '16px', color: '#8b8a9e' },
  header: { marginBottom: '40px' },
  title: { fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '8px' },
  gradient: { background: 'linear-gradient(135deg,#6c63ff,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sub: { fontSize: '16px', color: '#8b8a9e' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  item: { background: '#13131c', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '20px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' },
  itemImg: { fontSize: '48px', minWidth: '64px', textAlign: 'center', background: 'linear-gradient(135deg,rgba(108,99,255,0.12),rgba(34,211,238,0.08))', borderRadius: '12px', padding: '12px' },
  itemInfo: { flex: 1 },
  itemCat: { fontSize: '10px', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px' },
  itemName: { fontSize: '15px', fontWeight: 700, color: '#f1f0ff', marginBottom: '4px' },
  itemDesc: { fontSize: '12px', color: '#8b8a9e', lineHeight: 1.5, marginBottom: '12px' },
  itemBottom: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  itemPrice: { fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg,#6c63ff,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  itemQty: { fontSize: '13px', color: '#8b8a9e', background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: '99px' },
  itemSubtotal: { fontSize: '14px', fontWeight: 700, color: '#a78bfa' },
  removeBtn: { background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', color: '#ff6b6b', borderRadius: '99px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, flexShrink: 0 },
  clearBtn: { background: 'transparent', border: '1px solid rgba(255,100,100,0.2)', color: '#ff6b6b', borderRadius: '99px', padding: '8px 20px', fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-start' },
  summary: { background: '#13131c', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '20px', padding: '28px', position: 'sticky', top: '80px' },
  summaryTitle: { fontSize: '18px', fontWeight: 700, color: '#f1f0ff', marginBottom: '20px' },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' },
  summaryName: { fontSize: '13px', color: '#8b8a9e', flex: 1 },
  summaryPrice: { fontSize: '13px', fontWeight: 600, color: '#f1f0ff' },
  divider: { height: '1px', background: 'rgba(108,99,255,0.2)', margin: '16px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  totalLabel: { fontSize: '16px', fontWeight: 700, color: '#f1f0ff' },
  totalPrice: { fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg,#6c63ff,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  marginBox: { background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '12px', padding: '14px', marginBottom: '20px' },
  marginLabel: { fontSize: '12px', color: '#8b8a9e', marginBottom: '4px' },
  marginValue: { fontSize: '20px', fontWeight: 800, color: '#a78bfa' },
  checkoutBtn: { width: '100%', background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff', border: 'none', padding: '14px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '12px' },
  continueLink: { display: 'block', textAlign: 'center', fontSize: '13px', color: '#8b8a9e', textDecoration: 'none' },
  btnPrimary: { background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' },
}

export default Cart
