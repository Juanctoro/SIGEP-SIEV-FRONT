import { useState } from 'react'
import { Eye, EyeOff, ArrowUpRight, ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import logo from '../assets/LogoSIEV.png'
import { useAuth } from './useAuth'
import { demoCredentials } from './authService'
import { safeDestination, validateAuth } from './validation'
import './auth.css'

const emptyValues = { name: '', username: '', email: '', password: '', confirmPassword: '' }

export default function AuthPage({ mode = 'login' }) {
  const registering = mode === 'register'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const destination = safeDestination(params.get('next'))
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState('')
  const [registered, setRegistered] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (user) return <Navigate to={destination} replace />

  function change(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFailure('')
    setRegistered(false)
  }

  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const nextErrors = validateAuth(values, registering)
    setErrors(nextErrors)
    setFailure('')
    if (Object.keys(nextErrors).length) {
      const firstInvalid = [...event.currentTarget.elements].find((element) => nextErrors[element.name])
      firstInvalid?.focus()
      return
    }
    setBusy(true)
    try {
      if (registering) {
        await register(values)
        setValues(emptyValues)
        setShowPassword(false)
        setRegistered(true)
      } else {
        await login(values)
        setValues(emptyValues)
        navigate(destination, { replace: true })
      }
    } catch (error) {
      setFailure(error.message || 'No fue posible completar la solicitud. Inténtalo de nuevo.')
    } finally { setBusy(false) }
  }

  function field(name) {
    return { id: `auth-${name}`, name, value: values[name], onChange: change, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': [errors[name] && `auth-${name}-error`, registering && name === 'password' && 'password-help'].filter(Boolean).join(' ') || undefined }
  }
  const error = (name) => errors[name] && <p className="auth-error" id={`auth-${name}-error`}>{errors[name]}</p>
  const nextQuery = `?next=${encodeURIComponent(destination)}`

  return <main className="auth-page">
    <section className="auth-story" aria-label="SIEV"><Link to="/" aria-label="SIEV, volver al inicio"><img src={logo} alt="SIEV" /></Link><div><p className="eyebrow">SIGEP-SIEV</p><h1>Un mismo equipo.<br /><em>Todo conectado.</em></h1><p>El punto de encuentro para tu cuenta y los servicios de Soluciones Integrales Eléctricas del Valle.</p></div><span>Ingeniería eléctrica · Valle del Cauca</span></section>
    <section className="auth-main"><Link className="auth-back" to="/"><ArrowLeft size={16} /> Volver al inicio</Link><div className="auth-card"><p className="eyebrow">{registering ? 'Empieza aquí' : 'Bienvenido de nuevo'}</p><h2>{registering ? 'Crea tu cuenta' : 'Inicia sesión'}</h2><p className="auth-intro">{registering ? 'Registra tu usuario y correo para acceder a tu cuenta.' : 'Ingresa con tu usuario y contraseña.'}</p>
      <p className="auth-demo"><strong>Modo demostración.</strong> Usa datos ficticios. Las cuentas y la sesión se borran al recargar. No se envían correos de verificación.</p>
      {registered ? <div role="status" className="auth-registered"><h3>Cuenta de prueba creada</h3><p>Ya puedes iniciar sesión con tu usuario y contraseña, sin recargar la página.</p><Link className="button button-secondary" to={`/login${nextQuery}`}>Ir a iniciar sesión <ArrowUpRight size={16} /></Link></div> : <form noValidate onSubmit={submit} aria-label={registering ? 'Crear cuenta' : 'Iniciar sesión'}>
        <fieldset disabled={busy}><legend className="sr-only">Credenciales de acceso</legend>
          {registering && <><div className="auth-field"><label htmlFor="auth-name">Nombre completo</label><input {...field('name')} required autoComplete="name" maxLength={100} placeholder="Tu nombre" />{error('name')}</div><div className="auth-field"><label htmlFor="auth-email">Correo electrónico</label><input {...field('email')} required type="email" autoComplete="email" maxLength={150} placeholder="nombre@correo.com" />{error('email')}</div></>}
          <div className="auth-field"><label htmlFor="auth-username">Usuario</label><input {...field('username')} required autoComplete="username" maxLength={30} autoCapitalize="none" spellCheck={false} placeholder={registering ? 'Elige un nombre de usuario' : 'Tu usuario'} />{error('username')}</div>
          <div className="auth-field"><label htmlFor="auth-password">Contraseña</label><div className="auth-password"><input {...field('password')} required type={showPassword ? 'text' : 'password'} autoComplete={registering ? 'new-password' : 'current-password'} maxLength={128} placeholder="Tu contraseña" /><button type="button" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{registering && <p className="auth-hint" id="password-help">Mínimo 8 caracteres, con letras y números.</p>}{error('password')}</div>
          {registering && <div className="auth-field"><label htmlFor="auth-confirmPassword">Confirmar contraseña</label><input {...field('confirmPassword')} required type={showPassword ? 'text' : 'password'} autoComplete="new-password" maxLength={128} placeholder="Repite tu contraseña" />{error('confirmPassword')}</div>}
          {failure && <p className="auth-error auth-failure" role="alert">{failure}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={busy}>{busy ? 'Procesando…' : registering ? 'Crear cuenta' : 'Iniciar sesión'} <ArrowUpRight size={17} /></button>
          <span role="status" className="sr-only">{busy ? 'Procesando solicitud' : ''}</span>
        </fieldset>
      </form>}
      {!registering && <details className="auth-demo-account"><summary>Probar con una cuenta de ejemplo</summary><p>Usuario: <code>{demoCredentials.username}</code><br />Contraseña: <code>{demoCredentials.password}</code></p></details>}
      <p className="auth-switch">{registering ? '¿Ya tienes una cuenta?' : '¿Aún no tienes una cuenta?'} <Link to={`${registering ? '/login' : '/registro'}${nextQuery}`}>{registering ? 'Inicia sesión' : 'Crear cuenta'}</Link></p>
    </div><p className="auth-bottom">Soluciones Integrales Eléctricas del Valle S.A.S.</p></section>
  </main>
}
