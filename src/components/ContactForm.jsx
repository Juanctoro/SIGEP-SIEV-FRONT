import { useState } from 'react'

const initialValues = { name: '', email: '', phone: '', service: '', message: '', consent: false }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Escribe tu nombre (mínimo 2 caracteres).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Escribe un correo electrónico válido.'
  if (values.phone && !/^\+?[\d\s()-]{7,20}$/.test(values.phone.trim())) errors.phone = 'Escribe un teléfono válido (7 a 20 caracteres).'
  if (values.message.trim().length < 10) errors.message = 'Cuéntanos un poco más (mínimo 10 caracteres).'
  if (!values.consent) errors.consent = 'Debes aceptar el aviso de esta demostración.'
  return errors
}

export default function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  function change(event) {
    const { name, value, checked, type } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setStatus('idle')
  }

  async function submit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      event.currentTarget.elements.namedItem(Object.keys(nextErrors)[0])?.focus()
      return
    }
    setStatus('sending')
    // Sustituir por el servicio de contacto del backend. No se envían ni guardan datos.
    await new Promise((resolve) => setTimeout(resolve, 700))
    setStatus('success')
    setValues(initialValues)
  }

  function field(name) {
    return { id: name, name, value: values[name], onChange: change, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `${name}-error` : undefined }
  }

  const error = (name) => errors[name] && <p className="field-error" id={`${name}-error`}>{errors[name]}</p>

  return (
    <form noValidate onSubmit={submit} className="contact-form" aria-label="Formulario de contacto">
      <h3>Cuéntanos qué tienes en mente</h3>
      <p className="form-intro">Los campos con * son obligatorios.</p>
      <fieldset disabled={status === 'sending'}>
        <legend className="sr-only">Datos de tu solicitud</legend>
        <div className="form-grid">
          <div><label htmlFor="name">Nombre completo *</label><input {...field('name')} autoComplete="name" maxLength={100} required placeholder="Tu nombre" />{error('name')}</div>
          <div><label htmlFor="email">Correo electrónico *</label><input {...field('email')} type="email" autoComplete="email" maxLength={150} required placeholder="nombre@empresa.com" />{error('email')}</div>
          <div><label htmlFor="phone">Teléfono <span>(opcional)</span></label><input {...field('phone')} type="tel" autoComplete="tel" maxLength={20} placeholder="Tu número de contacto" />{error('phone')}</div>
          <div><label htmlFor="service">¿Qué necesitas?</label><select {...field('service')}><option value="">Selecciona un servicio</option><option>Diseño e ingeniería</option><option>Instalaciones eléctricas</option><option>Mantenimiento</option><option>Suministro de materiales</option><option>Otro</option></select></div>
        </div>
        <div className="message-field"><label htmlFor="message">Mensaje *</label><textarea {...field('message')} rows={4} maxLength={2000} required placeholder="Describe tu proyecto o consulta…" />{error('message')}</div>
        <label className="consent" htmlFor="consent"><input id="consent" name="consent" type="checkbox" checked={values.consent} onChange={change} required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'privacy-note consent-error' : 'privacy-note'} /><span>Entiendo que este formulario es una demostración y que no enviará mis datos. *</span></label>
        {error('consent')}
        <p id="privacy-note" className="form-note">Antes de habilitar el envío se incorporará la política de tratamiento de datos de SIEV. Usa datos ficticios.</p>
        <button className="button button-primary submit-button" type="submit">{status === 'sending' ? 'Simulando envío…' : 'Enviar consulta de prueba'} <span aria-hidden="true">↗</span></button>
      </fieldset>
      <div role="status" aria-live="polite">{status === 'success' && <p className="success-message">Validación completada. Envío simulado: tu mensaje no fue enviado ni almacenado.</p>}</div>
    </form>
  )
}

