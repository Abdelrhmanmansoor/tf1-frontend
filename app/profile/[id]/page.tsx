'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import profileService, { ProfileData } from '@/services/profile'
import { messagingService } from '@/services/messaging'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  MessageCircle,
  UserPlus,
  Share2,
  Flag,
  Loader2,
  CheckCircle,
  Globe,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { RatingModal } from '@/components/rating/RatingModal'

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const { user } = useAuth()
  const { language } = useLanguage()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messageLoading, setMessageLoading] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchProfile(userId)
    }
  }, [userId])

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch profile using the universal profile endpoint
      const profileData = await profileService.getProfile(id)
      setProfile(profileData)

      // TODO: Track profile view when backend endpoint is ready
      // profileService.trackProfileView(id).catch(() => {})
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'player':
        return 'bg-blue-100 text-blue-800'
      case 'coach':
        return 'bg-purple-100 text-purple-800'
      case 'specialist':
        return 'bg-green-100 text-green-800'
      case 'club':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSendMessage = async () => {
    if (!profile || !user) return

    try {
      setMessageLoading(true)

      // IMPORTANT: Get the USER ID from the profile, NOT the profile ID
      // Backend structure: { profile: { userId: { _id: "USER_ID" } } }
      // profile._id = Profile ID (wrong!)
      // profile.profile.userId._id = User ID (correct!)

      let recipientUserId: string | null = null

      // Try to get User ID from nested structure
      if (profile.profile?.userId) {
        if (typeof profile.profile.userId === 'string') {
          recipientUserId = profile.profile.userId
        } else if (profile.profile.userId._id) {
          recipientUserId = profile.profile.userId._id
        }
      }

      if (!recipientUserId) {
        alert('Unable to send message. User ID not found in profile.')
        console.error('Profile structure:', profile)
        console.error('Expected: profile.profile.userId._id')
        return
      }

      console.log('Creating conversation with User ID:', recipientUserId)
      console.log('(Not using Profile ID:', profile._id, ')')

      // Create or get existing conversation with this user
      // Backend expects 'type' field: 'direct' or 'group'
      const response = await messagingService.createConversation({
        participantIds: [recipientUserId],
        type: 'direct',
      })

      if (response.success && response.conversation) {
        // Navigate to role-specific messages page with the conversation ID
        const messagesPath = `/dashboard/${user.role}/messages?conversation=${response.conversation._id}`
        router.push(messagesPath)
      }
    } catch (err: any) {
      console.error('Error creating conversation:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error status:', err.response?.status)

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to start conversation'
      alert(`Error: ${errorMessage}\n\nCheck console for details.`)
    } finally {
      setMessageLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flag className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Profile Not Found</h3>
            <p className="text-gray-600 mb-6">
              {error ||
                "The profile you're looking for doesn't exist or has been removed."}
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage
                      src={profile.avatar}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {getInitials(profile.firstName, profile.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {profile.firstName} {profile.lastName}
                        </h1>
                        {profile.isVerified && (
                          <CheckCircle className="h-6 w-6 text-blue-500" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getRoleBadgeColor(profile.role)}>
                          {profile.role.charAt(0).toUpperCase() +
                            profile.role.slice(1)}
                        </Badge>
                        {profile.isVerified && (
                          <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-600"
                          >
                            {language === 'ar' ? 'موثق' : 'Verified'}
                          </Badge>
                        )}

                        {profile.role === 'club' &&
                          (profile.profile?.nationalAddress?.isVerified ? (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600 flex items-center gap-1 bg-green-50"
                            >
                              <div className="relative flex items-center justify-center">
                                <Shield className="h-3.5 w-3.5 fill-green-600 text-green-50" />
                                <CheckCircle className="h-2 w-2 text-white absolute" />
                              </div>
                              <span>
                                {language === 'ar'
                                  ? 'تم تأكيد العنوان الوطني'
                                  : 'National Address Verified'}
                              </span>
                            </Badge>
                          ) : (
                            <div className="group relative">
                              <Badge
                                variant="outline"
                                className="text-orange-600 border-orange-600 flex items-center gap-1 bg-orange-50 cursor-help"
                              >
                                <AlertTriangle className="h-3.5 w-3.5" />
                                <span>
                                  {language === 'ar'
                                    ? 'العنوان الوطني غير موثّق'
                                    : 'Address Not Verified'}
                                </span>
                              </Badge>
                              {/* Tooltip */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-xl">
                                {language === 'ar'
                                  ? 'تم تسجيل النادي بدون توثيق العنوان الوطني — ولم يتم التحقق من الموقع الجغرافي رسميًا.'
                                  : 'Club registered without national address verification — geographic location not officially verified.'}
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {profile.location && (
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {profile.location.city}, {profile.location.country}
                          </span>
                        </div>
                      )}

                      {profile.bio && (
                        <p className="text-gray-700 mt-3 max-w-2xl">
                          {profile.bio}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        className="bg-primary"
                        onClick={handleSendMessage}
                        disabled={messageLoading}
                      >
                        {messageLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowRatingModal(true)}
                        className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Rate
                      </Button>
                      <Button variant="outline">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  {profile.stats && (
                    <div className="flex gap-6 mt-6 pt-6 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {profile.stats.profileViews || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Profile Views
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {profile.stats.connections || 0}
                        </div>
                        <div className="text-sm text-gray-600">Connections</div>
                      </div>
                      {profile.stats.rating && profile.stats.rating.average && (
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            {profile.stats.rating.average.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {profile.stats.rating.count || 0} Reviews
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Content */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.bio && (
                  <div>
                    <h3 className="font-semibold mb-2">Bio</h3>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-medium">{profile.email}</div>
                      </div>
                    </div>
                  )}

                  {profile.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Phone</div>
                        <div className="font-medium">{profile.phoneNumber}</div>
                      </div>
                    </div>
                  )}

                  {profile.dateOfBirth && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">
                          Date of Birth
                        </div>
                        <div className="font-medium">
                          {new Date(profile.dateOfBirth).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Member Since</div>
                      <div className="font-medium">
                        {new Date(profile.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {profile.socialLinks && profile.socialLinks.website && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Social Links</h3>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={profile.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Experience & Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Experience details will be displayed here...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Reviews will be displayed here...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.email && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Email Address</div>
                      <div className="font-medium">{profile.email}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Send Email
                    </Button>
                  </div>
                )}

                {profile.phoneNumber && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Phone Number</div>
                      <div className="font-medium">{profile.phoneNumber}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Call
                    </Button>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="font-medium">
                        {profile.location.city}, {profile.location.country}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Rating Modal */}
      {profile && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          userId={
            typeof profile.profile?.userId === 'string'
              ? profile.profile.userId
              : profile.profile?.userId?._id || ''
          }
          userRole={profile.role}
          userName={`${profile.firstName} ${profile.lastName}`.trim()}
          onSuccess={() => {
            // Optionally refresh profile to show updated rating
            fetchProfile(userId)
          }}
        />
      )}
    </div>
  )
}
