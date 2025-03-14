import express from 'express';
import { addClient, deleteClient, getClient, getClientById, updateClient } from '../controllers/clientControllers.js';

const router = express.Router();


// Route pour les clients
router.post('/', addClient);

// Route pour recuperer les clients
router.get('/', getClient);

// Route pour recuperer un client par son id
router.get('/:id', getClientById);

// Route pour mettre à jour un client
router.put('/:id', updateClient);

// Route pour supprimer un client
router.delete('/:id', deleteClient);





export default router;
