/**
 * Vérifie si des champs requis sont manquants ou vides dans un objet.
 * @param {Object} data - Données à valider (ex: req.body)
 * @param {Array<string>} fields - Liste des noms de champs requis
 * @returns {null|Object} - null si tout est ok, sinon un objet d’erreurs par champ
 */
function validateRequiredFields(data, fields) {
  const errors = {};

  for (const field of fields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field].toString().trim() === ''
    ) {
      errors[field] = `Le champ '${field}' est obligatoire.`;
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

module.exports = {
  validateRequiredFields
};
