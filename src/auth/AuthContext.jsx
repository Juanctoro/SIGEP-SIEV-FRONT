import { useEffect, useState } from 'react'
import { setUnauthorizedHandler } from '../lib/api'
import { fetchCurrentUser, hasStoredSession, registerAccount, signIn, signOut } from './authService'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Mientras se restaura una sesión guardada, las rutas protegidas esperan en vez de redirigir al login.
  const [loading, setLoading] = useState(hasStoredSession)

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
    if (!hasStoredSession()) return
    let active = true
    fetchCurrentUser()
      .then((current) => { if (active) setUser(current) })
      // Un token inválido ya lo limpia api(); si el servidor no responde se conserva para reintentar.
      .catch(() => { if (active) setUser(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function login(values) {
    const signedIn = await signIn(values)
    setUser(signedIn)
    return signedIn
  }
  async function register(values) { return registerAccount(values) }
  function logout() { signOut(); setUser(null) }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
