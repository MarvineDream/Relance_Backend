import express from 'express';
import { deleteAdmin, getAdminById, getAllAdmins, login, Register, updatedAdmin } from '../controllers/adminControllers.js';



const router = express.Router();

router.post('/login', login);
router.post('/register', Register);
router.get('/', getAllAdmins);
router.get('/:id', getAdminById);
router.put('/:id', updatedAdmin);
router.delete('/:id', deleteAdmin);


export default router;