'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Plus,
  Image as ImageIcon,
  Video,
  X,
  Loader2,
  Upload,
  Trash2,
  Play,
} from 'lucide-react'
import Link from 'next/link'
import coachService from '@/services/coach'
import type { Photo, Video as VideoType } from '@/types/coach'

const GalleryPage = () => {
  const { language } = useLanguage()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [videos, setVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos')

  // Add Photo Modal
  const [showAddPhoto, setShowAddPhoto] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [photoCaption, setPhotoCaption] = useState('')
  const [photoCaptionAr, setPhotoCaptionAr] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  // Add Video Modal
  const [showAddVideo, setShowAddVideo] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDescription, setVideoDescription] = useState('')
  const [addingVideo, setAddingVideo] = useState(false)

  useEffect(() => {
    fetchGalleryData()
  }, [])

  const fetchGalleryData = async () => {
    try {
      setLoading(true)
      const profile = await coachService.getMyProfile()
      setPhotos(profile.photos || [])
      setVideos(profile.videos || [])
    } catch (err) {
      console.error('Error fetching gallery:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert(
        language === 'ar' ? 'الرجاء اختيار صورة' : 'Please select an image file'
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        language === 'ar'
          ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت'
          : 'File size must be less than 5MB'
      )
      return
    }

    setSelectedFile(file)

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAddPhoto = async () => {
    if (!selectedFile) return

    try {
      setAdding(true)
      await coachService.addPhoto(selectedFile, photoCaption, photoCaptionAr)

      // Refresh gallery
      await fetchGalleryData()

      setShowAddPhoto(false)
      setSelectedFile(null)
      setPhotoPreview(null)
      setPhotoCaption('')
      setPhotoCaptionAr('')
    } catch (err: any) {
      console.error('Error adding photo:', err)
      alert(
        err.message ||
          (language === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload photo')
      )
    } finally {
      setAdding(false)
    }
  }

  const handleRemovePhoto = async (photoId: string) => {
    if (
      !confirm(
        language === 'ar' ? 'هل تريد حذف هذه الصورة؟' : 'Delete this photo?'
      )
    )
      return

    try {
      await coachService.removePhoto(photoId)
      // Refresh gallery
      await fetchGalleryData()
    } catch (err: any) {
      console.error('Error removing photo:', err)
      alert(
        err.message ||
          (language === 'ar' ? 'فشل حذف الصورة' : 'Failed to delete photo')
      )
    }
  }

  const handleAddVideo = async () => {
    if (!videoUrl) return

    try {
      setAddingVideo(true)
      await coachService.addVideo({
        url: videoUrl,
        title: videoTitle,
        description: videoDescription,
      })

      // Refresh gallery
      await fetchGalleryData()

      setShowAddVideo(false)
      setVideoUrl('')
      setVideoTitle('')
      setVideoDescription('')
    } catch (err) {
      console.error('Error adding video:', err)
    } finally {
      setAddingVideo(false)
    }
  }

  const handleRemoveVideo = async (videoId: string) => {
    if (
      !confirm(
        language === 'ar' ? 'هل تريد حذف هذا الفيديو؟' : 'Delete this video?'
      )
    )
      return

    try {
      await coachService.removeVideo(videoId)
      // Refresh gallery
      await fetchGalleryData()
    } catch (err) {
      console.error('Error removing video:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {language === 'ar' ? 'العودة' : 'Back'}
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'معرض الصور والفيديو' : 'Media Gallery'}
              </h1>
            </div>
            <Button
              onClick={() =>
                activeTab === 'photos'
                  ? setShowAddPhoto(true)
                  : setShowAddVideo(true)
              }
              className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'photos'
                ? language === 'ar'
                  ? 'إضافة صورة'
                  : 'Add Photo'
                : language === 'ar'
                  ? 'إضافة فيديو'
                  : 'Add Video'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'photos'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            {language === 'ar' ? 'الصور' : 'Photos'} ({photos.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Video className="w-5 h-5" />
            {language === 'ar' ? 'الفيديوهات' : 'Videos'} ({videos.length})
          </button>
        </div>

        {/* Photos Grid */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <motion.div
                key={photo._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Photo'}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                {photo.caption && (
                  <div className="p-4">
                    <p className="text-sm text-gray-700">{photo.caption}</p>
                  </div>
                )}
                <button
                  onClick={() => handleRemovePhoto(photo._id)}
                  className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            {photos.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <ImageIcon className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  {language === 'ar' ? 'لا توجد صور بعد' : 'No photos yet'}
                </p>
                <p className="text-sm mt-2">
                  {language === 'ar'
                    ? 'أضف صورك الأولى!'
                    : 'Add your first photo!'}
                </p>
                <Button
                  onClick={() => setShowAddPhoto(true)}
                  className="mt-4 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'ar' ? 'إضافة صورة' : 'Add Photo'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Videos Grid */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title || 'Video'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white rounded-full shadow-lg hover:scale-110 transition"
                    >
                      <Play className="w-8 h-8 text-purple-600" />
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  {video.title && (
                    <h3 className="font-bold text-gray-900 mb-1">
                      {video.title}
                    </h3>
                  )}
                  {video.description && (
                    <p className="text-sm text-gray-600">{video.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            {videos.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <Video className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  {language === 'ar' ? 'لا توجد فيديوهات بعد' : 'No videos yet'}
                </p>
                <p className="text-sm mt-2">
                  {language === 'ar' ? 'أضف فيديوهاتك!' : 'Add your videos!'}
                </p>
                <Button
                  onClick={() => setShowAddVideo(true)}
                  className="mt-4 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'ar' ? 'إضافة فيديو' : 'Add Video'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {showAddPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddPhoto(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-purple-600" />
                  {language === 'ar' ? 'إضافة صورة' : 'Add Photo'}
                </h2>
                <button
                  onClick={() => setShowAddPhoto(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اختر صورة' : 'Select Photo'} *
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            {language === 'ar'
                              ? 'اضغط للرفع'
                              : 'Click to upload'}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === 'ar'
                            ? 'PNG, JPG, GIF حتى 5 ميجابايت'
                            : 'PNG, JPG, GIF up to 5MB'}
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Caption English */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar'
                      ? 'التعليق (إنجليزي)'
                      : 'Caption (English)'}
                  </label>
                  <Input
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Add a caption..."
                  />
                </div>

                {/* Caption Arabic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'التعليق (عربي)' : 'Caption (Arabic)'}
                  </label>
                  <Input
                    value={photoCaptionAr}
                    onChange={(e) => setPhotoCaptionAr(e.target.value)}
                    placeholder="أضف تعليق..."
                    dir="rtl"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowAddPhoto(false)
                      setSelectedFile(null)
                      setPhotoPreview(null)
                      setPhotoCaption('')
                      setPhotoCaptionAr('')
                    }}
                    variant="outline"
                    className="flex-1"
                    disabled={adding}
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleAddPhoto}
                    className="flex-1"
                    disabled={adding || !selectedFile}
                  >
                    {adding ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {adding
                      ? language === 'ar'
                        ? 'جاري الرفع...'
                        : 'Uploading...'
                      : language === 'ar'
                        ? 'رفع'
                        : 'Upload'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Video Modal */}
      <AnimatePresence>
        {showAddVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-purple-600" />
                  {language === 'ar' ? 'إضافة فيديو' : 'Add Video'}
                </h2>
                <button
                  onClick={() => setShowAddVideo(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رابط الفيديو' : 'Video URL'} *
                  </label>
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'العنوان' : 'Title'}
                  </label>
                  <Input
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Video title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </label>
                  <Input
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Brief description"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowAddVideo(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={addingVideo}
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleAddVideo}
                    className="flex-1"
                    disabled={addingVideo || !videoUrl}
                  >
                    {addingVideo ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {addingVideo
                      ? language === 'ar'
                        ? 'جاري الإضافة...'
                        : 'Adding...'
                      : language === 'ar'
                        ? 'إضافة'
                        : 'Add'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GalleryPage
