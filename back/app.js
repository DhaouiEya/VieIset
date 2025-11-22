require('dotenv').config(); // Charge les variables d'environnement
const express = require('express');
const mongoose = require("mongoose");
const { errorMiddleware } = require('./middlewares/errorHandler');
const cors = require('cors'); //pour gérer les requêtes cross-origin (CORS)
const bodyParser = require('body-parser');
const helmet = require('helmet');// Security middleware to set various HTTP headers
const path = require('path'); //trouver le bon chemin de fichier

const routes = require('./routes');
const fs = require('fs');

const app = express();

// Middleware pour parser les requêtes JSON

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static('public'))
// Configuration CORS
const corsOptions = {
  origin: '*', // mettre l’URL du front Angular en prod
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
//
app.use(bodyParser.json());

// Sécurité avec Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false, // autorise l’accès aux ressources statiques (images, vidéos, etc.)
  })
);

// Servir les fichiers statiques (images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// SERVIR LE DOSSIER annexes
app.use('/annexes', express.static(path.join(__dirname, 'uploads/annexes')));
app.get('/annexes/:filename', (req, res) => {
  const filename = req.params.filename;
  const basePath = path.join(__dirname, 'uploads/annexes');

  // Liste toutes les extensions courantes
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];
  let found = false;

  for (const ext of extensions) {
    const fullPath = path.join(basePath, filename.replace(/\.[^.]+$/, '') + ext);
    if (fs.existsSync(fullPath)) {
      return res.sendFile(fullPath);
    }
  }

  // Si rien trouvé → 404 classique
  res.status(404).send('Fichier non trouvé');
});
app.use('/api', routes);
// Utilisez les routes

// Middleware global pour gérer les erreurs
app.use(errorMiddleware);


// Connexion MongoDB + démarrage du serveur

const PORT =  9000;
// console.log("MONGO_URL:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

module.exports = app;
