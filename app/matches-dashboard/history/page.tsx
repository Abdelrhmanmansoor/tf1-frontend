'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/matches-dashboard/DashboardLayout'
import { getMatchHistory } from '@/services/matches'
import { motion } from 'framer-motion'
import { History, Calendar, MapPin, Trophy } from 'lucide-react'

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getMatchHistory()
        setHistory(data.matches || [])
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تاريخ المباريات
          </h1>
          <p className="text-gray-600">سجل مبارياتك السابقة</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد مباريات سابقة</p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.match?.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {item.match?.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {item.match?.city}
                      </div>
                    </div>
                  </div>

                  {item.rating && (
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {item.rating}/5
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">تقييمك</p>
                    </div>
                  )}
                </div>

                {item.review && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{item.review}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    اكتملت في{' '}
                    {new Date(item.completedAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
