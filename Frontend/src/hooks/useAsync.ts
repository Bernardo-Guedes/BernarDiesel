import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../services/api'

interface State<T> {
  key: string
  data: T | null
  error: string | null
  loading: boolean
}

/**
 * Carrega dados assíncronos com estados de loading/erro e `reload`.
 * `key` força novo carregamento quando muda (ex.: o `id` da rota).
 */
export function useAsync<T>(fn: () => Promise<T>, key = '') {
  const [nonce, setNonce] = useState(0)
  const [state, setState] = useState<State<T>>({
    key,
    data: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    let cancelado = false
    fn()
      .then((data) => {
        if (!cancelado) setState({ key, data, error: null, loading: false })
      })
      .catch((e: unknown) => {
        if (!cancelado) setState({ key, data: null, error: getErrorMessage(e), loading: false })
      })
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nonce])

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    setNonce((n) => n + 1)
  }, [])

  return {
    data: state.key === key ? state.data : null,
    loading: state.loading || state.key !== key,
    error: state.key === key ? state.error : null,
    reload,
  }
}
