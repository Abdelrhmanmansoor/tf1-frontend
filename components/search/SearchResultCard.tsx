'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Star,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  Building2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PersonCardProps {
  person: {
    _id: string
    firstName?: string
    lastName?: string
    name?: string
    type: string
    avatar?: string
    sport?: string
    rating?: number
    location?: string
    position?: string
    specialization?: string
    role?: string
  }
}

export const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  const router = useRouter()
  const displayName =
    person.name || `${person.firstName || ''} ${person.lastName || ''}`.trim()
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleViewProfile = () => {
    const role = person.type || person.role
    router.push(`/profile/${person._id}`)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={person.avatar} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg truncate">{displayName}</h4>

            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="capitalize">
                {person.type || person.role}
              </Badge>
              {person.sport && (
                <Badge variant="outline" className="capitalize">
                  {person.sport}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              {person.position && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{person.position}</span>
                </div>
              )}
              {person.specialization && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{person.specialization}</span>
                </div>
              )}
              {person.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{person.location}</span>
                </div>
              )}
              {person.rating && (
                <div className="flex items-center gap-1 text-yellow-600">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-medium">
                    {person.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleViewProfile} size="sm">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ClubCardProps {
  club: {
    _id: string
    name: string
    type?: string
    logo?: string
    location?: string
    rating?: number
    organizationType?: string
    sports?: string[]
  }
}

export const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  const router = useRouter()
  const initials = club.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleViewClub = () => {
    router.push(`/clubs/${club._id}`)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-lg">
            <AvatarImage src={club.logo} alt={club.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg truncate">{club.name}</h4>

            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="capitalize">
                <Building2 className="h-3 w-3 mr-1" />
                {club.organizationType || 'Club'}
              </Badge>
              {club.sports && club.sports.length > 0 && (
                <Badge variant="outline" className="capitalize">
                  {club.sports[0]}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              {club.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{club.location}</span>
                </div>
              )}
              {club.rating && (
                <div className="flex items-center gap-1 text-yellow-600">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-medium">{club.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleViewClub} size="sm">
            View Club
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface JobCardProps {
  job: {
    _id: string
    title: string
    club?: {
      _id: string
      name: string
      logo?: string
    }
    sport?: string
    jobType?: string
    location?: string
    deadline?: string
    salaryRange?: string
  }
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const router = useRouter()

  const handleViewJob = () => {
    router.push(`/jobs/${job._id}`)
  }

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null
    const date = new Date(deadline)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {job.club?.logo && (
            <Avatar className="h-16 w-16 rounded-lg">
              <AvatarImage src={job.club.logo} alt={job.club.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-lg">
                {job.club.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg truncate">{job.title}</h4>

            {job.club && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Building2 className="h-3.5 w-3.5" />
                {job.club.name}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {job.jobType && (
                <Badge variant="secondary" className="capitalize">
                  {job.jobType.replace('_', ' ')}
                </Badge>
              )}
              {job.sport && (
                <Badge variant="outline" className="capitalize">
                  {job.sport}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.salaryRange && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{job.salaryRange}</span>
                </div>
              )}
              {job.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Apply by {formatDeadline(job.deadline)}</span>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleViewJob} size="sm">
            View Job
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
