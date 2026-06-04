import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (tab === 'login') {
      const { error } = await login(email, password)
      if (error) {
        setError('Email o contraseña incorrectos.')
      } else {
        navigate('/')
      }
    } else {
      const { error } = await register(email, password)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('¡Cuenta creada! Revisa tu email para confirmar.')
      }
    }
    setLoading(false)
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>

        <Link to="/" style={s.logo}>
          Con<span style={s.logoAi}>AI</span>
        </Link>

        <div style={s.tabs}>
          <button
            style={tab === 'login' ? s.tabActive : s.tab}
            onClick={() => { setTab('login'); setError(''); setSuccess('') }}
          >
            Iniciar sesión
          </button>
          <button
            style={tab === 'register' ? s.tabActive : s.tab}
            onClick={() => { setTab('register'); setError(''); setSuccess('') }}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Contraseña</label>
            <input
              style={s.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p style={s.error}>{error}</p>}
          {success && <p style={s.successMsg}>{success}</p>}

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Cargando...' : tab === 'login' ? 'Entrar →' : 'Crear cuenta →'}
          </button>
        </form>

        <p style={s.back}>
          <Link to="/" style={s.backLink}>← Volver a la tienda</Link>
        </p>

      </div>
    </div>
  )
}

const s = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f8f9fa' },
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  logo: { display: 'block', textAlign: 'center', fontSize: '26px', fontWeight: 700, textDecoration: 'none', color: '#0a0a0f', marginBottom: '32px' },
  logoAi: { fontWeight: 300, background: 'linear-gradient(135deg,#1A6FFF,#66AAFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  tabs: { display: 'flex', background: '#f3f4f6', borderRadius: '99px', padding: '4px', marginBottom: '32px' },
  tab: { flex: 1, background: 'transparent', border: 'none', color: '#6b7280', padding: '10px', borderRadius: '99px', fontSize: '14px', cursor: 'pointer', fontWeight: 500 },
  tabActive: { flex: 1, background: 'linear-gradient(135deg,#1A6FFF,#4F94FF)', border: 'none', color: '#fff', padding: '10px', borderRadius: '99px', fontSize: '14px', cursor: 'pointer', fontWeight: 700 },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', color: '#374151', fontWeight: 500 },
  input: { background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px', color: '#0a0a0f', fontSize: '15px', outline: 'none' },
  error: { fontSize: '13px', color: '#e63946', background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: '8px', padding: '10px 14px', margin: 0 },
  successMsg: { fontSize: '13px', color: '#16a34a', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '8px', padding: '10px 14px', margin: 0 },
  btn: { background: 'linear-gradient(135deg,#1A6FFF,#4F94FF)', color: '#fff', border: 'none', padding: '14px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '4px' },
  back: { textAlign: 'center', marginTop: '24px', margin: '24px 0 0' },
  backLink: { fontSize: '13px', color: '#6b7280', textDecoration: 'none' },
}

export default Login
