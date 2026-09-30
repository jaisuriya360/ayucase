import type { PhysicianProfile } from '../types/physician'

export const MOCK_PHYSICIANS: Record<string, PhysicianProfile> = {
  'demo-md-1': {
    id: 'demo-md-1',
    fictionalId: 'MD-LIC-4412',
    name: 'Dr. Elena Vance, MD',
    title: 'Senior Consultant Neurologist & Integrative Medicine',
    specialty: 'Neurology & Neurovascular Medicine',
    hospitalAffiliation: 'AyuCare Clinical Academic Health Sciences Center',
    registrationNumber: 'MCI-REG-84920-A',
    activeCasesCount: 14,
    pendingReviewsCount: 3,
    email: 'elena.vance@ayucare.clinic',
  },
  'demo-md-2': {
    id: 'demo-md-2',
    fictionalId: 'MD-LIC-1089',
    name: 'Dr. Ramesh K., MD, FRCP',
    title: 'Head of Internal Medicine & Clinical Triage',
    specialty: 'Internal Medicine & Multi-morbidity Care',
    hospitalAffiliation: 'AyuCare Metropolitan Memorial Hospital',
    registrationNumber: 'MCI-REG-39104-K',
    activeCasesCount: 22,
    pendingReviewsCount: 6,
    email: 'ramesh.k@ayucare.clinic',
  },
}

export const DEFAULT_PHYSICIAN = MOCK_PHYSICIANS['demo-md-1']
