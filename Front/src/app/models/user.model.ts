// src/app/models/etudiant.model.ts


export interface UserModel {
  _id?: string;

  email: string;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  firstName: string;
  lastName: string;

  adresse?: string;
  ville?: string;

  photoProfil?: string;          // default: 'blank.png'
  dateNaissance?: Date;
  numeroTelephone?: string;

  filiere?: string;              // Informatique, Gestion, Génie Civil, ...
  specialite?: string;           // Développement Web, Réseaux, IA, ...
  niveau?: string;               // L1, L2, L3, M1, M2
  classe?: string;               // 2ème année B, Groupe 3, …

  isActive?: boolean;
  isOnline?: boolean;

  googleId?: string;

  authProvider?: 'local' | 'google' | 'both';

  refreshToken?: string;
  lastLogin?: Date;
  profileCompletion?: number;

  preRegistered?: boolean;

  role?: ('etudiant' | 'clubManager' | 'admin')[];

  authToken?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
