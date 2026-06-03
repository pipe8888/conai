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
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { background: '#13131c', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px' },
  logo: { display: 'block', textAlign: 'center', fontSize: '26px', fontWeight: 700, textDecoration: 'none', background: 'linear-gradient(135deg,#6c63ff,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '32px' },
  logoAi: { fontWeight: 300 },
  tabs: { display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', padding: '4px', marginBottom: '32px' },
  tab: { flex: 1, background: 'transparent', border: 'none', color: '#8b8a9e', padding: '10px', borderRadius: '99px', fontSize: '14px', cursor: 'pointer', fontWeight: 500 },
  tabActive: { flex: 1, background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', border: 'none', color: '#fff', padding: '10px', borderRadius: '99px', fontSize: '14px', cursor: 'pointer', fontWeight: 700 },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', color: '#8b8a9e', fontWeight: 500 },
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '12px', padding: '12px 16px', color: '#f1f0ff', fontSize: '15px', outline: 'none' },
  error: { fontSize: '13px', color: '#ff6b6b', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '8px', padding: '10px 14px', margin: 0 },
  successMsg: { fontSize: '13px', color: '#22d3ee', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '8px', padding: '10px 14px', margin: 0 },
  btn: { background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff', border: 'none', padding: '14px', borderRadius: '99px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '4px' },
  back: { textAlign: 'center', marginTop: '24px', margin: '24px 0 0' },
  backLink: { fontSize: '13px', color: '#8b8a9e', textDecoration: 'none' },
}

export default Login
