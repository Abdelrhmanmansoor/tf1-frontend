'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Users, UserPlus, MessageCircle, Award, ArrowLeft,
  Check, X, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Friend {
  _id: string
  name: string
  email: string
  friendship_id: string
  friends_since: string
  common_matches: number
}

interface FriendSuggestion {
  user: {
    _id: string
    name: string
    email: string
  }
  common_matches: number
  reason: string
}

export default function SocialPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'friends' | 'suggestions'>('friends')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Get token from localStorage (matches_token or sportx_access_token)
      const token = localStorage.getItem('matches_token') || 
                    localStorage.getItem('sportx_access_token') ||
                    localStorage.getItem('token')
      
      if (!token) {
        toast.error('يجب تسجيل الدخول أولاً')
        router.push('/matches/login?redirect=/matches/social')
        return
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com'
      const [friendsRes, suggestionsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/matches/api/social/friends`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }),
        fetch(`${apiBaseUrl}/matches/api/social/friends/suggestions`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
      ])

      // Handle 401 Unauthorized - token expired or invalid
      if (friendsRes.status === 401 || suggestionsRes.status === 401) {
        // Clear invalid token
        localStorage.removeItem('matches_token')
        localStorage.removeItem('sportx_access_token')
        localStorage.removeItem('token')
        
        toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى')
        router.push('/matches/login?redirect=/matches/social&reason=session_expired')
        return
      }

      if (friendsRes.ok) {
        const data = await friendsRes.json()
        setFriends(data.data?.friends || data.friends || [])
      } else if (!friendsRes.ok) {
        const errorData = await friendsRes.json().catch(() => ({}))
        console.error('Friends fetch error:', errorData)
        // Don't show error for empty friends list
        if (friendsRes.status !== 404) {
          toast.error(errorData.message || 'فشل في تحميل قائمة الأصدقاء')
        }
      }

      if (suggestionsRes.ok) {
        const data = await suggestionsRes.json()
        setSuggestions(data.data || data.suggestions || [])
      } else if (!suggestionsRes.ok && suggestionsRes.status !== 404) {
        const errorData = await suggestionsRes.json().catch(() => ({}))
        console.error('Suggestions fetch error:', errorData)
        // Don't show error for empty suggestions
      }
    } catch (error) {
      console.error('Error fetching social data:', error)
      // Only show error if it's not a navigation/redirect
      if (!(error instanceof Error && error.message.includes('redirect'))) {
        toast.error('فشل في تحميل البيانات')
      }
    } finally {
      setLoading(false)
    }
  }

  const sendFriendRequest = async (friendId: string) => {
    try {
      const token = localStorage.getItem('matches_token') || 
                    localStorage.getItem('sportx_access_token') ||
                    localStorage.getItem('token')
      
      if (!token) {
        toast.error('يجب تسجيل الدخول أولاً')
        router.push('/matches/login?redirect=/matches/social')
        return
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com'
      const res = await fetch(
        `${apiBaseUrl}/matches/api/social/friends/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify({ friendId })
        }
      )

      // Handle 401 Unauthorized
      if (res.status === 401) {
        localStorage.removeItem('matches_token')
        localStorage.removeItem('sportx_access_token')
        localStorage.removeItem('token')
        toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى')
        router.push('/matches/login?redirect=/matches/social&reason=session_expired')
        return
      }

      if (res.ok) {
        const data = await res.json()
        toast.success(data.message || 'تم إرسال طلب الصداقة!')
        // Remove from suggestions
        setSuggestions(suggestions.filter(s => s.user._id !== friendId))
        // Refresh friends list
        fetchData()
      } else {
        const errorData = await res.json().catch(() => ({}))
        toast.error(errorData.message || 'فشل في إرسال الطلب')
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
      toast.error('حدث خطأ أثناء إرسال الطلب')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">الأصدقاء</h1>
              <p className="text-gray-600">تواصل مع اللاعبين</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            أصدقائي ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'suggestions'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            اقتراحات ({suggestions.length})
          </button>
        </div>

        {/* Friends List */}
        {activeTab === 'friends' && (
          <div className="space-y-3">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <motion.div
                  key={friend._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                      {friend.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{friend.name}</h3>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                      {friend.common_matches > 0 && (
                        <p className="text-xs text-purple-600 mt-1">
                          🏆 {friend.common_matches} مباريات مشتركة
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-md">
                <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">لا توجد أصدقاء بعد</h3>
                <p className="text-gray-500 mb-4">ابدأ بإضافة أصدقاء من الاقتراحات!</p>
                <Button
                  onClick={() => setActiveTab('suggestions')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  شاهد الاقتراحات
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Suggestions List */}
        {activeTab === 'suggestions' && (
          <div className="space-y-3">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                      {suggestion.user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{suggestion.user.name}</h3>
                      <p className="text-sm text-purple-600">{suggestion.reason}</p>
                    </div>
                    <Button
                      onClick={() => sendFriendRequest(suggestion.user._id)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      إضافة
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-md">
                <Sparkles className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">لا توجد اقتراحات</h3>
                <p className="text-gray-500">العب المزيد من المباريات للحصول على اقتراحات!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

