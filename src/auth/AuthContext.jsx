import { useState } from 'react'
import { registerAccount, signIn } from './authService'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  async function login(values) { setUser(await signIn(values)) }
  async function register(values) { return registerAccount(values) }
  function logout() { setUser(null) }
  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}
