import express from 'express';
import { login, Register } from '../controllers/adminControllers.js';


const router = express.Router();

router.post('/', login);
router.post('/', Register);


export default router;