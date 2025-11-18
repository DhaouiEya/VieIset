export interface Participation {
  _id?: string;
  etudiant: string;   // l'id de l'étudiant
  event: string;      // l'id de l'événement
  dateInscription?: Date;
}
