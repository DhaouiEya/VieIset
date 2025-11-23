//const Etudiant = require('../models/etudiant');
const Reclamation = require('../models/reclamation');
const User = require('../models/user');


const createReclamation = async (req, res) => {
try {
const { userId, sujet, description } = req.body;
// const user = await User.findById(userId);
// console.log(user);

// if (!user) {
//   return res.status(403).json({ message: 'Seuls les étudiants peuvent créer des réclamations' });
// }

const reclamation = new Reclamation({
  etudiant: userId, 
  sujet,
  description
});

await reclamation.save();
res.status(201).json(reclamation);


} catch (error) {
res.status(500).json({ message: 'Erreur serveur', error });
}
};


const getAllReclamations = async (req, res) => {
  try {
  
    const reclamations = await Reclamation.find().populate('etudiant', 'lastName firstName email');
    console.log(reclamations);
    res.status(200).json(reclamations);

  } catch (error) {
   res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// Récupérer les réclamations par ID d'étudiant (l’étudiant peut voir ses propres réclamations)
const getReclamationsByUserId = async (req, res) => {
try {
const { userId } = req.params;

// const user = await User.findById(userId);

// if (!user) {
//   return res.status(404).json({ message: 'Utilisateur étudiant non trouvé' });
// }

const reclamations = await Reclamation.find({ etudiant: userId });
res.status(200).json(reclamations);


} catch (error) {
res.status(500).json({ message: 'Erreur serveur', error });
}
};


const updateReclamationStatus = async (req, res) => {
try {
const { reclamationId } = req.params;
const { statut } = req.body;


//const adminUser = await User.findById(req.userId); 
//   return res.status(403).json({ message: 'Accès refusé : admin uniquement' });
// }

const reclamation = await Reclamation.findById(reclamationId);
if (!reclamation) {
  return res.status(404).json({ message: 'Réclamation non trouvée' });
}

reclamation.statut = statut;
await reclamation.save();

res.status(200).json({
  success: true,
  message: 'Statut de la réclamation mis à jour',
  reclamation
});

} catch (error) {
res.status(500).json({ message: 'Erreur serveur', error });
}
};

module.exports = {
createReclamation,
getAllReclamations,
getReclamationsByUserId,
updateReclamationStatus
};

