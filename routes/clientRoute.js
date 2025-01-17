import express from 'express';
import { registerClient } from '../controllers/clientControllers.js';

const router = express.Router();


router.post('/', registerClient);





export default router;
