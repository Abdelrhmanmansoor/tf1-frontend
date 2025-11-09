/* eslint-disable no-unused-vars */
'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface CustomDatePickerProps {
  value: string // Format: YYYY-MM-DD
  onChange: (value: string) => void
  language: string
  placeholder?: {
    day?: string
    month?: string
    year?: string
  }
}

export default function CustomDatePicker({
  value,
  onChange,
  language,
  placeholder = {},
}: CustomDatePickerProps) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const previousValueRef = useRef(value)

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [yearPart, monthPart, dayPart] = value.split('-')
      setYear(yearPart || '')
      setMonth(monthPart || '')
      setDay(dayPart || '')
    }
  }, [value])

  // Update parent when any part changes
  useEffect(() => {
    let newValue = ''
    if (day && month && year) {
      newValue = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    // Only call onChange if the value actually changed
    if (newValue !== previousValueRef.current) {
      previousValueRef.current = newValue
      onChange(newValue)
    }
  }, [day, month, year, onChange])

  // Generate years (current year to 100 years ago)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  // Months data
  const months = [
    { value: '1', label: language === 'ar' ? 'يناير' : 'January' },
    { value: '2', label: language === 'ar' ? 'فبراير' : 'February' },
    { value: '3', label: language === 'ar' ? 'مارس' : 'March' },
    { value: '4', label: language === 'ar' ? 'أبريل' : 'April' },
    { value: '5', label: language === 'ar' ? 'مايو' : 'May' },
    { value: '6', label: language === 'ar' ? 'يونيو' : 'June' },
    { value: '7', label: language === 'ar' ? 'يوليو' : 'July' },
    { value: '8', label: language === 'ar' ? 'أغسطس' : 'August' },
    { value: '9', label: language === 'ar' ? 'سبتمبر' : 'September' },
    { value: '10', label: language === 'ar' ? 'أكتوبر' : 'October' },
    { value: '11', label: language === 'ar' ? 'نوفمبر' : 'November' },
    { value: '12', label: language === 'ar' ? 'ديسمبر' : 'December' },
  ]

  // Get maximum days for selected month/year
  const getMaxDays = () => {
    if (!month || !year) return 31
    return new Date(parseInt(year), parseInt(month), 0).getDate()
  }

  const maxDays = getMaxDays()

  return (
    <div
      className={`grid grid-cols-3 gap-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}
    >
      {/* Day Dropdown */}
      <div className="relative">
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-full h-12 pl-4 pr-10 text-lg bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
          dir="ltr"
        >
          <option value="">
            {placeholder.day || (language === 'ar' ? 'اليوم' : 'Day')}
          </option>
          {Array.from({ length: maxDays }, (_, i) => i + 1).map((dayNum) => (
            <option key={dayNum} value={dayNum}>
              {dayNum}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Month Dropdown */}
      <div className="relative">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full h-12 pl-4 pr-10 text-lg bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <option value="">
            {placeholder.month || (language === 'ar' ? 'الشهر' : 'Month')}
          </option>
          {months.map((monthOption) => (
            <option key={monthOption.value} value={monthOption.value}>
              {monthOption.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Year Dropdown */}
      <div className="relative">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full h-12 pl-4 pr-10 text-lg bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
          dir="ltr"
        >
          <option value="">
            {placeholder.year || (language === 'ar' ? 'السنة' : 'Year')}
          </option>
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}
