'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import secretaryService from '@/services/secretary'
import {
  ClipboardList,
  Loader2,
  Plus,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Filter,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  titleAr: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  assignedBy: string
}

export default function SecretaryTasksPage() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const [newTask, setNewTask] = useState({
    title: '',
    titleAr: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
    assignedBy: ''
  })

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await secretaryService.getTasks()
      setTasks(data || [])
      setFilteredTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error(language === 'ar' ? 'تعذر تحميل المهام' : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    let filtered = [...tasks]

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus)
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority)
    }

    setFilteredTasks(filtered)
  }, [tasks, filterStatus, filterPriority])

  const handleAddTask = async () => {
    if (!newTask.title) {
      toast.error(language === 'ar' ? 'يرجى إدخال عنوان المهمة' : 'Please enter task title')
      return
    }

    try {
      setSaving(true)
      await secretaryService.createTask({
        title: newTask.title,
        titleAr: newTask.titleAr || newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        status: 'pending',
        assignedBy: newTask.assignedBy
      })
      toast.success(language === 'ar' ? 'تمت إضافة المهمة بنجاح' : 'Task added successfully')
      setShowAddModal(false)
      setNewTask({
        title: '',
        titleAr: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedBy: ''
      })
      fetchTasks()
    } catch (error: any) {
      console.error('Error adding task:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateStatus = async (task: Task, newStatus: Task['status']) => {
    try {
      await secretaryService.updateTask(task.id, { status: newStatus })
      toast.success(language === 'ar' ? 'تم تحديث حالة المهمة' : 'Task status updated')
      fetchTasks()
    } catch (error: any) {
      console.error('Error updating task:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      await secretaryService.completeTask(taskId)
      toast.success(language === 'ar' ? 'تم إكمال المهمة' : 'Task completed')
      fetchTasks()
    } catch (error: any) {
      console.error('Error completing task:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    }
  }

  const getStatusLabel = (status: Task['status']) => {
    const labels = {
      pending: language === 'ar' ? 'معلقة' : 'Pending',
      'in-progress': language === 'ar' ? 'جارية' : 'In Progress',
      completed: language === 'ar' ? 'مكتملة' : 'Completed'
    }
    return labels[status]
  }

  const getPriorityLabel = (priority: Task['priority']) => {
    const labels = {
      high: language === 'ar' ? 'عالية' : 'High',
      medium: language === 'ar' ? 'متوسطة' : 'Medium',
      low: language === 'ar' ? 'منخفضة' : 'Low'
    }
    return labels[priority]
  }

  const pendingCount = tasks.filter(t => t.status === 'pending').length
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length
  const completedCount = tasks.filter(t => t.status === 'completed').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/secretary">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'رجوع' : 'Back'}
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'المهام' : 'Tasks'}
            </h1>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'مهمة جديدة' : 'New Task'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{language === 'ar' ? 'معلقة' : 'Pending'}</p>
                <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{language === 'ar' ? 'جارية' : 'In Progress'}</p>
                <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{language === 'ar' ? 'مكتملة' : 'Completed'}</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{language === 'ar' ? 'فلترة:' : 'Filter:'}</span>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{language === 'ar' ? 'كل الحالات' : 'All Status'}</option>
              <option value="pending">{language === 'ar' ? 'معلقة' : 'Pending'}</option>
              <option value="in-progress">{language === 'ar' ? 'جارية' : 'In Progress'}</option>
              <option value="completed">{language === 'ar' ? 'مكتملة' : 'Completed'}</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{language === 'ar' ? 'كل الأولويات' : 'All Priorities'}</option>
              <option value="high">{language === 'ar' ? 'عالية' : 'High'}</option>
              <option value="medium">{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
              <option value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>{language === 'ar' ? 'لا توجد مهام' : 'No tasks found'}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => task.status !== 'completed' && handleCompleteTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.status === 'completed'
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      <div>
                        <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {language === 'ar' ? task.titleAr : task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {task.dueDate}
                            </span>
                          )}
                          {task.assignedBy && (
                            <span className="text-xs text-gray-400">
                              {language === 'ar' ? 'من: ' : 'From: '}{task.assignedBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task, e.target.value as Task['status'])}
                        className={`text-xs p-1 rounded border ${
                          task.status === 'completed' ? 'bg-green-100 border-green-200' :
                          task.status === 'in-progress' ? 'bg-blue-100 border-blue-200' :
                          'bg-orange-100 border-orange-200'
                        }`}
                      >
                        <option value="pending">{language === 'ar' ? 'معلقة' : 'Pending'}</option>
                        <option value="in-progress">{language === 'ar' ? 'جارية' : 'In Progress'}</option>
                        <option value="completed">{language === 'ar' ? 'مكتملة' : 'Completed'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {language === 'ar' ? 'إضافة مهمة جديدة' : 'Add New Task'}
                </h3>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'} *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={newTask.titleAr}
                    onChange={(e) => setNewTask({ ...newTask, titleAr: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الأولوية' : 'Priority'}
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</option>
                    <option value="medium">{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
                    <option value="high">{language === 'ar' ? 'عالية' : 'High'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'من' : 'Assigned By'}
                  </label>
                  <input
                    type="text"
                    value={newTask.assignedBy}
                    onChange={(e) => setNewTask({ ...newTask, assignedBy: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  type="button"
                  onClick={handleAddTask}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'إضافة' : 'Add')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
