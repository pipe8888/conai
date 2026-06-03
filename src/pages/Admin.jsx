import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const empty = { name: '', price: '', description: '', category: '', image_url: '', emoji: '🤖', badge: '', margin: 60, viral: false }

function Admin() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('id'),
      supabase.from('categories').select('*').order('id'),
    ])
    setProducts(prods || [])
    setCategories(cats || [])
    setLoading(false)
  }

  function openNew() {
    setEditProduct(null)
    setForm(empty)
    setMsg('')
    setShowForm(true)
  }

  function openEdit(product) {
    setEditProduct(product)
    setForm({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      category: product.category || '',
      image_url: product.image_url || '',
      emoji: product.emoji || '🤖',
      badge: product.badge || '',
      margin: product.margin || 60,
      viral: product.viral || false,
    })
    setMsg('')
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      description: form.description,
      category: form.category,
      image_url: form.image_url || null,
      emoji: form.emoji,
      badge: form.badge,
      margin: parseInt(form.margin),
      viral: form.viral,
    }

    const { error } = editProduct
      ? await supabase.from('products').update(payload).eq('id', editProduct.id)
      : await supabase.from('products').insert([payload])

    if (error) {
      setMsg('Error: ' + error.message)
    } else {
      setShowForm(false)
      fetchData()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) fetchData()
  }

  return (
    <div style={s.wrap}>

      {/* HEADER */}
      <div style={s.header}>
        <div>
          <p style={s.label}>ConAI</p>
          <h1 style={s.title}>Panel Admin</h1>
          <p style={s.sub}>{products.length} productos · {categories.length} categorías</p>
        </div>
        <div style={s.headerRight}>
          <button onClick={() => navigate('/')} style={s.btnSecondary}>Ver tienda</button>
          <button onClick={async () => { await logout(); navigate('/') }} style={s.btnGhost}>Salir</button>
        </div>
      </div>

      {/* ADD BUTTON */}
      <button onClick={openNew} style={s.btnAdd}>+ Agregar producto</button>

      {/* TABLE */}
      {loading ? (
        <p style={s.loading}>Cargando productos...</p>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Imagen</th>
                <th style={s.th}>Nombre</th>
                <th style={s.th}>Categoría</th>
                <th style={s.th}>Precio</th>
                <th style={s.th}>Viral</th>
                <th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={s.tr}>
                  <td style={s.td}>
                    <div style={s.thumbWrap}>
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} style={s.thumb} />
                        : <span style={{ fontSize: '26px' }}>{p.emoji}</span>
                      }
                    </div>
                  </td>
                  <td style={s.td}>
                    <p style={s.prodName}>{p.name}</p>
                    <p style={s.prodDesc}>{p.description?.slice(0, 65)}...</p>
                  </td>
                  <td style={s.td}>
                    <span style={s.catBadge}>{p.category}</span>
                  </td>
                  <td style={s.td}>
                    <span style={s.price}>${p.price}</span>
                  </td>
                  <td style={s.td}>{p.viral ? '✅' : '—'}</td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button onClick={() => openEdit(p)} style={s.btnEdit}>Editar</button>
                      <button onClick={() => handleDelete(p.id)} style={s.btnDelete}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div style={s.modal}>
            <h2 style={s.modalTitle}>{editProduct ? 'Editar producto' : 'Nuevo producto'}</h2>

            <form onSubmit={handleSubmit} style={s.form}>

              <div style={s.row}>
                <Field label="Nombre *">
                  <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </Field>
                <Field label="Precio USD *">
                  <input style={s.input} type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </Field>
              </div>

              <Field label="Descripción">
                <textarea style={{ ...s.input, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </Field>

              <div style={s.row}>
                <Field label="Categoría *">
                  <select style={{ ...s.input, appearance: 'none' }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Seleccionar...</option>
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.emoji} {c.name}</option>)}
                  </select>
                </Field>
                <Field label="Emoji (fallback)">
                  <input style={s.input} value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} />
                </Field>
              </div>

              <Field label="URL de imagen">
                <input style={s.input} type="url" placeholder="https://images.unsplash.com/..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              </Field>

              {form.image_url && (
                <img src={form.image_url} alt="preview" style={s.imgPreview} />
              )}

              <div style={s.row}>
                <Field label="Badge (ej: Hot, Nuevo)">
                  <input style={s.input} value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} />
                </Field>
                <Field label="Margen %">
                  <input style={s.input} type="number" min="0" max="100" value={form.margin} onChange={e => setForm({ ...form, margin: e.target.value })} />
                </Field>
              </div>

              <label style={s.checkLabel}>
                <input type="checkbox" checked={form.viral} onChange={e => setForm({ ...form, viral: e.target.checked })} style={{ accentColor: '#6c63ff', width: '16px', height: '16px' }} />
                <span>Producto viral — aparece en la sección destacada del Home</span>
              </label>

              {msg && <p style={s.error}>{msg}</p>}

              <div style={s.formBtns}>
                <button type="button" onClick={() => setShowForm(false)} style={s.btnGhost}>Cancelar</button>
                <button type="submit" style={s.btnPrimary} disabled={saving}>
                  {saving ? 'Guardando...' : editProduct ? 'Guardar cambios' : 'Crear producto'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
      <label style={{ fontSize: '12px', color: '#8b8a9e', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  )
}

const s = {
  wrap: { padding: '40px 5% 80px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
  label: { fontSize: '11px', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' },
  title: { fontSize: '28px', fontWeight: 800, margin: '0 0 4px' },
  sub: { fontSize: '14px', color: '#8b8a9e', margin: 0 },
  headerRight: { display: 'flex', gap: '10px', alignItems: 'center' },
  btnAdd: { background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginBottom: '24px' },
  btnPrimary: { background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  btnSecondary: { background: 'transparent', color: '#f1f0ff', border: '1px solid rgba(108,99,255,0.4)', padding: '8px 18px', borderRadius: '99px', fontSize: '13px', cursor: 'pointer' },
  btnGhost: { background: 'transparent', color: '#8b8a9e', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 18px', borderRadius: '99px', fontSize: '13px', cursor: 'pointer' },
  btnEdit: { background: 'rgba(108,99,255,0.15)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.3)', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 },
  btnDelete: { background: 'rgba(255,107,107,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.25)', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 },
  loading: { color: '#8b8a9e', textAlign: 'center', padding: '80px 0', fontSize: '16px' },
  tableWrap: { overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(108,99,255,0.2)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', fontSize: '11px', color: '#8b8a9e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', borderBottom: '1px solid rgba(108,99,255,0.15)', background: 'rgba(108,99,255,0.05)', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid rgba(108,99,255,0.08)' },
  td: { padding: '12px 16px', verticalAlign: 'middle' },
  thumbWrap: { width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  thumb: { width: '100%', height: '100%', objectFit: 'cover' },
  prodName: { fontSize: '14px', fontWeight: 600, color: '#f1f0ff', margin: '0 0 4px' },
  prodDesc: { fontSize: '12px', color: '#8b8a9e', margin: 0 },
  catBadge: { fontSize: '11px', background: 'rgba(108,99,255,0.1)', color: '#a78bfa', padding: '3px 10px', borderRadius: '99px', fontWeight: 600, whiteSpace: 'nowrap' },
  price: { fontSize: '15px', fontWeight: 700, background: 'linear-gradient(135deg,#6c63ff,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  actions: { display: 'flex', gap: '8px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
  modal: { background: '#13131c', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '20px', fontWeight: 800, margin: '0 0 28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '10px', padding: '10px 14px', color: '#f1f0ff', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  imgPreview: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(108,99,255,0.2)' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#8b8a9e', cursor: 'pointer' },
  error: { fontSize: '13px', color: '#ff6b6b', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '8px', padding: '10px 14px', margin: 0 },
  formBtns: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' },
}

export default Admin
