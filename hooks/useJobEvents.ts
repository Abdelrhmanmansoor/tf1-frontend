import { useState, useEffect, useCallback, useRef } from 'react'
import { websocketClient } from '@/lib/websocketClient'
import jobEventsService from '@/services/job-events'
import type { JobEvent } from '@/types/job-events'

interface UseJobEventsOptions {
  maxEvents?: number
  autoConnect?: boolean
  pollInterval?: number
}

interface UseJobEventsReturn {
  events: JobEvent[]
  loading: boolean
  error: string | null
  connected: boolean
  backendAvailable: boolean
  refresh: () => void
}

export const useJobEvents = (options: UseJobEventsOptions = {}): UseJobEventsReturn => {
  const { maxEvents = 20, autoConnect = true, pollInterval = 30000 } = options
  
  const [events, setEvents] = useState<JobEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [backendAvailable, setBackendAvailable] = useState(true)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastEventIdRef = useRef<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      const result = await jobEventsService.getPublicTickerEvents(maxEvents)
      if (result.success) {
        const fetchedEvents = result.data
        if (fetchedEvents.length > 0) {
          const newFirstId = fetchedEvents[0]?.id
          if (newFirstId !== lastEventIdRef.current) {
            setEvents(fetchedEvents)
            lastEventIdRef.current = newFirstId
          }
        }
        setBackendAvailable(true)
        setError(null)
      } else {
        setBackendAvailable(false)
        setError(result.error || 'Backend endpoint not available')
      }
    } catch (err: any) {
      console.error('Failed to fetch job events:', err)
      setBackendAvailable(false)
      setError(err.message || 'Failed to load job events')
    } finally {
      setLoading(false)
    }
  }, [maxEvents])

  const handleNewEvent = useCallback((data: { event: JobEvent }) => {
    if (data.event) {
      setEvents(prev => {
        const exists = prev.some(e => e.id === data.event.id)
        if (exists) return prev
        const updated = [data.event, ...prev]
        return updated.slice(0, maxEvents)
      })
    }
  }, [maxEvents])

  const handleEventUpdate = useCallback((data: { event: JobEvent }) => {
    if (data.event) {
      setEvents(prev => {
        const index = prev.findIndex(e => e.jobId === data.event.jobId)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = data.event
          return updated
        }
        return [data.event, ...prev].slice(0, maxEvents)
      })
    }
  }, [maxEvents])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    if (!autoConnect) return

    const handleConnection = (data: { status: string }) => {
      setConnected(data.status === 'connected')
    }

    websocketClient.on('connection', handleConnection)
    websocketClient.on('job_posted', handleNewEvent)
    websocketClient.on('job_updated', handleEventUpdate)
    websocketClient.on('job_closed', handleEventUpdate)
    websocketClient.on('job_reopened', handleEventUpdate)
    websocketClient.on('deadline_changed', handleEventUpdate)
    websocketClient.on('announcement_posted', handleNewEvent)

    websocketClient.connect()

    websocketClient.send({
      type: 'subscribe',
      channel: 'job_events'
    })

    return () => {
      websocketClient.off('connection', handleConnection)
      websocketClient.off('job_posted', handleNewEvent)
      websocketClient.off('job_updated', handleEventUpdate)
      websocketClient.off('job_closed', handleEventUpdate)
      websocketClient.off('job_reopened', handleEventUpdate)
      websocketClient.off('deadline_changed', handleEventUpdate)
      websocketClient.off('announcement_posted', handleNewEvent)

      websocketClient.send({
        type: 'unsubscribe',
        channel: 'job_events'
      })
    }
  }, [autoConnect, handleNewEvent, handleEventUpdate])

  useEffect(() => {
    if (pollInterval > 0 && backendAvailable) {
      pollIntervalRef.current = setInterval(fetchEvents, pollInterval)
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [pollInterval, fetchEvents, backendAvailable])

  const refresh = useCallback(() => {
    setLoading(true)
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    connected,
    backendAvailable,
    refresh
  }
}

export default useJobEvents
