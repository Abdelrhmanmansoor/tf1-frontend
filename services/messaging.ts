import { getAuthToken } from '@/lib/auth'
import API_CONFIG from '@/config/api'
import api from './api'

const BASE_URL = `${API_CONFIG.BASE_URL}/messages`

interface CreateConversationData {
  participantIds: string[]
  name?: string
  type?: 'direct' | 'group'
  isGroup?: boolean // Deprecated - use 'type' instead
}

interface UpdateConversationData {
  name?: string
  addParticipants?: string[]
  removeParticipants?: string[]
}

interface SendMessageData {
  content?: string
  type: 'text' | 'image' | 'video' | 'file' | 'audio' | 'system'
  mediaUrl?: string
  fileName?: string
  fileSize?: number
  replyTo?: string
}

interface Conversation {
  _id: string
  participants: Array<{
    _id?: string
    userId:
      | string
      | {
          _id: string
          firstName: string
          lastName: string
          avatar?: string
        }
    firstName?: string
    lastName?: string
    avatar?: string
    role: string
    isActive: boolean
    lastReadAt?: string
    isMuted?: boolean
  }>
  name?: string
  isGroup: boolean
  lastMessage?: {
    content: string
    sender: string
    createdAt: string
    type: string
  }
  unreadCount: number
  isMuted: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

interface Message {
  _id: string
  conversation?: string
  conversationId?: string // Backend uses this
  senderId: {
    _id: string
    firstName: string
    lastName: string
    avatar?: string
    role: string
  }
  content?: string
  type?: 'text' | 'image' | 'video' | 'file' | 'audio' | 'system'
  messageType?: 'text' | 'image' | 'video' | 'file' | 'audio' | 'system' // Backend uses this
  mediaUrl?: string
  fileName?: string
  fileSize?: number
  attachments?: any[]
  replyTo?: {
    _id: string
    content: string
    senderId: {
      firstName: string
      lastName: string
    }
  }
  reactions: Array<{
    user: string
    emoji: string
  }>
  readBy: Array<{
    user: string
    readAt: string
  }>
  isEdited: boolean
  isDeleted?: boolean
  deletedAt?: string
  sentAt?: string
  createdAt: string
  updatedAt: string
}

class MessagingService {
  private async getHeaders() {
    const token = getAuthToken()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  // Conversation Methods
  async getConversations(params?: {
    archived?: boolean
    page?: number
    limit?: number
  }): Promise<{
    success: boolean
    conversations: Conversation[]
    pagination?: any
  }> {
    const queryParams = new URLSearchParams()
    if (params?.archived !== undefined)
      queryParams.append('archived', params.archived.toString())
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${BASE_URL}/conversations?${queryParams.toString()}`,
      {
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch conversations')
    }

    return response.json()
  }

  async getConversation(
    id: string
  ): Promise<{ success: boolean; conversation: Conversation }> {
    const response = await fetch(`${BASE_URL}/conversations/${id}`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch conversation')
    }

    return response.json()
  }

  async createConversation(
    data: CreateConversationData
  ): Promise<{ success: boolean; conversation: Conversation }> {
    try {
      const response = await api.post('/messages/conversations', data)
      return response.data
    } catch (error: any) {
      console.error('[MessagingService] Error creating conversation:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to create conversation'
      )
    }
  }

  async updateConversation(
    id: string,
    data: UpdateConversationData
  ): Promise<{ success: boolean; conversation: Conversation }> {
    const response = await fetch(`${BASE_URL}/conversations/${id}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to update conversation')
    }

    return response.json()
  }

  async deleteConversation(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${BASE_URL}/conversations/${id}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to delete conversation')
    }

    return response.json()
  }

  async muteConversation(
    id: string
  ): Promise<{ success: boolean; conversation: Conversation }> {
    const response = await fetch(`${BASE_URL}/conversations/${id}/mute`, {
      method: 'POST',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to mute conversation')
    }

    return response.json()
  }

  async unmuteConversation(
    id: string
  ): Promise<{ success: boolean; conversation: Conversation }> {
    const response = await fetch(`${BASE_URL}/conversations/${id}/unmute`, {
      method: 'POST',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to unmute conversation')
    }

    return response.json()
  }

  async archiveConversation(
    id: string
  ): Promise<{ success: boolean; conversation: Conversation }> {
    const response = await fetch(`${BASE_URL}/conversations/${id}/archive`, {
      method: 'POST',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to archive conversation')
    }

    return response.json()
  }

  async unarchiveConversation(
    id: string
  ): Promise<{ success: boolean; conversation: Conversation }> {
    const response = await fetch(`${BASE_URL}/conversations/${id}/unarchive`, {
      method: 'POST',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to unarchive conversation')
    }

    return response.json()
  }

  // Message Methods
  async getMessages(
    conversationId: string,
    params?: { page?: number; limit?: number; before?: string }
  ): Promise<{ success: boolean; messages: Message[]; pagination?: any }> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.before) queryParams.append('before', params.before)

    const response = await fetch(
      `${BASE_URL}/conversations/${conversationId}/messages?${queryParams.toString()}`,
      {
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }

    return response.json()
  }

  async sendMessage(
    conversationId: string,
    data: SendMessageData
  ): Promise<{ success: boolean; message: Message }> {
    const response = await fetch(
      `${BASE_URL}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return response.json()
  }

  async editMessage(
    messageId: string,
    content: string
  ): Promise<{ success: boolean; message: Message }> {
    const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      throw new Error('Failed to edit message')
    }

    return response.json()
  }

  async deleteMessage(
    messageId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to delete message')
    }

    return response.json()
  }

  async addReaction(
    messageId: string,
    emoji: string
  ): Promise<{ success: boolean; message: Message }> {
    const response = await fetch(
      `${BASE_URL}/messages/${messageId}/reactions`,
      {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ emoji }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to add reaction')
    }

    return response.json()
  }

  async removeReaction(
    messageId: string
  ): Promise<{ success: boolean; message: Message }> {
    const response = await fetch(
      `${BASE_URL}/messages/${messageId}/reactions`,
      {
        method: 'DELETE',
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to remove reaction')
    }

    return response.json()
  }

  async markAsRead(
    conversationId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${BASE_URL}/conversations/${conversationId}/read`,
      {
        method: 'POST',
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to mark as read')
    }

    return response.json()
  }

  async getUnreadCount(): Promise<{ success: boolean; count: number }> {
    const response = await fetch(`${BASE_URL}/unread-count`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch unread count')
    }

    return response.json()
  }

  // Typing Indicator Methods
  async sendTypingIndicator(conversationId: string): Promise<void> {
    // This is handled via Socket.io, but we can keep a REST fallback
    await fetch(`${BASE_URL}/conversations/${conversationId}/typing`, {
      method: 'POST',
      headers: await this.getHeaders(),
    })
  }
}

export const messagingService = new MessagingService()
export type { Conversation, Message, SendMessageData, CreateConversationData }
