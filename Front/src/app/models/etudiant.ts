
export class Etudiant {
  _id?: string;                     // MongoDB ObjectId
  email!: string;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  cin?: string;
  firstName!: string;
  lastName!: string;
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
  motivation?: string;
  strengths?: string[];
  weaknesses?: string[];
  preferences?: string[];

  languages?: ('Français' | 'Anglais' | 'Espagnol' | 'Allemand' | 'Italien' | 'Chinois' | 'Arabe' | 'Russe' | 'Japonais' | 'Turc' | 'Coréen' | 'Autre')[];

  //volunteering?: Volunteering[];
 // certifications?: Certification[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  allergies?: string[];
  accessibilityNeeds?: string;

  isActive?: boolean;
  isOnline?: boolean;

  googleId?: string;
  refreshToken?: string;
  lastLogin?: Date;

  role?: 'etudiant' | 'membre' | 'clubManger' | 'admin';

//  createdAt?: Date;
 // updatedAt?: Date;
}