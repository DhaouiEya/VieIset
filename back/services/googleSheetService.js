
const { google } = require("googleapis");
const Etudiant = require("../models/etudiant");       // ton modèle étudiant
const Club = require("../models/club");               // ton modèle club
const DemandeAdhesion = require("../models/demandeAdhesion"); // modèle demande



// Lire Google Sheet et créer les demandes automatiquement
async function lireSheet(spreadsheetId) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "A1:Z1000",
  });

let rows = res.data.values || [];  // <--- changer const -> let
console.log("Nombre de lignes lues (avant suppression titres):", rows.length);
console.log("Premières lignes:", rows.slice(0, 5));

const headerIndex = rows.findIndex(r => r.some(cell => cell.toString().toLowerCase() === 'nom'));
if (headerIndex !== -1) {
  rows = rows.slice(headerIndex + 1); // maintenant c'est ok, rows est un let
}

console.log("Nombre de lignes lues (après suppression titres):", rows.length);
console.log("Premières lignes:", rows.slice(0, 5));

return rows;

}


function estEmailValide(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function nettoyerTexte(str) {
  return (str || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // caractères invisibles
    .replace(/\n/g, '')                     // retour à la ligne
    .trim();
}

// Traiter les lignes et créer les demandes

async function traiterSheet(rows) {
  console.log("rows asser a traitement:", rows);
  if (!rows) {
    console.log("Sheet vide ou sans données.");
    return [];
  }

  // On suppose que la première ligne contient les titres
 
  const emailIndex = 1;
  const clubIndex = 2;
  const demandesCreees = [];

  // Parcours des lignes à partir de la deuxième (après les titres)
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    console.log("Traitement de la ligne:", row[i]);
    const email = nettoyerTexte(row[emailIndex]);
    const clubName = nettoyerTexte(row[clubIndex]);
    console.log(` Email: '${email}', Club: '${clubName}'`);
 
    // Chercher étudiant et club dans MongoDB
    const etudiant = await Etudiant.findOne({ email });
    if (!etudiant) {
      console.log(`Étudiant non trouvé pour l'email: '${email}'`);
      continue;

    }

    const club = await Club.findOne({ nom: new RegExp(`^${clubName}$`, 'i') });
    if (!club) {
      console.log(`Club non trouvé: '${clubName}'`);
      continue;
    }

    // Vérifier si la demande existe déjà
    const exist = await DemandeAdhesion.findOne({ etudiant: etudiant._id, club: club._id });
    if (exist) {
      console.log(`Demande déjà existante pour '${email}' et '${clubName}'`);
      continue;
    }
console.log("club id etudiant id:", club._id, etudiant._id);  
    // Créer et sauvegarder la demande
    const demande = new DemandeAdhesion({
      etudiant: etudiant._id,
      club: club._id,
      dateDemande: new Date(),
    });
console.log("Nouvelle demande créée:", demande);
    await demande.save();
    demandesCreees.push(demande);
    console.log(`Demande créée pour '${email}' au club '${clubName}'`);
  }
  const demandesAvecPopulate = await DemandeAdhesion.find({
  _id: { $in: demandesCreees.map((d) => d._id) },
})
  .populate({
    path: "etudiant",
    select: "email lastName firstName",
  })
  .populate({
    path: "club",
    select: "nom",
  })
  //  ici, on s'assure que tous les champs internes sont présents
  .select("statut dateDemande datesProposees dateChoisie createdAt updatedAt");

console.log("📦 Demandes avec populate:", demandesAvecPopulate);
return demandesAvecPopulate;
}

module.exports = { lireSheet, traiterSheet, estEmailValide };