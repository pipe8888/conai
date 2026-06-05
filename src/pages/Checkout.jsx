import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Checkout() {
  const { items, total } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'Argentina',
    codigoPostal: '',
  })
  const [errors, setErrors] = useState({})

  if (items.length === 0) {
    return (
      <div style={s.empty}>
        <p style={{ fontSize: '60px' }}>🛒</p>
        <h2 style={s.emptyTitle}>Tu carrito está vacío</h2>
        <Link to="/productos" style={s.btnPrimary}>Explorar productos →</Link>
      </div>
    )
  }

  function validate() {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.telefono.trim()) e.telefono = 'Requerido'
    if (!form.direccion.trim()) e.direccion = 'Requerido'
    if (!form.ciudad.trim()) e.ciudad = 'Requerido'
    if (!form.codigoPostal.trim()) e.codigoPostal = 'Requerido'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    navigate('/checkout/pago', { state: { form } })
  }

  return (
    <div style={s.wrap}>
      <div style={s.inner}>

        {/* Breadcrumb */}
        <div style={s.breadcrumb}>
          <Link to="/carrito" style={s.breadLink}>Carrito</Link>
          <span style={s.breadSep}> › </span>
          <span style={s.breadActive}>Datos de envío</span>
          <span style={s.breadSep}> › </span>
          <span style={s.breadFuture}>Pago</span>
        </div>

        <div style={s.layout}>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} noValidate>
            <h2 style={s.sectionTitle}>Información personal</h2>
            <div style={s.grid2}>
              <Field label="Nombre completo" name="nombre" value={form.nombre} onChange={handleChange} error={errors.nombre} placeholder="Juan García" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="juan@email.com" />
            </div>
            <Field label="Teléfono" name="telefono" type="tel" value={form.telefono} onChange={handleChange} error={errors.telefono} placeholder="+54 9 11 1234-5678" />

            <h2 style={{ ...s.sectionTitle, marginTop: '32px' }}>Dirección de envío</h2>
            <Field label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} error={errors.direccion} placeholder="Calle 123, Piso 4, Depto B" />
            <div style={s.grid2}>
              <Field label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} error={errors.ciudad} placeholder="Buenos Aires" />
              <Field label="Código postal" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} error={errors.codigoPostal} placeholder="1425" />
            </div>
            <div style={s.fieldWrap}>
              <label style={s.label}>País</label>
              <select name="pais" value={form.pais} onChange={handleChange} style={s.select}>
                <option>Argentina</option>
                <option>México</option>
                <option>Colombia</option>
                <option>Chile</option>
                <option>Perú</option>
                <option>Uruguay</option>
                <option>Ecuador</option>
                <option>Bolivia</option>
                <option>Venezuela</option>
                <option>Paraguay</option>
                <option>España</option>
              </select>
            </div>

            <button type="submit" style={s.btnContinue}>
              Continuar al pago →
            </button>
          </form>

          {/* RESUMEN */}
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
            <div style={s.divider}/>
            <div style={s.totalRow}>
              <span style={s.totalLabel}>Total</span>
              <span style={s.totalAmount}>${total.toFixed(2)} USD</span>
            </div>
            <div style={s.shippingNote}>
              🚚 Envío calculado en el siguiente paso
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder }) {
  return (
    <div style={s.fieldWrap}>
      <label style={s.label}>{label}</label>
      <input
        style={{ ...s.input, ...(error ? s.inputError : {}) }}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="on"
      />
      {error && <span style={s.errorMsg}>{error}</span>}
    </div>
  )
}

const s = {
  wrap: { background: '#f9fafb', minHeight: '100vh', padding: '40px 5% 80px' },
  inner: { maxWidth: '960px', margin: '0 auto' },
  empty: { textAlign: 'center', padding: '120px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', minHeight: '100vh' },
  emptyTitle: { fontSize: '24px', fontWeight: 700, color: '#0a0a0f' },

  breadcrumb: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '36px', fontSize: '13px' },
  breadLink: { color: '#1A6FFF', textDecoration: 'none', fontWeight: 500 },
  breadSep: { color: '#d1d5db' },
  breadActive: { color: '#0a0a0f', fontWeight: 600 },
  breadFuture: { color: '#9ca3af' },

  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'start' },

  sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#0a0a0f', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #e5e7eb' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },

  fieldWrap: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', letterSpacing: '0.04em', marginBottom: '6px', textTransform: 'uppercase' },
  input: { width: '100%', height: '44px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#0a0a0f', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' },
  inputError: { borderColor: '#ef4444' },
  select: { width: '100%', height: '44px', padding: '0 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#0a0a0f', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', cursor: 'pointer' },
  errorMsg: { display: 'block', fontSize: '11px', color: '#ef4444', marginTop: '4px', fontWeight: 500 },

  btnContinue: { width: '100%', marginTop: '28px', background: 'linear-gradient(135deg, #1A6FFF, #4F94FF)', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' },
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
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  totalLabel: { fontSize: '15px', fontWeight: 700, color: '#0a0a0f' },
  totalAmount: { fontSize: '20px', fontWeight: 800, color: '#1A6FFF' },
  shippingNote: { fontSize: '12px', color: '#6b7280', background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' },
}

export default Checkout
