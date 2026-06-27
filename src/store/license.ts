import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { License } from '@/types/license';

interface LicenseState {
  license: License;
  setLicense: (data: Partial<License>) => void;
}

export const useLicenseStore = create<LicenseState>()(
  persist(
    (set) => ({
      license: {
        number: '0895423',
        firstName: 'Grégory',
        lastName: 'DJERRADINE',
        birthDate: '1990-01-01',
        club: 'Compagnie d\'Arc',
        clubNumber: '0891234',
        category: 'S1',
        gender: 'H',
        weapon: 'CL',
        season: '2025-2026',
        validUntil: '2026-09-30',
        medicalCertificateDate: '2025-09-15',
      },
      setLicense: (data) => set((s) => ({ license: { ...s.license, ...data } })),
    }),
    {
      name: 'claude-arc-license',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
