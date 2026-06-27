export interface License {
  number: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  club: string;
  clubNumber: string;
  category: string; // S1, S2, S3, C, J, B, M, P, SH
  gender: string; // H, F
  weapon: string; // CL, CO, BB, AD, AC, TL
  season: string; // 2025-2026
  validUntil: string;
  photo?: string;
  medicalCertificateDate?: string;
}
