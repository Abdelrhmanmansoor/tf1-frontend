// Profile Completion Calculator
// Calculates accurate profile completion percentage based on all available fields

import type { PlayerProfile } from '@/types/player'

export interface ProfileCompletionDetails {
  percentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  completedCount: number
}

export const calculateProfileCompletion = (
  profile: PlayerProfile
): ProfileCompletionDetails => {
  const completedFields: string[] = []
  const missingFields: string[] = []

  // Required/Core fields (40% weight)
  const coreFields = [
    {
      key: 'primarySport',
      label: 'Primary Sport',
      value: profile.primarySport,
    },
    { key: 'position', label: 'Position', value: profile.position },
    { key: 'level', label: 'Level', value: profile.level },
    { key: 'status', label: 'Status', value: profile.status },
    {
      key: 'location.country',
      label: 'Country',
      value: profile.location?.country,
    },
    { key: 'location.city', label: 'City', value: profile.location?.city },
  ]

  // Personal Details (20% weight)
  const personalFields = [
    { key: 'bio', label: 'Bio (English)', value: profile.bio },
    { key: 'bioAr', label: 'Bio (Arabic)', value: profile.bioAr },
    { key: 'birthDate', label: 'Birth Date', value: profile.birthDate },
    { key: 'nationality', label: 'Nationality', value: profile.nationality },
    {
      key: 'languages',
      label: 'Languages',
      value: profile.languages?.length ? profile.languages : null,
    },
  ]

  // Physical Attributes (15% weight)
  const physicalFields = [
    {
      key: 'height',
      label: 'Height',
      value: profile.height?.value ? profile.height : null,
    },
    {
      key: 'weight',
      label: 'Weight',
      value: profile.weight?.value ? profile.weight : null,
    },
    {
      key: 'preferredFoot',
      label: 'Preferred Foot',
      value: profile.preferredFoot,
    },
  ]

  // Experience & Career (15% weight)
  const careerFields = [
    {
      key: 'yearsOfExperience',
      label: 'Years of Experience',
      value:
        profile.yearsOfExperience !== undefined &&
        profile.yearsOfExperience !== null
          ? profile.yearsOfExperience
          : null,
    },
    {
      key: 'currentClub',
      label: 'Current Club',
      value: profile.currentClub?.clubName,
    },
    {
      key: 'previousClubs',
      label: 'Previous Clubs',
      value: profile.previousClubs?.length ? profile.previousClubs : null,
    },
    {
      key: 'achievements',
      label: 'Achievements',
      value: profile.achievements?.length ? profile.achievements : null,
    },
  ]

  // Media & Showcase (10% weight)
  const mediaFields = [
    { key: 'avatar', label: 'Profile Picture', value: profile.avatar },
    { key: 'bannerImage', label: 'Banner Image', value: profile.bannerImage },
    {
      key: 'photos',
      label: 'Photos',
      value: profile.photos?.length ? profile.photos : null,
    },
    {
      key: 'videos',
      label: 'Videos',
      value: profile.videos?.length ? profile.videos : null,
    },
    {
      key: 'highlightVideoUrl',
      label: 'Highlight Video',
      value: profile.highlightVideoUrl,
    },
  ]

  // Additional Info (bonus fields - don't count towards 100%)
  const additionalFields = [
    { key: 'goals', label: 'Career Goals', value: profile.goals },
    {
      key: 'additionalSports',
      label: 'Additional Sports',
      value: profile.additionalSports?.length ? profile.additionalSports : null,
    },
    {
      key: 'socialMedia',
      label: 'Social Media',
      value:
        profile.socialMedia && Object.keys(profile.socialMedia).length > 0
          ? profile.socialMedia
          : null,
    },
    {
      key: 'certificates',
      label: 'Certificates',
      value: profile.certificates?.length ? profile.certificates : null,
    },
    {
      key: 'previousClubs',
      label: 'Previous Clubs',
      value: profile.previousClubs?.length ? profile.previousClubs : null,
    },
    {
      key: 'trainingAvailability',
      label: 'Training Availability',
      value: profile.trainingAvailability?.length
        ? profile.trainingAvailability
        : null,
    },
  ]

  // Calculate completion for each category
  const checkFields = (
    fields: Array<{ key: string; label: string; value: any }>
  ) => {
    fields.forEach((field) => {
      if (
        field.value !== undefined &&
        field.value !== null &&
        field.value !== ''
      ) {
        completedFields.push(field.label)
      } else {
        missingFields.push(field.label)
      }
    })
  }

  checkFields(coreFields)
  checkFields(personalFields)
  checkFields(physicalFields)
  checkFields(careerFields)
  checkFields(mediaFields)

  // Calculate weighted percentage
  const coreComplete = coreFields.filter(
    (f) => f.value !== undefined && f.value !== null && f.value !== ''
  ).length
  const coreTotal = coreFields.length
  const corePercentage = (coreComplete / coreTotal) * 40

  const personalComplete = personalFields.filter(
    (f) => f.value !== undefined && f.value !== null && f.value !== ''
  ).length
  const personalTotal = personalFields.length
  const personalPercentage = (personalComplete / personalTotal) * 20

  const physicalComplete = physicalFields.filter(
    (f) => f.value !== undefined && f.value !== null
  ).length
  const physicalTotal = physicalFields.length
  const physicalPercentage = (physicalComplete / physicalTotal) * 15

  const careerComplete = careerFields.filter(
    (f) => f.value !== undefined && f.value !== null && f.value !== ''
  ).length
  const careerTotal = careerFields.length
  const careerPercentage = (careerComplete / careerTotal) * 15

  const mediaComplete = mediaFields.filter(
    (f) => f.value !== undefined && f.value !== null && f.value !== ''
  ).length
  const mediaTotal = mediaFields.length
  const mediaPercentage = (mediaComplete / mediaTotal) * 10

  const totalPercentage = Math.round(
    corePercentage +
      personalPercentage +
      physicalPercentage +
      careerPercentage +
      mediaPercentage
  )

  const totalFields =
    coreFields.length +
    personalFields.length +
    physicalFields.length +
    careerFields.length +
    mediaFields.length
  const completedCount = completedFields.length

  return {
    percentage: totalPercentage,
    completedFields,
    missingFields,
    totalFields,
    completedCount,
  }
}

