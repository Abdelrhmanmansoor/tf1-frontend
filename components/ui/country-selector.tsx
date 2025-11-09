/* eslint-disable no-unused-vars */
'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { Country } from '@/lib/countries'
import { useLanguage } from '@/contexts/language-context'

interface CountrySelectorProps {
  countries: Country[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  showDialCode?: boolean
  className?: string
}

export const CountrySelector = ({
  countries,
  value,
  onChange,
  disabled = false,
  placeholder,
  showDialCode = false,
  className = '',
}: CountrySelectorProps) => {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedCountry = countries.find((country) =>
    showDialCode ? country.dialCode === value : country.code === value
  )

  const filteredCountries = countries.filter((country) => {
    const name = language === 'ar' ? country.nameAr : country.name
    const searchValue = searchTerm.toLowerCase()
    return (
      name.toLowerCase().includes(searchValue) ||
      country.dialCode.includes(searchValue) ||
      country.code.toLowerCase().includes(searchValue)
    )
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (country: Country) => {
    onChange(showDialCode ? country.dialCode : country.code)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full h-12 px-3 pr-10 bg-white border border-gray-300 rounded-lg 
          text-left text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          flex items-center justify-between
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedCountry ? (
            <>
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="font-medium text-gray-900 truncate">
                {language === 'ar'
                  ? selectedCountry.nameAr
                  : selectedCountry.name}
              </span>
              {showDialCode && (
                <span className="text-xs text-gray-500 border border-gray-300 px-1.5 py-0.5 rounded bg-gray-50">
                  {selectedCountry.dialCode}
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-500">
              {placeholder ||
                (language === 'ar' ? 'اختر دولة' : 'Select country')}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden"
        >
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'ar' ? 'البحث...' : 'Search...'}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full px-3 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {language === 'ar' ? country.nameAr : country.name}
                    </div>
                    {showDialCode && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {country.dialCode}
                      </div>
                    )}
                  </div>
                  {showDialCode && (
                    <span className="text-xs text-gray-500 border border-gray-300 px-1.5 py-0.5 rounded bg-gray-50 shrink-0">
                      {country.dialCode}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-gray-500 text-sm">
                {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
