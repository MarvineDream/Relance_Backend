import express from 'express';
import { login, Register } from '../controllers/adminControllers.js';



const router = express.Router();

router.post('/login', login);
router.post('/register', Register);


export default router;