const demandeDonService = require('../services/demandeDonService');
const mongoose = require('mongoose');
class DemandeDonController {

  // Créer une demande
async createDemande(req, res) {
  try {
    // Debug : voir ce que tu reçois
    console.log('req.body →', req.body);
    console.log('req.file →', req.file);

    // Validation basique
    if (!req.body.title || !req.body.description || !req.body.montant) {
      return res.status(400).json({ message: 'title, description et montant sont requis' });
    }
  const etudiantId = new mongoose.Types.ObjectId(req.user._id);
    const data = {
      title: req.body.title,
      description: req.body.description,
      montant: Number(req.body.montant), // ← très important
      annexe: req.file ? req.file.filename : undefined , // ← nom du fichier sauvegardé
      createdBy: etudiantId
    };

    const demande = await demandeDonService.createDemande(data);
    res.status(201).json(demande);

  } catch (error) {
    console.error('Erreur création demande:', error);
    res.status(400).json({ message: error.message });
  }
}

  // Récupérer toutes les demandes
  async getAllDemandes(req, res) {
    try {
      const demandes = await demandeDonService.getAllDemandes();
      res.json(demandes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Récupérer mes demandes
  async getMyDemandes(req, res) {
    try {
      const demandes = await demandeDonService.getMyDemandes(req.user._id);
      res.json(demandes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Mettre à jour le statut
  async updateStatut(req, res) {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      const updated = await demandeDonService.updateStatut(id, statut);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Mettre à jour une demande
  async updateDemande(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await demandeDonService.updateDemande(id, data);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Supprimer une demande
  async deleteDemande(req, res) {
    try {
      const { id } = req.params;
      await demandeDonService.deleteDemande(id);
      res.json({ message: 'Demande supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Récupérer les étudiants ayant envoyé une demande
async getEtudiantsAyantDemande(req, res) {
  try {
    const etudiants = await demandeDonService.getEtudiantsAyantDemande();
    res.json(etudiants);
  } catch (error) {
    console.error('Erreur récupération étudiants:', error);
    res.status(500).json({ message: error.message });
  }
}

}

module.exports = new DemandeDonController();
