import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const { items, total, count, drawerOpen, closeDrawer, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!drawerOpen) return
    const fn = e => { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [drawerOpen, closeDrawer])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  function goTo(path) {
    closeDrawer()
    navigate(path)
  }

  return (
    <>
      <div
        onClick={closeDrawer}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.45)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 301,
        width: '420px', maxWidth: '100vw',
        background: '#fff',
        display: 'flex', flexDirection: 'column',
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
      }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#0a0a0f' }}>Tu carrito</span>
            {count > 0 && (
              <span style={{ background: 'linear-gradient(135deg,#818cf8,#6366f1)', color: '#fff', borderRadius: '99px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>
                {count}
              </span>
            )}
          </div>
          <button onClick={closeDrawer} style={{ background: '#f9fafb', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '99px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#6b7280' }}>
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', paddingTop: '60px' }}>
              <span style={{ fontSize: '52px' }}>🛒</span>
              <p style={{ fontSize: '15px', color: '#6b7280', margin: 0, fontWeight: 500 }}>Tu carrito está vacío</p>
              <button onClick={() => goTo('/productos')} style={{ background: '#0a0a0f', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '12px', padding: '12px 28px', fontSize: '14px', fontWeight: 600 }}>
                Ver productos
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fafafa', borderRadius: '14px', padding: '12px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', flexShrink: 0 }}>
                  {item.emoji || '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0f', margin: '0 0 3px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#6366f1', margin: '0 0 8px' }}>
                    ${item.price.toFixed(2)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '26px', height: '26px', borderRadius: '99px', background: '#fff', border: '1.5px solid #e5e7eb', cursor: 'pointer', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>−</button>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0f', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '26px', height: '26px', borderRadius: '99px', background: '#fff', border: '1.5px solid #e5e7eb', cursor: 'pointer', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: '16px', padding: '4px', flexShrink: 0, alignSelf: 'flex-start' }}>✕</button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>Subtotal</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#0a0a0f' }}>${total.toFixed(2)}</span>
            </div>
            <button onClick={() => goTo('/checkout')} style={{ background: '#0a0a0f', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '12px', padding: '15px', fontSize: '15px', fontWeight: 700, width: '100%' }}>
              Ir al checkout →
            </button>
            <button onClick={() => goTo('/carrito')} style={{ background: 'transparent', border: '1.5px solid #e5e7eb', cursor: 'pointer', borderRadius: '12px', padding: '11px', fontSize: '13px', fontWeight: 500, color: '#6b7280', width: '100%' }}>
              Ver carrito completo
            </button>
          </div>
        )}

      </div>
    </>
  )
}
