// services/googleSheetService.js - VERSION AVEC DÉTECTION AUTOMATIQUE
const { google } = require("googleapis");

async function lireSheet(spreadsheetId) {
  try {
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

    const rows = res.data.values || [];
    if (rows.length === 0) return [];

    console.log("=== STRUCTURE COMPLÈTE DU SHEET ===");
    rows.forEach((row, index) => {
      console.log(`Ligne ${index + 1}:`, row);
    });

    // DÉTECTION AUTOMATIQUE DES COLONNES
    const { nomIndex, emailIndex, clubIndex, startDataIndex } = detecterStructure(rows);
    
    console.log("Structure détectée:", { nomIndex, emailIndex, clubIndex, startDataIndex });

    const data = [];
    
    // Parcourir les données à partir de l'index détecté
    for (let i = startDataIndex; i < rows.length; i++) {
      const row = rows[i];
      
      if (row && row.length > Math.max(emailIndex, nomIndex)) {
        const nom = nomIndex !== -1 && row[nomIndex] ? row[nomIndex].toString().trim() : "Non spécifié";
        const emailRaw = emailIndex !== -1 && row[emailIndex] ? row[emailIndex].toString().trim() : "";
        const club = clubIndex !== -1 && row[clubIndex] ? row[clubIndex].toString().trim() : "Non spécifié";
        
        // Corriger les emails (remplacer , par .)
        const email = emailRaw.replace(/,/g, '.');
        
        console.log(`Ligne ${i + 1} - Nom: ${nom}, Email: ${email}, Club: ${club}`);
        
        // Vérifier que l'email est valide
        if (email && estEmailValide(email)) {
          data.push({ nom, email, club });
          console.log(`✅ Étudiant valide: ${nom} - ${email} - ${club}`);
        } else {
          console.log(`❌ Email invalide: ${email}`);
        }
      }
    }

    console.log(`=== RÉSULTAT FINAL: ${data.length} étudiants chargés ===`);
    return data;

  } catch (err) {
    console.error("Erreur Google Sheets:", err.message);
    throw err;
  }
}

// Fonction pour détecter automatiquement la structure
function detecterStructure(rows) {
  if (rows.length < 2) {
    return { nomIndex: -1, emailIndex: -1, clubIndex: -1, startDataIndex: 0 };
  }

  // Chercher la ligne qui contient les labels (Nom, Email, Club)
  let labelsRowIndex = -1;
  let labelsRow = [];

  for (let i = 0; i < Math.min(3, rows.length); i++) {
    const row = rows[i];
    if (row && row.some(cell => 
      cell && typeof cell === 'string' && 
      (cell.toLowerCase().includes('nom') || 
       cell.toLowerCase().includes('email') || 
       cell.toLowerCase().includes('club'))
    )) {
      labelsRowIndex = i;
      labelsRow = row;
      break;
    }
  }

  // Si on ne trouve pas de labels, utiliser la première ligne
  if (labelsRowIndex === -1) {
    labelsRowIndex = 0;
    labelsRow = rows[0];
  }

  console.log("Ligne des labels détectée:", { ligne: labelsRowIndex + 1, labels: labelsRow });

  // Trouver les index des colonnes
  const nomIndex = trouverIndexColonne(labelsRow, ['nom', 'name', 'prénom', 'prenom']);
  const emailIndex = trouverIndexColonne(labelsRow, ['email', 'mail', 'courriel', 'e-mail']);
  const clubIndex = trouverIndexColonne(labelsRow, ['club', 'groupe', 'association', 'groupe club']);

  // Si on ne trouve pas d'email, chercher une colonne qui contient des emails
  let finalEmailIndex = emailIndex;
  if (finalEmailIndex === -1) {
    finalEmailIndex = trouverColonneAvecEmails(rows, labelsRowIndex);
  }

  // Déterminer où commencent les données (après la ligne des labels)
  const startDataIndex = labelsRowIndex + 1;

  return {
    nomIndex: nomIndex !== -1 ? nomIndex : 0, // Fallback à la colonne A
    emailIndex: finalEmailIndex !== -1 ? finalEmailIndex : 1, // Fallback à la colonne B
    clubIndex: clubIndex !== -1 ? clubIndex : 2, // Fallback à la colonne C
    startDataIndex
  };
}

// Fonction pour trouver l'index d'une colonne par ses noms possibles
function trouverIndexColonne(labels, nomsPossibles) {
  for (let nom of nomsPossibles) {
    const index = labels.findIndex(label => 
      label && label.toString().toLowerCase().includes(nom.toLowerCase())
    );
    if (index !== -1) return index;
  }
  return -1;
}

// Fonction pour détecter automatiquement la colonne email en cherchant des adresses email
function trouverColonneAvecEmails(rows, labelsRowIndex) {
  // Analyser les premières lignes de données pour trouver une colonne avec des emails
  const start = labelsRowIndex + 1;
  const end = Math.min(start + 5, rows.length); // Analyser les 5 premières lignes de données
  
  const compteurEmails = {};
  
  for (let i = start; i < end; i++) {
    const row = rows[i];
    if (row) {
      for (let j = 0; j < row.length; j++) {
        const valeur = row[j] ? row[j].toString().trim() : '';
        if (estEmailValide(valeur)) {
          compteurEmails[j] = (compteurEmails[j] || 0) + 1;
        }
      }
    }
  }
  
  // Trouver la colonne avec le plus d'emails valides
  let meilleureColonne = -1;
  let maxEmails = 0;
  
  for (const [colonne, count] of Object.entries(compteurEmails)) {
    if (count > maxEmails) {
      maxEmails = count;
      meilleureColonne = parseInt(colonne);
    }
  }
  
  if (meilleureColonne !== -1) {
    console.log(`Colonne email détectée automatiquement: colonne ${meilleureColonne} (${maxEmails} emails valides trouvés)`);
  }
  
  return meilleureColonne;
}

// Fonction pour valider les emails
function estEmailValide(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = { lireSheet };