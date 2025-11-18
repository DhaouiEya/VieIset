import { Etudiant } from "./etudiant";
import { Club } from "./club";
export class DemandeAdhesion {
        etudiant!: Etudiant; // <-- ici
        club!: Club;    
        statut!: 'en attente' | 'en cours' | 'acceptée' | 'refusée'; // valeurs autorisées
        dateDemande!: Date;
        datesProposees!: Date[];
        dateChoisie?: Date; 
        _id?: string; 
}
