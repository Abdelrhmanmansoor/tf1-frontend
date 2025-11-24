'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Users,
  Briefcase,
  Building2,
  Trophy,
  Star,
  TrendingUp,
} from 'lucide-react'
import { GlobalSearchModal } from './GlobalSearchModal'

interface QuickSearchOption {
  title: string
  description: string
  icon: React.ReactNode
  searchQuery: string
  badge?: string
  color?: string
}

interface QuickSearchCardsProps {
  role: 'player' | 'coach' | 'specialist' | 'club'
}

export const QuickSearchCards: React.FC<QuickSearchCardsProps> = ({ role }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')

  const handleQuickSearch = (query: string) => {
    setInitialQuery(query)
    setIsSearchOpen(true)
  }

  const getQuickSearchOptions = (): QuickSearchOption[] => {
    switch (role) {
      case 'player':
        return [
          {
            title: 'Find Coaches',
            description: 'Search for professional coaches',
            icon: <Users className="h-5 w-5" />,
            searchQuery: 'coach',
            badge: 'Popular',
            color: 'from-blue-500 to-blue-600',
          },
          {
            title: 'Browse Clubs',
            description: 'Discover clubs and academies',
            icon: <Building2 className="h-5 w-5" />,
            searchQuery: 'club academy',
            color: 'from-purple-500 to-purple-600',
          },
          {
            title: 'Job Opportunities',
            description: 'Find professional opportunities',
            icon: <Briefcase className="h-5 w-5" />,
            searchQuery: 'jobs',
            badge: 'New',
            color: 'from-green-500 to-green-600',
          },
          {
            title: 'Sports Specialists',
            description: 'Find physios, nutritionists, trainers',
            icon: <Trophy className="h-5 w-5" />,
            searchQuery: 'specialist',
            color: 'from-orange-500 to-orange-600',
          },
        ]

      case 'coach':
        return [
          {
            title: 'Find Players',
            description: 'Search for talented players',
            icon: <Users className="h-5 w-5" />,
            searchQuery: 'player',
            badge: 'Popular',
            color: 'from-blue-500 to-blue-600',
          },
          {
            title: 'Browse Clubs',
            description: 'Find clubs hiring coaches',
            icon: <Building2 className="h-5 w-5" />,
            searchQuery: 'club',
            color: 'from-purple-500 to-purple-600',
          },
          {
            title: 'Coaching Jobs',
            description: 'Browse coaching positions',
            icon: <Briefcase className="h-5 w-5" />,
            searchQuery: 'coaching jobs',
            badge: 'Hot',
            color: 'from-green-500 to-green-600',
          },
          {
            title: 'Other Coaches',
            description: 'Network with fellow coaches',
            icon: <TrendingUp className="h-5 w-5" />,
            searchQuery: 'coach network',
            color: 'from-orange-500 to-orange-600',
          },
        ]

      case 'specialist':
        return [
          {
            title: 'Find Athletes',
            description: 'Search for players and coaches',
            icon: <Users className="h-5 w-5" />,
            searchQuery: 'player athlete',
            badge: 'Popular',
            color: 'from-blue-500 to-blue-600',
          },
          {
            title: 'Sports Clubs',
            description: 'Find clubs needing specialists',
            icon: <Building2 className="h-5 w-5" />,
            searchQuery: 'club',
            color: 'from-purple-500 to-purple-600',
          },
          {
            title: 'Job Opportunities',
            description: 'Browse specialist positions',
            icon: <Briefcase className="h-5 w-5" />,
            searchQuery: 'specialist jobs',
            badge: 'New',
            color: 'from-green-500 to-green-600',
          },
          {
            title: 'Fellow Specialists',
            description: 'Network with other specialists',
            icon: <Trophy className="h-5 w-5" />,
            searchQuery: 'specialist',
            color: 'from-orange-500 to-orange-600',
          },
        ]

      case 'club':
        return [
          {
            title: 'Find Players',
            description: 'Search for talented players',
            icon: <Users className="h-5 w-5" />,
            searchQuery: 'player',
            badge: 'Popular',
            color: 'from-blue-500 to-blue-600',
          },
          {
            title: 'Find Coaches',
            description: 'Search for qualified coaches',
            icon: <Star className="h-5 w-5" />,
            searchQuery: 'coach',
            color: 'from-purple-500 to-purple-600',
          },
          {
            title: 'Sports Specialists',
            description: 'Find physios, trainers, nutritionists',
            icon: <Trophy className="h-5 w-5" />,
            searchQuery: 'specialist',
            color: 'from-green-500 to-green-600',
          },
          {
            title: 'Other Clubs',
            description: 'Discover other sports organizations',
            icon: <Building2 className="h-5 w-5" />,
            searchQuery: 'club',
            color: 'from-orange-500 to-orange-600',
          },
        ]

      default:
        return []
    }
  }

  const quickSearchOptions = getQuickSearchOptions()

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickSearchOptions.map((option, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-primary/20"
            onClick={() => handleQuickSearch(option.searchQuery)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${option.color} text-white group-hover:scale-110 transition-transform`}
                >
                  {option.icon}
                </div>
                {option.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {option.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base mb-1 group-hover:text-primary transition-colors">
                {option.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {option.description}
              </CardDescription>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                <Search className="h-4 w-4 mr-2" />
                Quick Search
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <GlobalSearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
