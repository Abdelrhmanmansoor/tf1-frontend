'use client'

import React, { useEffect, useState, useCallback } from 'react'
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
  Bookmark,
  Bell,
  BellOff,
  Trash2,
  Search,
  Loader2,
  Calendar,
} from 'lucide-react'
import searchService, { SavedSearch } from '@/services/search'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const SavedSearches: React.FC = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [searchToDelete, setSearchToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const loadSavedSearches = useCallback(async () => {
    try {
      setLoading(true)
      const searches = await searchService.getSavedSearches()
      setSavedSearches(searches)
    } catch (error) {
      console.error('Error loading saved searches:', error)
      toast({
        title: 'Error',
        description: 'Failed to load saved searches',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadSavedSearches()
  }, [loadSavedSearches])

  const handleDeleteSearch = async (searchId: string) => {
    try {
      await searchService.deleteSavedSearch(searchId)
      setSavedSearches(savedSearches.filter((s) => s._id !== searchId))
      toast({
        title: 'Success',
        description: 'Saved search deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting saved search:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete saved search',
        variant: 'destructive',
      })
    } finally {
      setDeleteDialogOpen(false)
      setSearchToDelete(null)
    }
  }

  const confirmDelete = (searchId: string) => {
    setSearchToDelete(searchId)
    setDeleteDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (savedSearches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Saved Searches</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Save your frequent searches to quickly access them later and get
            notified when new results match your criteria.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {savedSearches.map((search) => (
          <Card key={search._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bookmark className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg">{search.name}</CardTitle>
                  </div>
                  <CardDescription>
                    <span className="font-medium">Query:</span> &quot;
                    {search.searchQuery}&quot;
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Saved {formatDate(search.createdAt)}</span>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {search.searchType}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(search._id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {search.notifyOnNewResults ? (
                    <Bell className="h-4 w-4 text-primary" />
                  ) : (
                    <BellOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">
                    {search.notifyOnNewResults
                      ? 'Notifications enabled'
                      : 'Notifications disabled'}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  <Search className="h-3.5 w-3.5 mr-2" />
                  Run Search
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Saved Search</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this saved search? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                searchToDelete && handleDeleteSearch(searchToDelete)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
