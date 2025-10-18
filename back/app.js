require('dotenv').config(); // Load environment variables de fichier .env ex process.env.PORT    
const express = require('express');  //importes le module Express, qui te permet de créer un serveur web avec Node.js.
const app = express(); // crée une instance de l'application , , c’est-à-dire ton serveur backend.
const routes = require('./routes');
const { errorMiddleware } = require('./middlewares/errorHandler');
const cors = require('cors'); //pour gérer les requêtes cross-origin (CORS)
const helmet = require('helmet');// Security middleware to set various HTTP headers
const path = require('path'); //trouver le bon chemin de fichier
const connectDB = require('./db'); //importer la fonction de connexion à la base de données (tasnime)


//middleware Express 
//toutes les requêtes entrantes qui contiennent un corps JSON (body) doivent être automatiquement parsées (converties) en objet JavaScript utilisable dans req.body.
app.use(express.json());

// Allow requests from your frontend

const corsOptions = {
  origin: '*', // Replace with the URL of your Angular app
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: false, // le frontend peut utiliser les ressource de mon  backend ,Je veux que les autres sites puissent utiliser mes ressource (image , video ..). 
  })
);

// serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api',routes)

app.use(errorMiddleware);

module.exports = app; 