require('dotenv').config(); // Charge les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const { errorMiddleware } = require('./middlewares/errorHandler');
const cors = require('cors'); //pour gérer les requêtes cross-origin (CORS)
const helmet = require('helmet');// Security middleware to set various HTTP headers
const path = require('path'); //trouver le bon chemin de fichier

const routes = require('./routes');

const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuration CORS
const corsOptions = {
  origin: '*', // mettre l’URL du front Angular en prod
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Sécurité avec Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false, // autorise l’accès aux ressources statiques (images, vidéos, etc.)
  })
);

// Servir les fichiers statiques (images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);


// Middleware global pour gérer les erreurs
app.use(errorMiddleware);


// Connexion MongoDB + démarrage du serveur
const PORT = process.env.PORT || 9001;
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
