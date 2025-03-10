import Admin from "../models/adminModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const JWT_SECRET = process.env.JWT_SECRET;



// Fonction pour générer un token
const generateToken = (clientId) => {
    const payload = { id: clientId };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Gestion des erreurs
const handleError = (res, error, message) => {
    console.error(error);
    res.status(500).json({ message, error: error.message });
};

// Enregistrement d'un Client
export const Register = async (req, res) => {
    const { nom, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ $or: [{ nom }, { email }] });
        if (existingAdmin) {
            return res.status(400).json({ message: "Nom de l'admin ou email déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ nom, email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin créé avec succès.', admin: newAdmin });
    } catch (error) {
        handleError(res, error, 'Erreur lors de la création du client.');
    }
};


// Connexion d'un Client
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const token = generateToken(admin._id);
        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        handleError(res, error, 'Erreur interne du serveur.');
    }
};