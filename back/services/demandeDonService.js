const DemandeDon = require('../models/demandeDon');

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
}

module.exports = new DemandeDonService();
