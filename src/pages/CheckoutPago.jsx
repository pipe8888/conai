import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CARD_BRANDS = {
  visa: { pattern: /^4/, label: 'Visa', color: '#1A1F71' },
  mastercard: { pattern: /^5[1-5]/, label: 'Mastercard', color: '#EB001B' },
  amex: { pattern: /^3[47]/, label: 'Amex', color: '#007CC3' },
}

function detectBrand(num) {
  const clean = num.replace(/\s/g, '')
  for (const [key, b] of Object.entries(CARD_BRANDS)) {
    if (b.pattern.test(clean)) return key
  }
  return null
}

function formatCardNumber(val) {
  const digits = val.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

export default function CheckoutPago() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const shippingData = location.state?.form

  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [errors, setErrors] = useState({})
  const [flipped, setFlipped] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!shippingData) navigate('/checkout', { replace: true })
  }, [shippingData, navigate])

  if (items.length === 0) {
    return (
      <div style={s.empty}>
        <p style={{ fontSize: '60px' }}>🛒</p>
        <h2 style={s.emptyTitle}>Tu carrito está vacío</h2>
        <Link to="/productos" style={s.btnPrimary}>Explorar productos →</Link>
      </div>
    )
  }

  const brand = detectBrand(card.number)

  function handleChange(e) {
    let { name, value } = e.target
    if (name === 'number') value = formatCardNumber(value)
    if (name === 'expiry') value = formatExpiry(value)
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4)
    setCard(c => ({ ...c, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }))
  }

  function validate() {
    const e = {}
    const digits = card.number.replace(/\s/g, '')
    if (digits.length < 13) e.number = 'Número inválido'
    if (!card.name.trim()) e.name = 'Requerido'
    const [mm, yy] = card.expiry.split('/')
    const now = new Date()
    const expYear = 2000 + Number(yy)
    const expMonth = Number(mm)
    if (!mm || !yy || expMonth < 1 || expMonth > 12 || expYear < now.getFullYear() ||
      (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
      e.expiry = 'Fecha inválida'
    }
    if (card.cvv.length < 3) e.cvv = 'CVV inválido'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setProcessing(true)
    await new Promise(r => setTimeout(r, 2200))
    clearCart()
    navigate('/checkout/confirmacion', {
      state: {
        form: shippingData,
        card: { last4: card.number.slice(-4), brand },
        total,
        items,
        orderId: 'ORD-' + Date.now().toString(36).toUpperCase(),
      },
      replace: true,
    })
  }

  const maskedNumber = card.number || '•••• •••• •••• ••••'
  const maskedName = card.name || 'NOMBRE APELLIDO'
  const maskedExpiry = card.expiry || 'MM/AA'

  return (
    <div style={s.wrap}>
      {processing && (
        <div style={s.processingOverlay}>
          <div style={s.processingBox}>
            <div style={s.spinner} />
            <p style={s.processingText}>Procesando pago...</p>
            <p style={s.processingSubtext}>No cierres esta ventana</p>
          </div>
        </div>
      )}

      <div style={s.inner}>
        <div style={s.breadcrumb}>
          <Link to="/carrito" style={s.breadLink}>Carrito</Link>
          <span style={s.breadSep}> › </span>
          <Link to="/checkout" style={s.breadLink}>Datos de envío</Link>
          <span style={s.breadSep}> › </span>
          <span style={s.breadActive}>Pago</span>
        </div>

        <div style={s.layout}>
          <div>
            {/* Tarjeta visual */}
            <div style={s.cardPreviewWrap} onClick={() => setFlipped(f => !f)}>
              <div style={{ ...s.cardPreview, ...(flipped ? s.cardFlipped : {}) }}>
                {/* Frente */}
                <div style={s.cardFront}>
                  <div style={s.cardChip} />
                  <p style={s.cardNumber}>{maskedNumber}</p>
                  <div style={s.cardBottom}>
                    <div>
                      <p style={s.cardLabel}>TITULAR</p>
                      <p style={s.cardValue}>{maskedName.toUpperCase()}</p>
                    </div>
                    <div>
                      <p style={s.cardLabel}>VENCE</p>
                      <p style={s.cardValue}>{maskedExpiry}</p>
                    </div>
                    {brand && <p style={s.cardBrand}>{CARD_BRANDS[brand].label}</p>}
                  </div>
                </div>
                {/* Reverso */}
                <div style={s.cardBack}>
                  <div style={s.cardStripe} />
                  <div style={s.cardCvvRow}>
                    <div style={s.cardCvvBar} />
                    <p style={s.cardCvvVal}>{card.cvv || '•••'}</p>
                  </div>
                  <p style={s.cardBackNote}>Toca para voltear</p>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} noValidate>
              <h2 style={s.sectionTitle}>Datos de la tarjeta</h2>

              <div style={s.fieldWrap}>
                <label style={s.label}>Número de tarjeta</label>
                <input
                  style={{ ...s.input, ...(errors.number ? s.inputError : {}) }}
                  name="number" value={card.number} onChange={handleChange}
                  placeholder="1234 5678 9012 3456" maxLength={19}
                  inputMode="numeric" autoComplete="cc-number"
                />
                {errors.number && <span style={s.errorMsg}>{errors.number}</span>}
              </div>

              <div style={s.fieldWrap}>
                <label style={s.label}>Nombre en la tarjeta</label>
                <input
                  style={{ ...s.input, ...(errors.name ? s.inputError : {}) }}
                  name="name" value={card.name} onChange={handleChange}
                  placeholder="Juan García" autoComplete="cc-name"
                />
                {errors.name && <span style={s.errorMsg}>{errors.name}</span>}
              </div>

              <div style={s.grid2}>
                <div style={s.fieldWrap}>
                  <label style={s.label}>Vencimiento</label>
                  <input
                    style={{ ...s.input, ...(errors.expiry ? s.inputError : {}) }}
                    name="expiry" value={card.expiry} onChange={handleChange}
                    placeholder="MM/AA" maxLength={5} inputMode="numeric"
                    autoComplete="cc-exp"
                  />
                  {errors.expiry && <span style={s.errorMsg}>{errors.expiry}</span>}
                </div>
                <div style={s.fieldWrap}>
                  <label style={s.label}>CVV</label>
                  <input
                    style={{ ...s.input, ...(errors.cvv ? s.inputError : {}) }}
                    name="cvv" value={card.cvv} onChange={handleChange}
                    placeholder="•••" maxLength={4} inputMode="numeric"
                    autoComplete="cc-csc"
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                  />
                  {errors.cvv && <span style={s.errorMsg}>{errors.cvv}</span>}
                </div>
              </div>

              <div style={s.securityNote}>
                <span>🔒</span>
                <span>Pago cifrado con SSL 256-bit. Tus datos están protegidos.</span>
              </div>

              <button type="submit" style={s.btnPay} disabled={processing}>
                {processing ? 'Procesando...' : `Pagar $${total.toFixed(2)} USD`}
              </button>

              <Link to="/checkout" style={s.backLink}>← Volver a datos de envío</Link>
            </form>
          </div>

          {/* Resumen */}
          <div style={s.summary}>
            <h3 style={s.summaryTitle}>Resumen del pedido</h3>
            <div style={s.summaryItems}>
              {items.map(item => (
                <div key={item.id} style={s.summaryRow}>
                  <span style={s.summaryName}>{item.name}</span>
                  <div style={s.summaryRight}>
                    <span style={s.summaryQty}>×{item.quantity}</span>
                    <span style={s.summaryPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={s.divider} />
            <div style={s.totalRow}>
              <span style={s.totalLabel}>Total a pagar</span>
              <span style={s.totalAmount}>${total.toFixed(2)} USD</span>
            </div>
            {shippingData && (
              <div style={s.shippingInfo}>
                <p style={s.shippingInfoTitle}>Envío a:</p>
                <p style={s.shippingInfoText}>{shippingData.nombre}</p>
                <p style={s.shippingInfoText}>{shippingData.direccion}</p>
                <p style={s.shippingInfoText}>{shippingData.ciudad}, {shippingData.pais}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes processingPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>
    </div>
  )
}

const s = {
  wrap: { background: '#f9fafb', minHeight: '100vh', padding: '40px 5% 80px', position: 'relative' },
  inner: { maxWidth: '960px', margin: '0 auto' },
  empty: { textAlign: 'center', padding: '120px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', minHeight: '100vh' },
  emptyTitle: { fontSize: '24px', fontWeight: 700, color: '#0a0a0f' },

  processingOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  processingBox: { background: '#fff', borderRadius: '20px', padding: '48px 56px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  spinner: { width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#1A6FFF', borderRadius: '50%', animation: 'spin 0.9s linear infinite' },
  processingText: { fontSize: '18px', fontWeight: 700, color: '#0a0a0f', margin: 0 },
  processingSubtext: { fontSize: '13px', color: '#6b7280', margin: 0 },

  breadcrumb: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '36px', fontSize: '13px' },
  breadLink: { color: '#1A6FFF', textDecoration: 'none', fontWeight: 500 },
  breadSep: { color: '#d1d5db' },
  breadActive: { color: '#0a0a0f', fontWeight: 600 },

  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'start' },

  cardPreviewWrap: { perspective: '1000px', marginBottom: '32px', cursor: 'pointer' },
  cardPreview: {
    width: '100%', maxWidth: '380px', height: '210px', position: 'relative',
    transformStyle: 'preserve-3d', transition: 'transform 0.6s ease',
    borderRadius: '16px',
  },
  cardFlipped: { transform: 'rotateY(180deg)' },
  cardFront: {
    position: 'absolute', inset: 0, borderRadius: '16px', padding: '24px',
    background: 'linear-gradient(135deg, #1A2980 0%, #1A6FFF 60%, #26D0CE 100%)',
    boxShadow: '0 20px 60px rgba(26,111,255,0.35)',
    backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    color: '#fff',
  },
  cardChip: { width: '40px', height: '30px', background: 'linear-gradient(135deg, #F0D060, #C8A020)', borderRadius: '6px' },
  cardNumber: { fontSize: '20px', fontWeight: 600, letterSpacing: '0.12em', margin: 0, fontFamily: 'monospace', textShadow: '0 1px 2px rgba(0,0,0,0.3)' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { fontSize: '9px', fontWeight: 600, opacity: 0.7, letterSpacing: '0.1em', margin: '0 0 2px' },
  cardValue: { fontSize: '13px', fontWeight: 600, margin: 0, letterSpacing: '0.04em' },
  cardBrand: { fontSize: '18px', fontWeight: 800, margin: 0, opacity: 0.9 },

  cardBack: {
    position: 'absolute', inset: 0, borderRadius: '16px',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
    overflow: 'hidden',
  },
  cardStripe: { height: '44px', background: '#000', margin: '28px 0 0' },
  cardCvvRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px 0' },
  cardCvvBar: { flex: 1, height: '36px', background: '#fff', borderRadius: '4px' },
  cardCvvVal: { fontSize: '18px', fontWeight: 700, color: '#fff', fontFamily: 'monospace', margin: 0, minWidth: '48px', textAlign: 'center' },
  cardBackNote: { textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '16px 0 0' },

  sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#0a0a0f', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #e5e7eb' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldWrap: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', letterSpacing: '0.04em', marginBottom: '6px', textTransform: 'uppercase' },
  input: { width: '100%', height: '44px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#0a0a0f', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  inputError: { borderColor: '#ef4444' },
  errorMsg: { display: 'block', fontSize: '11px', color: '#ef4444', marginTop: '4px', fontWeight: 500 },

  securityNote: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px' },

  btnPay: { width: '100%', background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.02em', marginBottom: '12px' },
  backLink: { display: 'block', textAlign: 'center', fontSize: '13px', color: '#6b7280', textDecoration: 'none', marginTop: '4px' },
  btnPrimary: { background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' },

  summary: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', position: 'sticky', top: '88px' },
  summaryTitle: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f', marginBottom: '20px' },
  summaryItems: { display: 'flex', flexDirection: 'column', gap: '12px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' },
  summaryName: { fontSize: '13px', color: '#374151', flex: 1, lineHeight: 1.4 },
  summaryRight: { display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 },
  summaryQty: { fontSize: '12px', color: '#9ca3af', background: '#f3f4f6', padding: '2px 7px', borderRadius: '99px' },
  summaryPrice: { fontSize: '13px', fontWeight: 600, color: '#0a0a0f' },
  divider: { height: '1px', background: '#e5e7eb', margin: '16px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  totalLabel: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f' },
  totalAmount: { fontSize: '20px', fontWeight: 800, color: '#1A6FFF' },
  shippingInfo: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px' },
  shippingInfoTitle: { fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' },
  shippingInfoText: { fontSize: '13px', color: '#374151', margin: '2px 0' },
}
