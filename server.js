import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {connectToDatabase} from './config/db.js';
import dotenv from 'dotenv';
import { sendRenewalReminders, sendPaymentReminders } from './controllers/relanceControllers.js';
import relanceRoute from './routes/relanceRoute.js';
import clientRoute from './routes/clientRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import cron from 'node-cron';



dotenv.config();
const app = express();
const PORT = process.env.PORT;


connectToDatabase();


// Middleware pour permettre l'accès à l'API (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '1800');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, Origin, X-Requested-With, Content, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    // Gérer les requêtes OPTIONS
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); 
    }
  
    next(); 
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/Authentification', AuthRoute);
app.use('/Rouvellement', relanceRoute);
app.use('/Impayé', relanceRoute);
app.use('/clients', clientRoute);




cron.schedule('50 14 * * *', () => {
    console.log('Vérification des contrats proches de l\'expiration...');
    sendRenewalReminders();
});

cron.schedule('03 10 * * *', () => {
    console.log('Vérification des clients en situation d\'impayés ');
    sendPaymentReminders();
});



app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
    
} );