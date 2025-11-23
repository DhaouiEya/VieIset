export interface DemandeDon {
  _id: string;
  title: string;
  description: string;
  montant: number;
  dateDemande: string;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';
  createdBy: {
    nom: string;
    prenom: string;
    email: string;
  };
  annexe?: string; // URL ou chemin du fichier
  createdAt?: string;
  updatedAt?: string;
}
