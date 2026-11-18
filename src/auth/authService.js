// Autenticación contra el backend (SimpleJWT). Los tokens se guardan en
// localStorage a través de `tokens` y `api()` los envía en cada petición.
import { api, tokens } from '../lib/api'

function toUser(data) {
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ').trim()
  return {
    id: data.id,
    name: name || data.username,
    username: data.username,
    email: data.email,
    isStaff: Boolean(data.is_staff),
    isSuperuser: Boolean(data.is_superuser),
    lastLogin: data.last_login,
  }
}

export async function fetchCurrentUser() {
  return toUser(await api('/api/user/me/'))
}

export async function signIn({ email, password }) {
  let session
  try {
    session = await api('/api/auth/login', { method: 'POST', auth: false, body: { email: email.trim().toLowerCase(), password } })
  } catch (error) {
    if (error.status === 401) error.message = 'Correo o contraseña incorrectos.'
    throw error
  }
  tokens.save(session)
  try { return await fetchCurrentUser() } catch (error) { tokens.clear(); throw error }
}

export async function registerAccount({ name, username, email, password }) {
  const [firstName, ...rest] = name.trim().split(/\s+/)
  return api('/api/user/', {
    method: 'POST',
    auth: false,
    body: {
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
      first_name: firstName ?? '',
      last_name: rest.join(' '),
    },
  })
}

export function signOut() {
  tokens.clear()
}

export function hasStoredSession() {
  return Boolean(tokens.access)
}
