export class Reclamation {
  constructor(
    public id: string,
    public etudiant: {
      id: string;
      lastName: string;
      firstName: string;
      email: string;
    },
    public sujet: string,
    public description: string,
    public statut: 'Nouvelle' | 'En cours' | 'Résolue' | 'Rejetée',
    public dateCreation: Date
  ) {}
}
