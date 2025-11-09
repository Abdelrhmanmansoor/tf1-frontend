class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private isConnecting = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 1000
  private eventHandlers: Map<string, Function[]> = new Map()

  constructor() {
    this.url =
      process.env.NODE_ENV === 'production'
        ? 'wss://sportsplatform-be.onrender.com/ws'
        : process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws'
  }

  connect() {
    if (
      this.isConnecting ||
      (this.ws && this.ws.readyState === WebSocket.OPEN)
    ) {
      return
    }

    this.isConnecting = true

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.emit('connection', { status: 'connected' })
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit(data.type || 'message', data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        this.isConnecting = false
        this.ws = null
        this.emit('connection', { status: 'disconnected' })

        // Attempt to reconnect if not manually closed
        if (
          event.code !== 1000 &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          setTimeout(() => {
            this.reconnectAttempts++
            this.connect()
          }, this.reconnectInterval * this.reconnectAttempts)
        }
      }

      this.ws.onerror = () => {
        this.isConnecting = false
        this.emit('connection', { status: 'error', error: 'Connection failed' })
      }
    } catch {
      this.isConnecting = false
      this.emit('connection', {
        status: 'error',
        error: 'Failed to create connection',
      })
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect')
      this.ws = null
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)!.push(handler)
  }

  off(event: string, handler: Function) {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any) {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  get connected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  // Convenience methods for messaging
  joinConversation(conversationId: string) {
    this.send({
      type: 'join_conversation',
      conversationId,
    })
  }

  leaveConversation(conversationId: string) {
    this.send({
      type: 'leave_conversation',
      conversationId,
    })
  }

  sendMessage(
    conversationId: string,
    content: string,
    type: 'text' | 'file' = 'text'
  ) {
    this.send({
      type: 'send_message',
      conversationId,
      content,
      messageType: type,
    })
  }

  startTyping(conversationId: string) {
    this.send({
      type: 'typing',
      conversationId,
      isTyping: true,
    })
  }

  stopTyping(conversationId: string) {
    this.send({
      type: 'typing',
      conversationId,
      isTyping: false,
    })
  }
}

// Create singleton instance
export const websocketClient = new WebSocketClient()
export default websocketClient
