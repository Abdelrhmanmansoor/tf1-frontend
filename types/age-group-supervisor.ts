export interface Player {
  id: string;
  name: string;
  dob: string;
  ageGroup: string;
  position: string;
  height: number;
  weight: number;
  contractExpiry: string;
  documents: {
    passport: boolean;
    federationCard: boolean;
  };
  attendanceRate: number; // percentage
  status: 'active' | 'injured' | 'suspended';
  imageUrl?: string;
}

export interface TrainingSession {
  id: string;
  date: string;
  type: 'tactical' | 'physical' | 'technical' | 'recovery';
  focus: string;
  coachId: string;
  coachName: string;
  attendanceCount: number;
  status: 'planned' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Evaluation {
  id: string;
  playerId: string;
  date: string;
  metrics: {
    technical: number;
    tactical: number;
    physical: number;
    mental: number;
    social: number;
  };
  comments: string;
  evaluatorId: string;
}

export interface MedicalRecord {
  id: string;
  playerId: string;
  type: 'injury' | 'illness' | 'checkup';
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'recovered' | 'rehab';
  dateReported: string;
  expectedReturnDate?: string;
}

export interface Alert {
  id: string;
  type: 'performance_drop' | 'contract_expiry' | 'high_absence' | 'injury';
  message: string;
  severity: 'warning' | 'critical' | 'info';
  date: string;
  read: boolean;
  relatedEntityId?: string; // playerId, etc.
}

export interface TeamStats {
  totalPlayers: number;
  injuredCount: number;
  avgAttendance: number;
  upcomingMatches: number;
}
