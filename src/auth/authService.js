// Adaptador de demostración. Sustituir por llamadas al backend cuando esté disponible.
// No crea usuarios reales, no verifica correos y no persiste credenciales ni sesiones.
const accounts = new Map()
const encoder = new TextEncoder()
export const demoCredentials = { username: 'demo.siev', password: 'SievDemo2026!' }

async function derivePassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256))
}

async function createAccount({ name, username, email, password }) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derivePassword(password, salt)
  const user = { id: crypto.randomUUID(), name: name.trim(), username: username.trim().toLowerCase(), email: email.trim().toLowerCase() }
  accounts.set(user.username, { user, salt, hash })
  return user
}

let seedPromise
function ready() {
  seedPromise ??= createAccount({ name: 'Usuario de demostración', email: 'demo@siev.example', ...demoCredentials })
  return seedPromise
}

export async function registerAccount(values) {
  await ready()
  const username = values.username.trim().toLowerCase()
  const email = values.email.trim().toLowerCase()
  if (accounts.has(username)) throw new Error('Este nombre de usuario ya está registrado.')
  if ([...accounts.values()].some(({ user }) => user.email === email)) throw new Error('Este correo ya está registrado.')
  // Reservar el nombre antes de la operación asíncrona impide registros simultáneos duplicados.
  accounts.set(username, { user: { email } })
  try { return await createAccount(values) } catch (error) { accounts.delete(username); throw error }
}

export async function signIn({ username, password }) {
  await ready()
  const account = accounts.get(username.trim().toLowerCase())
  if (!account?.hash) throw new Error('Usuario o contraseña incorrectos.')
  const candidate = await derivePassword(password, account.salt)
  if (candidate.some((byte, index) => byte !== account.hash[index])) throw new Error('Usuario o contraseña incorrectos.')
  return { ...account.user }
}
