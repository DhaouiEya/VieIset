import { Etudiant } from './etudiant';

export class Club {
                 
  nom!: string;
  description!: string;
  imageProfil!: string;
  imageFond!: string;
  dateCreation!: Date;
  departement?: string;
  adresse!: string;
  telephone!: string;
  email!: string;
  reseaux?: {
    facebook?: string;
    instagram?: string;
  };
  manager!: Etudiant | string;            // référence à un étudiant
  membres?: Etudiant[];
   _id?: string;           // tableau d'étudiants
 // createdAt?: Date;
 // updatedAt?: Date;
}
