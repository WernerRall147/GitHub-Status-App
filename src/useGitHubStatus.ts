import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchGitHubStatus } from './githubStatus'
import type { GitHubStatus } from './types'

export function useGitHubStatus() {
  const [status, setStatus] = useState<GitHubStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestRef = useRef<AbortController | null>(null)

  const refresh = useCallback(async () => {
    if (requestRef.current) {
      return
    }

    const controller = new AbortController()
    requestRef.current = controller
    setIsLoading(true)
    setError(null)

    try {
      const nextStatus = await fetchGitHubStatus(controller.signal)
      setStatus(nextStatus)
    } catch (caughtError) {
      if (caughtError instanceof DOMException && caughtError.name === 'AbortError') {
        return
      }
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load GitHub Status.')
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => {
      void refresh()
    }, 0)

    return () => {
      window.clearTimeout(initialRefresh)
      requestRef.current?.abort()
    }
  }, [refresh])

  return { status, isLoading, error, refresh }
}
