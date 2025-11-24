'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { GlobalSearchModal } from './GlobalSearchModal'

interface GlobalSearchButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showLabel?: boolean
}

export const GlobalSearchButton: React.FC<GlobalSearchButtonProps> = ({
  variant = 'outline',
  size = 'default',
  className = '',
  showLabel = true,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsSearchOpen(true)}
        className={className}
      >
        <Search className="h-4 w-4" />
        {showLabel && size !== 'icon' && <span className="ml-2">Search</span>}
      </Button>

      <GlobalSearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
