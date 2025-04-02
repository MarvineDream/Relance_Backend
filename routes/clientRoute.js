import express from 'express';
import { addClient, deleteClient, getClient, getClientById, updateClient } from '../controllers/clientControllers.js';
import { authenticate, authorize } from '../Middleware/auth.js';

const router = express.Router();


// Route pour les clients
router.post('/', authenticate, authorize, addClient);

// Route pour recuperer les clients
router.get('/', authenticate, authorize, getClient);

// Route pour recuperer un client par son id
router.get('/:id', authenticate, authorize, getClientById);

// Route pour mettre à jour un client
router.put('/:id', authenticate, authorize, updateClient);

// Route pour supprimer un client
router.delete('/:id', authenticate, authorize, deleteClient);





export default router;