// Get profile completion details with category breakdown
export const getProfileCompletionBreakdown = (profile: PlayerProfile) => {
  const categories = {
    core: {
      name: 'Core Information',
      weight: 40,
      fields: [
        { label: 'Primary Sport', completed: !!profile.primarySport },
        { label: 'Position', completed: !!profile.position },
        { label: 'Level', completed: !!profile.level },
        { label: 'Status', completed: !!profile.status },
        { label: 'Country', completed: !!profile.location?.country },
        { label: 'City', completed: !!profile.location?.city },
      ],
    },
    personal: {
      name: 'Personal Details',
      weight: 20,
      fields: [
        { label: 'Bio (English)', completed: !!profile.bio },
        { label: 'Bio (Arabic)', completed: !!profile.bioAr },
        { label: 'Birth Date', completed: !!profile.birthDate },
        { label: 'Nationality', completed: !!profile.nationality },
        { label: 'Languages', completed: !!profile.languages?.length },
      ],
    },
    physical: {
      name: 'Physical Attributes',
      weight: 15,
      fields: [
        { label: 'Height', completed: !!profile.height?.value },
        { label: 'Weight', completed: !!profile.weight?.value },
        { label: 'Preferred Foot', completed: !!profile.preferredFoot },
      ],
    },
    career: {
      name: 'Experience & Career',
      weight: 15,
      fields: [
        {
          label: 'Years of Experience',
          completed:
            profile.yearsOfExperience !== undefined &&
            profile.yearsOfExperience !== null,
        },
        { label: 'Current Club', completed: !!profile.currentClub?.clubName },
        { label: 'Previous Clubs', completed: !!profile.previousClubs?.length },
        { label: 'Achievements', completed: !!profile.achievements?.length },
      ],
    },
    media: {
      name: 'Media & Showcase',
      weight: 10,
      fields: [
        { label: 'Profile Picture', completed: !!profile.avatar },
        { label: 'Banner Image', completed: !!profile.bannerImage },
        { label: 'Photos', completed: !!profile.photos?.length },
        { label: 'Videos', completed: !!profile.videos?.length },
        { label: 'Highlight Video', completed: !!profile.highlightVideoUrl },
      ],
    },
  }

  return Object.entries(categories).map(([key, category]) => {
    const completed = category.fields.filter((f) => f.completed).length
    const total = category.fields.length
    const percentage = Math.round((completed / total) * category.weight)

    return {
      key,
      name: category.name,
      weight: category.weight,
      completed,
      total,
      percentage,
      fields: category.fields,
    }
  })
}
