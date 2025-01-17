import express from 'express';
import { sendPaymentReminders, sendRenewalReminders } from '../controllers/relanceControllers.js';

const router = express.Router();


router.get('/', sendRenewalReminders);
router.get('/', sendPaymentReminders);




export default router;