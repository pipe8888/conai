import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state
  const drawn = useRef(false)

  useEffect(() => {
    if (!data) { navigate('/', { replace: true }); return }
    if (drawn.current) return
    drawn.current = true
    const canvas = document.getElementById('confetti-canvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 100,
      r: 5 + Math.random() * 6,
      color: ['#1A6FFF', '#33AAFF', '#FFD700', '#22c55e', '#f97316'][Math.floor(Math.random() * 5)],
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 8,
    }))
    let frame
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6)
        ctx.restore()
        p.x += p.vx; p.y += p.vy; p.rotation += p.vr; p.vy += 0.05
      })
      if (particles.some(p => p.y < canvas.height + 20)) frame = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [data, navigate])

  if (!data) return null

  const { form, card, total, items, orderId } = data
  const brandLabel = card?.brand ? { visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex' }[card.brand] || 'Tarjeta' : 'Tarjeta'

  return (
    <div style={s.wrap}>
      <canvas id="confetti-canvas" style={s.canvas} />

      <div style={s.inner}>
        <div style={s.checkCircle}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#22c55e"/>
            <path d="M10 20l7 7 13-14" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 style={s.title}>¡Pedido confirmado!</h1>
        <p style={s.subtitle}>Gracias <strong>{form?.nombre?.split(' ')[0]}</strong>. Te enviamos la confirmación a <strong>{form?.email}</strong>.</p>

        <div style={s.orderIdBox}>
          <span style={s.orderIdLabel}>N° de pedido</span>
          <span style={s.orderIdValue}>{orderId}</span>
        </div>

        <div style={s.card}>
          <h3 style={s.cardTitle}>Resumen de tu compra</h3>
          <div style={s.itemsList}>
            {items?.map(item => (
              <div key={item.id} style={s.itemRow}>
                <span style={s.itemEmoji}>{item.emoji}</span>
                <div style={s.itemInfo}>
                  <p style={s.itemName}>{item.name}</p>
                  <p style={s.itemQty}>Cantidad: {item.quantity}</p>
                </div>
                <span style={s.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={s.divider}/>
          <div style={s.totalRow}>
            <span style={s.totalLabel}>Total pagado</span>
            <span style={s.totalAmount}>${total?.toFixed(2)} USD</span>
          </div>
        </div>

        <div style={s.infoGrid}>
          <div style={s.infoBox}>
            <p style={s.infoBoxTitle}>📦 Dirección de envío</p>
            <p style={s.infoText}>{form?.nombre}</p>
            <p style={s.infoText}>{form?.direccion}</p>
            <p style={s.infoText}>{form?.ciudad}, {form?.codigoPostal}</p>
            <p style={s.infoText}>{form?.pais}</p>
          </div>
          <div style={s.infoBox}>
            <p style={s.infoBoxTitle}>💳 Método de pago</p>
            <p style={s.infoText}>{brandLabel} terminada en {card?.last4 || '••••'}</p>
            <p style={s.infoText}>Pago procesado correctamente</p>
            <br/>
            <p style={s.infoBoxTitle}>🚚 Tiempo de entrega</p>
            <p style={s.infoText}>24 – 48 horas hábiles</p>
          </div>
        </div>

        <div style={s.actions}>
          <Link to="/productos" style={s.btnSecondary}>Seguir comprando</Link>
          <Link to="/" style={s.btnPrimary}>Ir al inicio</Link>
        </div>
      </div>
    </div>
  )
}

const s = {
  wrap: { background: '#f9fafb', minHeight: '100vh', padding: '60px 5% 80px', position: 'relative', overflow: 'hidden' },
  canvas: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 },
  inner: { maxWidth: '600px', margin: '0 auto', textAlign: 'center' },
  checkCircle: { display: 'inline-flex', marginBottom: '24px', filter: 'drop-shadow(0 8px 24px rgba(34,197,94,0.4))' },
  title: { fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, color: '#0a0a0f', marginBottom: '12px', letterSpacing: '-1px' },
  subtitle: { fontSize: '16px', color: '#6b7280', marginBottom: '28px', lineHeight: 1.6 },
  orderIdBox: { display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '12px 20px', marginBottom: '36px' },
  orderIdLabel: { fontSize: '12px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase' },
  orderIdValue: { fontSize: '15px', fontWeight: 700, color: '#1A6FFF', fontFamily: 'monospace', letterSpacing: '0.04em' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px', marginBottom: '20px', textAlign: 'left' },
  cardTitle: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f', marginBottom: '20px' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '14px' },
  itemEmoji: { fontSize: '32px', background: '#f9fafb', borderRadius: '10px', padding: '8px', lineHeight: 1 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: '14px', fontWeight: 600, color: '#0a0a0f', margin: '0 0 2px' },
  itemQty: { fontSize: '12px', color: '#9ca3af', margin: 0 },
  itemPrice: { fontSize: '14px', fontWeight: 700, color: '#0a0a0f' },
  divider: { height: '1px', background: '#e5e7eb', margin: '20px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f' },
  totalAmount: { fontSize: '22px', fontWeight: 800, color: '#1A6FFF' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px', textAlign: 'left' },
  infoBox: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' },
  infoBoxTitle: { fontSize: '13px', fontWeight: 700, color: '#0a0a0f', marginBottom: '10px' },
  infoText: { fontSize: '13px', color: '#6b7280', margin: '3px 0' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'center' },
  btnPrimary: { background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' },
  btnSecondary: { background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' },
}
