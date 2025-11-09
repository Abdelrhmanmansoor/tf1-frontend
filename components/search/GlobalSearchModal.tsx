'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Search, X, TrendingUp, Clock, Bookmark } from 'lucide-react'
import searchService, {
  GlobalSearchResult,
  AutocompleteResult,
} from '@/services/search'
import { PersonCard, ClubCard, JobCard } from './SearchResultCard'
import { Badge } from '@/components/ui/badge'
import { useDebounce } from '@/hooks/useDebounce'

interface GlobalSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GlobalSearchResult | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [autocompleteResults, setAutocompleteResults] = useState<
    AutocompleteResult[]
  >([])
  const [trendingSearches, setTrendingSearches] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<any[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  const debouncedQuery = useDebounce(query, 300)

  // Load trending and recent searches when modal opens
  useEffect(() => {
    if (open) {
      loadTrendingSearches()
      loadRecentSearches()
    }
  }, [open])

  // Perform autocomplete
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performAutocomplete(debouncedQuery)
    } else {
      setAutocompleteResults([])
      setShowAutocomplete(false)
    }
  }, [debouncedQuery])

  const loadTrendingSearches = async () => {
    try {
      const trending = await searchService.getTrendingSearches(5, 7)
      setTrendingSearches(trending)
    } catch (error) {
      console.error('Error loading trending searches:', error)
    }
  }

  const loadRecentSearches = async () => {
    try {
      const history = await searchService.getSearchHistory(1, 5)
      setRecentSearches(history.data || [])
    } catch (error) {
      console.error('Error loading recent searches:', error)
    }
  }

  const performAutocomplete = async (searchQuery: string) => {
    try {
      const suggestions = await searchService.autocomplete(
        searchQuery,
        'all',
        5
      )
      setAutocompleteResults(suggestions)
      setShowAutocomplete(true)
    } catch (error) {
      console.error('Error in autocomplete:', error)
    }
  }

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) return

    setLoading(true)
    setShowAutocomplete(false)
    try {
      const searchResults = await searchService.globalSearch(searchQuery, 1, 10)
      setResults(searchResults)
    } catch (error) {
      console.error('Error performing search:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const handleQuickSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    performSearch(searchQuery)
  }

  const handleAutocompleteSelect = (suggestion: AutocompleteResult) => {
    setQuery(suggestion.name)
    setShowAutocomplete(false)
    performSearch(suggestion.name)
  }

  const clearSearch = () => {
    setQuery('')
    setResults(null)
    setAutocompleteResults([])
    setShowAutocomplete(false)
    setActiveTab('all')
  }

  const getTotalResults = () => {
    if (!results || !results.total) return 0
    // Backend returns: { total: { users: 3, clubs: 0, jobs: 0 } }
    if (typeof results.total === 'object') {
      return Object.values(results.total).reduce(
        (sum: number, count: any) => sum + (Number(count) || 0),
        0
      )
    }
    return 0
  }

  const getAllPeople = () => {
    if (!results || !results.results) return []
    const users = results.results.users || {}
    return [
      ...(users.coaches || []),
      ...(users.players || []),
      ...(users.specialists || []),
    ]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Search Everything</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for people, clubs, jobs..."
                className="pl-10 pr-10 h-12 text-base"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showAutocomplete && autocompleteResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {autocompleteResults.map((suggestion) => (
                  <button
                    key={suggestion._id}
                    type="button"
                    onClick={() => handleAutocompleteSelect(suggestion)}
                    className="w-full p-3 hover:bg-muted flex items-center gap-3 text-left transition-colors"
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{suggestion.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {suggestion.type}
                      </p>
                    </div>
                    {suggestion.rating && (
                      <Badge variant="secondary">
                        {suggestion.rating.toFixed(1)} ⭐
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Trending & Recent Searches (shown when no query) */}
          {!query && !results && (
            <div className="mt-6 space-y-4">
              {trendingSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((trending, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleQuickSearch(trending.query)}
                      >
                        {trending.query}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.map((recent) => (
                      <button
                        key={recent._id}
                        onClick={() => handleQuickSearch(recent.searchQuery)}
                        className="w-full p-2 hover:bg-muted rounded-lg text-left transition-colors flex items-center gap-2"
                      >
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{recent.searchQuery}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {recent.resultsCount} results
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Search Results */}
          {results && !loading && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Found {getTotalResults()} results
                {results.query ? ` for "${results.query}"` : ''}
              </p>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all">
                    All ({getTotalResults()})
                  </TabsTrigger>
                  <TabsTrigger value="people">
                    People ({results.total.users || 0})
                  </TabsTrigger>
                  <TabsTrigger value="clubs">
                    Clubs ({results.total.clubs || 0})
                  </TabsTrigger>
                  <TabsTrigger value="jobs">
                    Jobs ({results.total.jobs || 0})
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[400px] mt-4">
                  <TabsContent value="all" className="space-y-6">
                    {/* Coaches Section */}
                    {results.results.users?.coaches &&
                      results.results.users.coaches.length > 0 && (
                        <section>
                          <h3 className="text-lg font-semibold mb-3">
                            Coaches
                          </h3>
                          <div className="space-y-2">
                            {results.results.users.coaches.map((coach: any) => (
                              <PersonCard
                                key={coach._id}
                                person={{ ...coach, type: 'coach' }}
                              />
                            ))}
                          </div>
                        </section>
                      )}

                    {/* Players Section */}
                    {results.results.users?.players &&
                      results.results.users.players.length > 0 && (
                        <section>
                          <h3 className="text-lg font-semibold mb-3">
                            Players
                          </h3>
                          <div className="space-y-2">
                            {results.results.users.players.map(
                              (player: any) => (
                                <PersonCard
                                  key={player._id}
                                  person={{ ...player, type: 'player' }}
                                />
                              )
                            )}
                          </div>
                        </section>
                      )}

                    {/* Specialists Section */}
                    {results.results.users?.specialists &&
                      results.results.users.specialists.length > 0 && (
                        <section>
                          <h3 className="text-lg font-semibold mb-3">
                            Specialists
                          </h3>
                          <div className="space-y-2">
                            {results.results.users.specialists.map(
                              (specialist: any) => (
                                <PersonCard
                                  key={specialist._id}
                                  person={{ ...specialist, type: 'specialist' }}
                                />
                              )
                            )}
                          </div>
                        </section>
                      )}

                    {/* Clubs Section */}
                    {results.results.clubs &&
                      results.results.clubs.length > 0 && (
                        <section>
                          <h3 className="text-lg font-semibold mb-3">Clubs</h3>
                          <div className="space-y-2">
                            {results.results.clubs.map((club: any) => (
                              <ClubCard key={club._id} club={club} />
                            ))}
                          </div>
                        </section>
                      )}

                    {/* Jobs Section */}
                    {results.results.jobs &&
                      results.results.jobs.length > 0 && (
                        <section>
                          <h3 className="text-lg font-semibold mb-3">Jobs</h3>
                          <div className="space-y-2">
                            {results.results.jobs.map((job: any) => (
                              <JobCard key={job._id} job={job} />
                            ))}
                          </div>
                        </section>
                      )}

                    {/* No Results */}
                    {getTotalResults() === 0 && (
                      <div className="text-center py-12">
                        <p className="text-lg font-medium">
                          No results found for &quot;{results.query}&quot;
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Try different keywords or check your spelling
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="people" className="space-y-2">
                    {getAllPeople().map((person: any) => (
                      <PersonCard key={person._id} person={person} />
                    ))}
                    {getAllPeople().length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No people found</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="clubs" className="space-y-2">
                    {results.results.clubs?.map((club: any) => (
                      <ClubCard key={club._id} club={club} />
                    ))}
                    {(!results.results.clubs ||
                      results.results.clubs.length === 0) && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No clubs found</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="jobs" className="space-y-2">
                    {results.results.jobs?.map((job: any) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                    {(!results.results.jobs ||
                      results.results.jobs.length === 0) && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No jobs found</p>
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
