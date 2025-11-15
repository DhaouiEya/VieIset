
const DemandeAdhesion = require("../models/demandeAdhesion");
const { sendEmailDate } = require('../services/emailService');
const BACKEND_BASE = process.env.BACKEND_BASE;


// POST /api/demandes/:id/envoyer-dates
exports.createDemande = async (req, res) => {
  try {
    const { etudiant, club } = req.body;
    if (!etudiant || !club) {
      return res.status(400).json({ message: "Employé et formation sont requis." });
    }

    const demande = new DemandeAdhesion({
      etudiant,
      club,
      dateDemande: new Date(),
      statut: "en attente",
    });

    await demande.save();
    res.status(201).json(demande);
  } catch (error) {
    console.error("Erreur lors de la création de la demande :", error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
exports.envoyerDates = async (req, res)=> {
    try {
      
        const { id } = req.params;
        const { dates } = req.body; // attend un tableau de strings ISO

        if (!dates || !Array.isArray(dates) || dates.length === 0) {
            return res.status(400).json({ message: 'dates manquantes (array).' });
        }

        const demande = await DemandeAdhesion.findById(id).populate('etudiant').populate('club');
        if (!demande) return res.status(404).json({ message: 'Demande non trouvée.' });

        // enregistrer les dates proposées et changer le statut
        demande.datesProposees = dates.map(d => new Date(d));
        demande.statut = 'en cours';
        await demande.save();

        // construire les liens simples (GET). Utilise BACKEND_BASE pour pointer directement vers l'API.
        const liens = demande.datesProposees.map(d => {
            const iso = d.toISOString();
            // endpoint pour que l'etudiant clique. On utilisera GET pour tester facilement.
            return `${BACKEND_BASE}/api/demandeAdhesion/demandes/${demande._id}/choisir-date?date=${encodeURIComponent(iso)}`;

        });

        // créer HTML simple pour l'email
        const liensHTML = liens.map(l => `<li><a href="${l}">${new Date(decodeURIComponent(l.split('=')[1])).toLocaleString()}</a></li>`).join('');
        const html = `
            <p>Bonjour ${demande.etudiant && demande.etudiant.nom ? demande.etudiant.nom : 'Étudiant'},</p>
            <p>Le responsable du club <b>${demande.club && demande.club.nom ? demande.club.nom : 'le club'}</b> vous propose plusieurs créneaux. Cliquez sur celui que vous souhaitez :</p>
            <ul>
               ${liensHTML}
            </ul>
           
            <p>Si le lien ne fonctionne pas, copiez-collez cette URL dans votre navigateur.</p>
        `;

        // envoi d'email via votre service central
        await sendEmailDate({
            to: demande.etudiant.email,
            subject: `Choix de date pour votre adhésion au club ${demande.club.nom || ''}`,
            html
        });

        return res.json({ message: 'Email envoyé et statut mis à jour en "en cours".', demande });
    } catch (err) {
        console.error('envoyerDates error:', err);
        return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
    }
}


exports.getDatesChoisies = async (req, res) => {
  try {
    const { id } = req.params;
    const dateStr = req.query.date;
    if (!dateStr) return res.status(400).send('Paramètre date manquant.');

    const demande = await DemandeAdhesion.findById(id).populate('etudiant').populate('club');
    if (!demande) return res.status(404).send('Demande non trouvée.');

    const chosen = new Date(dateStr);
    const found = demande.datesProposees.some(
      d => new Date(d).toISOString() === chosen.toISOString()
    );
    if (!found) return res.status(400).send('La date choisie ne fait pas partie des dates proposées.');

    demande.dateChoisie = chosen;
    demande.statut = 'acceptée';
    await demande.save();

    // Redirection vers page HTML
    return res.redirect('/confirmationDate.html');

  } catch (err) {
    console.error('choisirDate error:', err);
    return res.status(500).send('Erreur serveur.');
  }
};



exports.getDemandesAdhesion = async (req, res) => {
     try {
        const demandes = await DemandeAdhesion.find()
            .populate('etudiant')
            .populate('club')
            .sort({ createdAt: -1 });
        return res.json(demandes);
    } catch (err) {
        console.error('listerDemandes error:', err);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
}
