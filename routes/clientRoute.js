import express from 'express';
import { addClient, deleteClient, getClient, getClientById, updateClient } from '../controllers/clientControllers.js';

const router = express.Router();



router.post('/', addClient);
router.get('/', getClient);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);





export default router;
