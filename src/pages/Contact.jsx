import { useState } from 'react'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (form.name && form.email && form.message) {
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 4000)
    }
  }

  return (
    <div style={s.wrap}>

      {/* HEADER */}
      <div style={s.header}>
        <p style={s.label}>¿Tienes dudas?</p>
        <h1 style={s.title}>Contáctanos <span style={s.gradient}>ahora</span></h1>
        <p style={s.sub}>Nuestro equipo responde en menos de 24 horas.</p>
      </div>

      <div style={s.layout}>

        {/* FORMULARIO */}
        <div style={s.formBox}>
          {sent && (
            <div style={s.successMsg}>
              ✅ ¡Mensaje enviado! Te responderemos pronto.
            </div>
          )}

          <div style={s.row}>
            <div style={s.field}>
              <label style={s.fieldLabel}>Nombre</label>
              <input
                style={s.input}
                type="text"
                name="name"
                placeholder="Tu nombre"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div style={s.field}>
              <label style={s.fieldLabel}>Email</label>
              <input
                style={s.input}
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.fieldLabel}>Asunto</label>
            <input
              style={s.input}
              type="text"
              name="subject"
              placeholder="¿En qué podemos ayudarte?"
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div style={s.field}>
            <label style={s.fieldLabel}>Mensaje</label>
            <textarea
              style={s.textarea}
              name="message"
              placeholder="Escribe tu mensaje aquí..."
              value={form.message}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <button onClick={handleSubmit} style={s.btnPrimary}>
            Enviar mensaje →
          </button>
        </div>

        {/* INFO */}
        <div style={s.infoCol}>
          {[
            { icon: '📧', title: 'Email', val: 'hola@dropifyai.com' },
            { icon: '💬', title: 'WhatsApp', val: '+56 9 1234 5678' },
            { icon: '🕐', title: 'Horario', val: 'Lun - Vie, 9am - 6pm' },
            { icon: '📍', title: 'Ubicación', val: 'Santiago, Chile 🇨🇱' },
          ].map((info, i) => (
            <div key={i} style={s.infoCard}>
              <span style={s.infoIcon}>{info.icon}</span>
              <div>
                <p style={s.infoTitle}>{info.title}</p>
                <p style={s.infoVal}>{info.val}</p>
              </div>
            </div>
          ))}

          <div style={s.faqBox}>
            <p style={s.faqTitle}>Preguntas frecuentes</p>
            {[
              { q: '¿Hacen envíos a toda Latinoamérica?', a: 'Sí, enviamos a Chile, Argentina, México, Colombia y más.' },
              { q: '¿Cuánto tarda el envío?', a: 'Entre 24 y 72 horas hábiles según tu ubicación.' },
              { q: '¿Tienen garantía los productos?', a: '30 días de garantía en todos nuestros productos IA.' },
            ].map((faq, i) => (
              <div key={i} style={s.faqItem}>
                <p style={s.faqQ}>{faq.q}</p>
                <p style={s.faqA}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

const s = {
  wrap: { padding: '40px 5% 80px' },
  header: { textAlign: 'center', marginBottom: '48px' },
  label: { fontSize: '12px', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' },
  title: { fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' },
  gradient: { background: 'linear-gradient(135deg,#6c63ff,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sub: { fontSize: '16px', color: '#8b8a9e' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' },
  formBox: { background: '#13131c', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' },
  successMsg: { background: 'rgba(29,158,117,0.15)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: '12px', padding: '14px 20px', color: '#1D9E75', fontSize: '14px', fontWeight: 600 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  fieldLabel: { fontSize: '13px', fontWeight: 600, color: '#a78bfa' },
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: '12px', padding: '12px 16px', color: '#f1f0ff', fontSize: '14px', outline: 'none' },
  textarea: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: '12px', padding: '12px 16px', color: '#f1f0ff', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' },
  btnPrimary: { background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' },
  infoCol: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoCard: { background: '#13131c', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' },
  infoIcon: { fontSize: '28px', minWidth: '40px', textAlign: 'center' },
  infoTitle: { fontSize: '12px', color: '#8b8a9e', marginBottom: '2px' },
  infoVal: { fontSize: '14px', fontWeight: 600, color: '#f1f0ff' },
  faqBox: { background: '#13131c', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '16px', padding: '20px' },
  faqTitle: { fontSize: '14px', fontWeight: 700, color: '#f1f0ff', marginBottom: '16px' },
  faqItem: { borderBottom: '1px solid rgba(108,99,255,0.1)', paddingBottom: '12px', marginBottom: '12px' },
  faqQ: { fontSize: '13px', fontWeight: 600, color: '#a78bfa', marginBottom: '4px' },
  faqA: { fontSize: '13px', color: '#8b8a9e', lineHeight: 1.5 },
}

export default Contact
