require('dotenv').config(); // Charge les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const clubRoutes = require('./routes/clubRoutes'); // routes spécifiques club
const { errorMiddleware } = require('./middlewares/errorHandler');

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


app.use('/api/clubs', clubRoutes);

// Middleware global pour gérer les erreurs
app.use(errorMiddleware);


// Connexion MongoDB + démarrage du serveur
const PORT = process.env.PORT || 9000;
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
