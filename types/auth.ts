export type UserRole =
  | 'player'
  | 'coach'
  | 'club'
  | 'specialist'
  | 'administrator'
  | 'age-group-supervisor'
  | 'sports-director'
  | 'executive-director'
  | 'secretary'
  | 'sports-administrator'
  | 'team'
  | 'leader';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  phone?: string;
  avatar?: string;

  // Optional specific fields that were scattered across different files
  permissions?: string[];
  accessKey?: string;

  // Club specific
  organizationName?: string;
  organizationType?: 'club' | 'academy' | 'federation' | 'sports-center';
  establishedDate?: string;
  businessRegistrationNumber?: string;

  // Admin specific
  department?: string;
  position?: string;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  requiresVerification?: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  status?: number;
}
