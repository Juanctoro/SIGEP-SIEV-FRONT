export function validateAuth(values, registering) {
  const errors = {}
  if (!values.username.trim()) errors.username = 'Escribe tu usuario.'
  else if (registering && !/^[a-zA-Z0-9._-]{3,30}$/.test(values.username.trim())) errors.username = 'Usa entre 3 y 30 letras, números, puntos, guiones o guiones bajos.'
  if (!values.password) errors.password = 'Escribe tu contraseña.'
  if (registering) {
    if (values.name.trim().length < 2) errors.name = 'Escribe tu nombre completo (mínimo 2 caracteres).'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Escribe un correo electrónico válido.'
    if (values.password && (values.password.length < 8 || !/[a-zA-Z]/.test(values.password) || !/\d/.test(values.password))) errors.password = 'Usa al menos 8 caracteres, incluyendo letras y números.'
    if (!values.confirmPassword || values.password !== values.confirmPassword) errors.confirmPassword = 'Las contraseñas deben coincidir.'
  }
  return errors
}

export function safeDestination(value) {
  if (value === '/' || value === '/cuenta' || /^\/tienda(?:\/[^?#]*)?(?:\?[^#]*)?$/.test(value ?? '')) return value
  return '/cuenta'
}
