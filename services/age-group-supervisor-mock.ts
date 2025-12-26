import { Player, TrainingSession, Evaluation, MedicalRecord, Alert, TeamStats } from '@/types/age-group-supervisor';

// Mock Data
const PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Ahmed Ali',
    dob: '2008-05-12',
    ageGroup: 'U16',
    position: 'Forward',
    height: 175,
    weight: 65,
    contractExpiry: '2025-06-30',
    documents: { passport: true, federationCard: true },
    attendanceRate: 95,
    status: 'active',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed'
  },
  {
    id: '2',
    name: 'Mohammed Sami',
    dob: '2008-08-20',
    ageGroup: 'U16',
    position: 'Midfielder',
    height: 170,
    weight: 62,
    contractExpiry: '2024-12-31',
    documents: { passport: true, federationCard: false },
    attendanceRate: 88,
    status: 'injured',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed'
  },
  {
    id: '3',
    name: 'Youssef Omar',
    dob: '2009-02-15',
    ageGroup: 'U15',
    position: 'Goalkeeper',
    height: 180,
    weight: 70,
    contractExpiry: '2026-06-30',
    documents: { passport: true, federationCard: true },
    attendanceRate: 98,
    status: 'active',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef'
  }
];

const TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: '1',
    date: '2024-10-25',
    type: 'tactical',
    focus: 'Defensive Organization',
    coachId: 'c1',
    coachName: 'Coach Hassan',
    attendanceCount: 22,
    status: 'completed',
    notes: 'Good intensity, need work on transition.'
  },
  {
    id: '2',
    date: '2024-10-26',
    type: 'physical',
    focus: 'Endurance',
    coachId: 'c1',
    coachName: 'Coach Hassan',
    attendanceCount: 0,
    status: 'planned'
  }
];

const EVALUATIONS: Evaluation[] = [
  {
    id: '1',
    playerId: '1',
    date: '2024-10-01',
    metrics: { technical: 8, tactical: 7, physical: 8, mental: 6, social: 9 },
    comments: 'Improving steadily.',
    evaluatorId: 'sup1'
  }
];

const MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: '1',
    playerId: '2',
    type: 'injury',
    description: 'Ankle sprain',
    severity: 'medium',
    status: 'active',
    dateReported: '2024-10-20',
    expectedReturnDate: '2024-11-05'
  }
];

const ALERTS: Alert[] = [
  {
    id: '1',
    type: 'injury',
    message: 'Mohammed Sami reported an ankle injury.',
    severity: 'warning',
    date: '2024-10-20',
    read: false,
    relatedEntityId: '2'
  },
  {
    id: '2',
    type: 'contract_expiry',
    message: 'Mohammed Sami contract expires in 2 months.',
    severity: 'info',
    date: '2024-10-22',
    read: false,
    relatedEntityId: '2'
  }
];

class AgeGroupSupervisorMockService {
  async getPlayers(): Promise<Player[]> {
    return new Promise(resolve => setTimeout(() => resolve(PLAYERS), 500));
  }

  async getTrainingSessions(): Promise<TrainingSession[]> {
    return new Promise(resolve => setTimeout(() => resolve(TRAINING_SESSIONS), 500));
  }

  async getEvaluations(playerId: string): Promise<Evaluation[]> {
    return new Promise(resolve => setTimeout(() => resolve(EVALUATIONS.filter(e => e.playerId === playerId)), 500));
  }

  async getMedicalRecords(): Promise<MedicalRecord[]> {
    return new Promise(resolve => setTimeout(() => resolve(MEDICAL_RECORDS), 500));
  }

  async getAlerts(): Promise<Alert[]> {
    return new Promise(resolve => setTimeout(() => resolve(ALERTS), 500));
  }

  async getStats(): Promise<TeamStats> {
    return new Promise(resolve => setTimeout(() => resolve({
      totalPlayers: PLAYERS.length,
      injuredCount: PLAYERS.filter(p => p.status === 'injured').length,
      avgAttendance: 92,
      upcomingMatches: 3
    }), 500));
  }
}

export const ageGroupSupervisorMockService = new AgeGroupSupervisorMockService();
