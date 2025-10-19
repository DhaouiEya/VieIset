// src/app/models/etudiant.model.ts

export interface Volunteering {
  organization?: string;
  role?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface Certification {
  title: string;
  institution?: string;
  description?: string;
  issueDate?: Date;
  expiryDate?: Date;
  documentURL?: string;
}

export interface UserModel {
  _id?: string; // MongoDB id

  email: string;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  cin?: string;
  firstName: string;
  lastName: string;
  gender?: 'Homme' | 'Femme';
  age?: number;
  phone?: string;
  city?: string;
  postalCode?: string;
  address?: string;

  department?: 'Technology' | 'Management';
  niveau?: 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
  speciality?: 'DSI' | 'RSI' | 'IOT' | 'MAF' | 'LET' | 'MIN' | 'QHSE' | 'CO-CMI';
  classe?: string;

  hobbies?: string[];
  skills?: string[];

  volunteering?: Volunteering[];
  certifications?: Certification[];

  linkedin?: string;
  github?: string;

  allergies?: string[];
  accessibilityNeeds?: string;

  isActive?: boolean;
  isOnline?: boolean;

  googleId?: string;
  refreshToken?: string;
  lastLogin?: Date;

  preRegistered?: boolean;
  role?: 'membre' | 'admin' | 'clubManager';

    authToken: string;

  createdAt?: Date;
  updatedAt?: Date;
}
