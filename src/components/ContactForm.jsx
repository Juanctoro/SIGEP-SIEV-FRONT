import { useState } from 'react'
import { company, services } from '../data/institutional'

const initialValues = { name: '', company: '', phone: '', service: '', message: '' }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Escribe tu nombre (mínimo 2 caracteres).'
  if (values.phone && !/^\+?[\d\s()-]{7,20}$/.test(values.phone.trim())) errors.phone = 'Escribe un teléfono válido (7 a 20 caracteres).'
  if (values.message.trim().length < 10) errors.message = 'Cuéntanos un poco más (mínimo 10 caracteres).'
  return errors
}

export default function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [whatsappUrl, setWhatsappUrl] = useState('')

  function change(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setWhatsappUrl('')
  }

  function submit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      event.currentTarget.elements.namedItem(Object.keys(nextErrors)[0])?.focus()
      return
    }
    const message = [
      'Hola, SIEV. Me gustaría solicitar una cotización.',
      `Nombre: ${values.name.trim()}`,
      values.company.trim() && `Empresa: ${values.company.trim()}`,
      values.phone.trim() && `Teléfono: ${values.phone.trim()}`,
      values.service && `Servicio: ${values.service}`,
      `Detalle de la necesidad: ${values.message.trim()}`,
    ].filter(Boolean).join('\n')
    const url = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`
    setWhatsappUrl(url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function field(name) {
    return { id: name, name, value: values[name], onChange: change, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `${name}-error` : undefined }
  }
  const error = (name) => errors[name] && <p className="field-error" id={`${name}-error`}>{errors[name]}</p>

  return <form noValidate onSubmit={submit} className="contact-form" aria-label="Formulario de contacto">
    <h3>Solicite su cotización</h3>
    <p className="form-intro">Cuéntenos qué necesita. Los campos con * son obligatorios.</p>
    <div className="form-grid">
      <div><label htmlFor="name">Nombre *</label><input {...field('name')} autoComplete="name" maxLength={100} required placeholder="Su nombre" />{error('name')}</div>
      <div><label htmlFor="company">Empresa <span>(opcional)</span></label><input {...field('company')} autoComplete="organization" maxLength={150} placeholder="Nombre de la empresa" /></div>
      <div><label htmlFor="phone">Teléfono <span>(opcional)</span></label><input {...field('phone')} type="tel" autoComplete="tel" maxLength={20} placeholder="Su número de contacto" />{error('phone')}</div>
      <div><label htmlFor="service">Servicio</label><select {...field('service')}><option value="">Seleccione…</option>{services.map(({ title }) => <option key={title}>{title}</option>)}</select></div>
    </div>
    <div className="message-field"><label htmlFor="message">Detalle de la necesidad *</label><textarea {...field('message')} rows={4} maxLength={2000} required placeholder="Describa su proyecto o consulta…" />{error('message')}</div>
    <p className="form-note whatsapp-note">Se abrirá WhatsApp con su mensaje listo para enviar. Usted confirma el envío allí; este sitio no almacena la solicitud.</p>
    <button className="button button-primary submit-button" type="submit">Enviar por WhatsApp <span aria-hidden="true">↗</span></button>
    <div role="status" aria-live="polite">{whatsappUrl && <p className="success-message">Su mensaje está listo. Si WhatsApp no se abrió, <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline">abrir la conversación</a>. Aún debe confirmar el envío en WhatsApp.</p>}</div>
  </form>
}
