'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import {
  Check,
  CheckCheck,
  Smile,
  Edit2,
  Trash2,
  Reply,
} from 'lucide-react'
import type { Message } from '@/services/messaging'
import { useState } from 'react'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar?: boolean
  onReact?: (_messageId: string, _emoji: string) => void
  onEdit?: (_messageId: string, _content: string) => void
  onDelete?: (_messageId: string) => void
  onReply?: (_message: Message) => void
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  onReact,
  onEdit,
  onDelete,
  onReply,
}: MessageBubbleProps) {
  const { language } = useLanguage()
  const [showOptions, setShowOptions] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content || '')

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(message._id, editContent.trim())
      setIsEditing(false)
    }
  }

  const renderMessageContent = () => {
    if (message.deletedAt) {
      return (
        <p className="text-gray-400 italic text-sm">
          {language === 'ar'
            ? 'تم حذف هذه الرسالة'
            : 'This message was deleted'}
        </p>
      )
    }

    if (isEditing) {
      return (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit()
              if (e.key === 'Escape') setIsEditing(false)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )
    }

    // Backend uses 'messageType', frontend interface has 'type'
    const messageType = message.messageType || message.type || 'text'

    switch (messageType) {
      case 'text':
        return (
          <div>
            {message.replyTo && (
              <div className="mb-2 p-2 border-l-2 border-gray-300 bg-gray-50 rounded text-sm">
                <p className="text-gray-600 font-medium mb-1">
                  {`${message.replyTo.senderId.firstName} ${message.replyTo.senderId.lastName}`.trim()}
                </p>
                <p className="text-gray-500 truncate">
                  {message.replyTo.content}
                </p>
              </div>
            )}
            <p className="text-gray-900 whitespace-pre-wrap break-words">
              {message.content}
            </p>
            {message.isEdited && (
              <p className="text-xs text-gray-400 mt-1">
                {language === 'ar' ? '(معدلة)' : '(edited)'}
              </p>
            )}
          </div>
        )

      case 'image':
        return (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.mediaUrl}
              alt="Image"
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.mediaUrl, '_blank')}
            />
            {message.content && (
              <p className="text-gray-900 mt-2">{message.content}</p>
            )}
          </div>
        )

      case 'video':
        return (
          <div>
            <video
              src={message.mediaUrl}
              controls
              className="max-w-xs rounded-lg"
            />
            {message.content && (
              <p className="text-gray-900 mt-2">{message.content}</p>
            )}
          </div>
        )

      case 'file':
        return (
          <a
            href={message.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📎</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {message.fileName}
              </p>
              {message.fileSize && (
                <p className="text-xs text-gray-500">
                  {(message.fileSize / 1024).toFixed(2)} KB
                </p>
              )}
            </div>
          </a>
        )

      case 'audio':
        return <audio src={message.mediaUrl} controls className="max-w-xs" />

      case 'system':
        return (
          <p className="text-gray-500 text-center text-sm italic">
            {message.content}
          </p>
        )

      default:
        return null
    }
  }

  if (message.type === 'system') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center my-4"
      >
        <div className="px-4 py-2 bg-gray-100 rounded-full">
          {renderMessageContent()}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => {
        setShowOptions(false)
        setShowEmojiPicker(false)
      }}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="flex-shrink-0">
          {message.senderId.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={message.senderId.avatar}
              alt={`${message.senderId.firstName} ${message.senderId.lastName}`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {message.senderId.firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name (for group chats) */}
        {!isOwn && showAvatar && (
          <p className="text-xs text-gray-600 mb-1 px-3">
            {`${message.senderId.firstName} ${message.senderId.lastName}`.trim()}
          </p>
        )}

        {/* Message Bubble */}
        <div className="relative">
          <div
            className={`px-4 py-2 rounded-2xl max-w-md ${
              isOwn
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {renderMessageContent()}
          </div>

          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="absolute -bottom-2 left-2 flex gap-1 bg-white rounded-full shadow-md px-2 py-1">
              {Object.entries(
                message.reactions.reduce(
                  (acc, r) => {
                    acc[r.emoji] = (acc[r.emoji] || 0) + 1
                    return acc
                  },
                  {} as Record<string, number>
                )
              ).map(([emoji, count]) => (
                <span key={emoji} className="text-xs">
                  {emoji} {count > 1 && count}
                </span>
              ))}
            </div>
          )}

          {/* Options Menu */}
          <AnimatePresence>
            {showOptions && !message.deletedAt && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} flex gap-1 bg-white shadow-lg rounded-lg p-1`}
              >
                {onReact && (
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={language === 'ar' ? 'تفاعل' : 'React'}
                  >
                    <Smile className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                {onReply && (
                  <button
                    onClick={() => onReply(message)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={language === 'ar' ? 'رد' : 'Reply'}
                  >
                    <Reply className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                {isOwn && onEdit && message.type === 'text' && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={language === 'ar' ? 'تعديل' : 'Edit'}
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                {isOwn && onDelete && (
                  <button
                    onClick={() => onDelete(message._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title={language === 'ar' ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </motion.div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} -translate-y-full mt-2 bg-white shadow-lg rounded-lg p-2 flex gap-2`}
              >
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      if (onReact) {
                        onReact(message._id, emoji)
                        setShowEmojiPicker(false)
                      }
                    }}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Time and Read Status */}
        <div
          className={`flex items-center gap-1 mt-1 px-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <span className="text-xs text-gray-500">
            {formatTime(message.createdAt)}
          </span>
          {isOwn && (
            <div>
              {message.readBy.length > 1 ? (
                <CheckCheck className="w-4 h-4 text-blue-500" />
              ) : (
                <Check className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
