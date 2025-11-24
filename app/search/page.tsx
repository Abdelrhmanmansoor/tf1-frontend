'use client'

import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Search, History, Bookmark, TrendingUp, Compass } from 'lucide-react'
import { QuickSearchCards } from '@/components/search/QuickSearchCards'
import {
  SearchHistory,
  TrendingSearches,
} from '@/components/search/SearchHistory'
import { SavedSearches } from '@/components/search/SavedSearches'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'

export default function SearchPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const userRole = user.role as 'player' | 'coach' | 'specialist' | 'club'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Search & Discover
              </h1>
              <p className="text-gray-600 mt-2">
                Find players, coaches, clubs, specialists, and opportunities
              </p>
            </div>
            <GlobalSearchButton variant="default" size="lg" showLabel={true} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="quick" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="quick" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Quick Search</span>
              <span className="sm:hidden">Quick</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
              <span className="sm:hidden">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trending</span>
              <span className="sm:hidden">Trending</span>
            </TabsTrigger>
          </TabsList>

          {/* Quick Search Tab */}
          <TabsContent value="quick" className="space-y-6">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Quick Search Options
                </CardTitle>
                <CardDescription>
                  Click on any card below to quickly search for specific content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuickSearchCards role={userRole} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search History Tab */}
          <TabsContent value="history" className="space-y-6">
            <SearchHistory />
          </TabsContent>

          {/* Saved Searches Tab */}
          <TabsContent value="saved" className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Saved Searches
                </CardTitle>
                <CardDescription>
                  Manage your saved searches and get notified when new results
                  match
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SavedSearches />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trending Searches Tab */}
          <TabsContent value="trending" className="space-y-6">
            <TrendingSearches />
          </TabsContent>
        </Tabs>

        {/* Pro Tips Card */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  Use the global search button to search across all content
                  types at once
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  Save frequent searches to quickly access them and get
                  notifications for new matches
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  Check trending searches to discover what others are looking
                  for
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  Use quick search cards for role-specific searches tailored to
                  your needs
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
