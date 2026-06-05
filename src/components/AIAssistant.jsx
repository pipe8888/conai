import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const QUICK_CHIPS = [
  { label: '🎧 Auriculares', cat: 'auriculares' },
  { label: '⌚ Wearables', cat: 'wearables' },
  { label: '💪 Fitness', cat: 'fitness' },
  { label: '❤️ Salud', cat: 'salud' },
  { label: '🏠 Hogar', cat: 'hogar' },
  { label: '🤖 Robots', cat: 'robot' },
]

const KEYWORDS = {
  auriculares: ['auricular', 'audifonos', 'headphone', 'musica', 'sonido', 'escuchar', 'ruido', 'audio', 'cancelacion'],
  fitness:     ['ejercicio', 'gym', 'deporte', 'running', 'correr', 'fitness', 'entrenamiento', 'caloria', 'cardio'],
  salud:       ['salud', 'dormir', 'sueno', 'presion', 'corazon', 'medico', 'bienestar', 'tension'],
  wearables:   ['reloj', 'smartwatch', 'pulsera', 'wearable', 'muneca'],
  hogar:       ['casa', 'hogar', 'cocina', 'aspiradora', 'domotica', 'limpieza', 'seguridad'],
  robot:       ['robot', 'companion', 'automatizacion', 'asistente personal'],
}

const CAT_LABELS = {
  auriculares: '🎧 Auriculares IA',
  fitness:     '💪 Fitness IA',
  salud:       '❤️ Salud IA',
  wearables:   '⌚ Wearables',
  hogar:       '🏠 Hogar Inteligente',
  robot:       '🤖 Robótica IA',
}

const INIT = [{ from: 'bot', text: '¡Hola! Soy el asistente de ConAI ✨\n¿Qué tipo de gadget IA estás buscando?' }]

function matchCategory(input) {
  const lower = input.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => lower.includes(w))) return cat
  }
  return null
}

export default function AIAssistant() {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState(INIT)
  const [input, setInput]     = useState('')
  const [chips, setChips]     = useState(true)
  const endRef                = useRef(null)
  const navigate              = useNavigate()

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (!open) { setMessages(INIT); setInput(''); setChips(true) }
  }, [open])

  function handleChip(chip) {
    setChips(false)
    setMessages(prev => [
      ...prev,
      { from: 'user', text: chip.label },
      { from: 'bot', text: `Te llevo a ${CAT_LABELS[chip.cat]} ahora mismo 🚀`, action: { label: `Ver ${CAT_LABELS[chip.cat]}`, cat: chip.cat } },
    ])
  }

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setInput('')
    setChips(false)
    const cat = matchCategory(text)
    setMessages(prev => [
      ...prev,
      { from: 'user', text },
      {
        from: 'bot',
        text: cat ? `Perfecto, tienes opciones en ${CAT_LABELS[cat]} 🎯` : 'No encontré una categoría exacta, pero puedes explorar todo.',
        action: cat ? { label: `Ver ${CAT_LABELS[cat]}`, cat } : { label: 'Ver todo el catálogo', cat: null },
      },
    ])
  }

  function goTo(cat) {
    setOpen(false)
    navigate(cat ? `/productos?cat=${cat}` : '/productos')
  }

  return (
    <>
      {open && (
        <div style={s.panel}>
          <div style={s.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={s.avatar}>✨</div>
              <div>
                <p style={s.name}>Asistente ConAI</p>
                <p style={s.status}>● Siempre activo</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={s.closeBtn}>✕</button>
          </div>

          <div style={s.msgs}>
            {messages.map((msg, i) => (
              <div key={i} style={{ ...s.msgWrap, alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={msg.from === 'bot' ? s.msgBot : s.msgUser}>
                  {msg.text.split('\n').map((line, j, arr) => (
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                  ))}
                </div>
                {msg.action && (
                  <button onClick={() => goTo(msg.action.cat)} style={s.actionBtn}>
                    {msg.action.label} →
                  </button>
                )}
              </div>
            ))}
            {chips && (
              <div style={s.chips}>
                {QUICK_CHIPS.map(c => (
                  <button key={c.cat} onClick={() => handleChip(c)} style={s.chip}>{c.label}</button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={s.inputRow}>
            <input
              style={s.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ej: busco auriculares para gym..."
            />
            <button onClick={handleSend} style={{ ...s.sendBtn, opacity: input.trim() ? 1 : 0.45 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M9 3l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(o => !o)} style={s.fab} className={open ? '' : 'ai-fab'}>
        <span style={{ fontSize: open ? '18px' : '24px', fontWeight: open ? 700 : 400, color: '#fff', lineHeight: 1 }}>
          {open ? '✕' : '✨'}
        </span>
      </button>
    </>
  )
}

const s = {
  fab: {
    position: 'fixed', bottom: '24px', right: '24px',
    width: '56px', height: '56px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)',
    border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(26,111,255,0.45)',
    zIndex: 252, transition: 'transform 0.2s ease',
  },
  panel: {
    position: 'fixed', bottom: '92px', right: '24px',
    width: '340px', maxHeight: '480px',
    background: '#fff', borderRadius: '20px',
    boxShadow: '0 16px 48px rgba(0,0,0,0.16)',
    display: 'flex', flexDirection: 'column',
    zIndex: 251, overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 18px',
    background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)',
    flexShrink: 0,
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
  },
  name:    { fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 },
  status:  { fontSize: '11px', color: 'rgba(255,255,255,0.8)', margin: 0 },
  closeBtn: {
    background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
    color: '#fff', width: '28px', height: '28px', borderRadius: '99px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
  },
  msgs: {
    flex: 1, overflowY: 'auto', padding: '16px',
    display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0,
  },
  msgWrap:  { display: 'flex', flexDirection: 'column', gap: '6px' },
  msgBot: {
    background: '#f3f4f6', color: '#111827',
    borderRadius: '14px 14px 14px 4px',
    padding: '10px 14px', fontSize: '13px', lineHeight: 1.5,
    maxWidth: '88%', alignSelf: 'flex-start',
  },
  msgUser: {
    background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)', color: '#fff',
    borderRadius: '14px 14px 4px 14px',
    padding: '10px 14px', fontSize: '13px', lineHeight: 1.5,
    maxWidth: '88%', alignSelf: 'flex-end',
  },
  actionBtn: {
    background: '#fff', border: '1.5px solid #1A6FFF', color: '#1A6FFF',
    borderRadius: '99px', padding: '7px 16px',
    fontSize: '12px', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start',
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' },
  chip: {
    background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '99px',
    padding: '6px 14px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
    color: '#374151', whiteSpace: 'nowrap',
  },
  inputRow: {
    display: 'flex', gap: '8px', padding: '12px 16px',
    borderTop: '1px solid #f3f4f6', alignItems: 'center', flexShrink: 0,
  },
  input: {
    flex: 1, border: '1.5px solid #e5e7eb', borderRadius: '99px',
    padding: '10px 16px', fontSize: '13px', outline: 'none',
    color: '#111827', background: '#fafafa', fontFamily: 'inherit',
  },
  sendBtn: {
    width: '38px', height: '38px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #1A6FFF, #66AAFF)',
    border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
}
