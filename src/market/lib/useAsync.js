import { useEffect, useState } from 'react'

// Ejecuta una función asíncrona del servicio y expone { data, loading, error }.
// `key` debe cambiar cuando cambian los parámetros de la consulta.
export function useAsync(fn, key) {
  const [state, setState] = useState({ data: null, loading: true, error: null, key: null })

  useEffect(() => {
    let alive = true
    Promise.resolve()
      .then(() => { if (alive) setState((s) => ({ ...s, loading: true, error: null })) })
      .then(fn)
      .then((data) => { if (alive) setState({ data, loading: false, error: null, key }) })
      .catch((error) => { if (alive) setState({ data: null, loading: false, error, key }) })
    return () => { alive = false }
    // fn se recrea en cada render; la consulta depende solo de `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}
