const DemandeDon = require('../models/demandeDon');
const User = require('../models/User');


class DemandeDonService {
  
  // Créer une demande
  async createDemande(data) {
    const demande = new DemandeDon(data);
    return await demande.save();
  }

  // Récupérer toutes les demandes (admin)
  async getAllDemandes() {
    return await DemandeDon.find().populate('createdBy', 'name email');
  }

  // Récupérer les demandes d'un membre
  async getMyDemandes(userId) {
    return await DemandeDon.find({ createdBy: userId }).populate('createdBy', 'name email');
  }

  // Mettre à jour le statut d'une demande
  async updateStatut(id, statut) {
    const validStatuts = ['EN_ATTENTE', 'ACCEPTEE', 'REFUSEE'];
    if (!validStatuts.includes(statut)) {
      throw new Error('Statut invalide');
    }
    return await DemandeDon.findByIdAndUpdate(id, { statut }, { new: true });
  }

  // Mettre à jour une demande (titre, description, montant)
  async updateDemande(id, data) {
    return await DemandeDon.findByIdAndUpdate(id, data, { new: true });
  }

  // Supprimer une demande
  async deleteDemande(id) {
    return await DemandeDon.findByIdAndDelete(id);
  }

  // Récupérer une demande par ID
  async getDemandeById(id) {
    return await DemandeDon.findById(id).populate('createdBy', 'name email');
  }

async getEtudiantsAyantDemande() {
  try {
    // 1. Récupérer les createdBy (ObjectId) depuis les demandes
    const demandes = await DemandeDon.find({}, { createdBy: 1 }).lean();

    if (!demandes || demandes.length === 0) {
      console.log("Aucune demande de don trouvée");
      return [];
    }

    // 2. Extraire les IDs uniques (garder les ObjectId)
    const etudiantIds = [...new Set(
      demandes
        .map(d => d.createdBy)
        .filter(Boolean)
    )];

    console.log('IDs étudiants récupérés (ObjectId) →', etudiantIds);

    if (etudiantIds.length === 0) {
      return [];
    }

    // 3. Chercher les utilisateurs correspondants ⚠️ User avec majuscule
    const etudiants = await User.find(
      { _id: { $in: etudiantIds } },
      { password: 0 } // exclure le mot de passe
    ).lean();

    console.log(`✅ ${etudiants.length} étudiant(s) trouvé(s)`);

    return etudiants;

  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error.message);
    throw error;
  }
}
}


module.exports = new DemandeDonService();
