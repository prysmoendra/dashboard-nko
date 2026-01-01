// src/features/profile/types.ts

// Ini adalah "cetakan" data. Kita memberitahu komputer bahwa
// data profil PASTI memiliki nama, email, role, dsb.
export interface UserProfileData {
  fullName: string;
  email: string;
  avatarInitial: string;
  role: string;
  unit: string;
  department: string;
  accountCreatedAt: string;
  accessLevel: string;
  totalDashboards: number;
}