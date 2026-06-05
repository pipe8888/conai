import { useState, useEffect, useRef } from 'react'

const NAMES = [
  'Valentina', 'Camila', 'Sofía', 'Martina', 'Lucía',
  'Santiago', 'Mateo', 'Nicolás', 'Andrés', 'Diego',
]
const CITIES = [
  'Bogotá', 'Medellín', 'Santiago', 'Buenos Aires', 'Lima',
  'Montevideo', 'Quito', 'Ciudad de México', 'Caracas', 'Asunción',
]
const PRODUCTS = [
  'Glucómetro sin Agujas IA', 'ProBuds X1 con IA', 'SmartWatch Pro IA',
  'FitBand 360 IA', 'SoundMax AI', 'Collar IA para Mascotas',
  'Aspiradora Robot IA', 'Lámpara Terapia de Luz IA',
]
const TIMES = [2, 4, 7, 9, 12, 15, 18, 23]

function pick(arr, seed) {
  return arr[seed % arr.length]
}

function buildNotif(seed) {
  return {
    name:    pick(NAMES,    seed),
    city:    pick(CITIES,   seed + 3),
    product: pick(PRODUCTS, seed + 1),
    mins:    pick(TIMES,    seed + 2),
  }
}

export default function SocialProofPopup() {
  const [visible, setVisible] = useState(false)
  const [notif, setNotif] = useState(null)
  const seedRef = useRef(Math.floor(Math.random() * 100))

  useEffect(() => {
    function show() {
      setNotif(buildNotif(seedRef.current))
      seedRef.current = (seedRef.current + 7) % 100
      setVisible(true)
      const hide = setTimeout(() => setVisible(false), 5000)
      return hide
    }

    const first = setTimeout(() => {
      const hide = show()
      const interval = setInterval(() => {
        clearTimeout(hide)
        show()
      }, 18000)
      return () => clearInterval(interval)
    }, 8000)

    return () => clearTimeout(first)
  }, [])

  if (!notif) return null

  return (
    <div
      style={{
        ...s.wrap,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div style={s.avatar}>{notif.name[0]}</div>
      <div style={s.body}>
        <p style={s.main}>
          <strong>{notif.name}</strong> de {notif.city}
        </p>
        <p style={s.sub}>
          compró <em>{notif.product}</em>
        </p>
        <p style={s.time}>Hace {notif.mins} min · Compra verificada ✓</p>
      </div>
      <button onClick={() => setVisible(false)} style={s.close}>✕</button>
    </div>
  )
}

const s = {
  wrap: {
    position: 'fixed', bottom: '24px', left: '20px', zIndex: 500,
    background: '#fff', borderRadius: '14px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
    border: '1px solid #e5e7eb',
    padding: '14px 16px',
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    maxWidth: '280px',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
  },
  avatar: {
    width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    color: '#fff', fontSize: '15px', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  body: { flex: 1, minWidth: 0 },
  main: { fontSize: '13px', color: '#0a0a0f', margin: '0 0 2px', lineHeight: 1.3 },
  sub: { fontSize: '12px', color: '#374151', margin: '0 0 4px', lineHeight: 1.3 },
  time: { fontSize: '11px', color: '#16a34a', fontWeight: 500, margin: 0 },
  close: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: '#9ca3af', fontSize: '13px', padding: '0 0 0 4px', flexShrink: 0,
    lineHeight: 1, alignSelf: 'flex-start',
  },
}
