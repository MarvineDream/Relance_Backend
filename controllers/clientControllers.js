import Client from '../models/clientmodels.js';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

// Fonction pour gérer les erreurs
const handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

export const addClient = async (req, res) => {
    // Validation des champs requis
    await body('nom').notEmpty().withMessage('Le nom est requis.').run(req);
    await body('email').isEmail().withMessage('L\'email est invalide.').run(req);
    await body('telephone').notEmpty().withMessage('Le téléphone est requis.').run(req);
    await body('typeAssurance').notEmpty().withMessage('Le type d\'assurance est requis.').run(req);
    await body('dateExpiration').notEmpty().withMessage('La date d\'expiration est requise.').run(req);
    await body('impayes').isBoolean().withMessage('Le statut impayé est requis.').run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nom, email, telephone, typeAssurance, dateExpiration, impayes } = req.body;
    console.log(req.body);
    

    try {
        const newClient = new Client({
            nom,
            email,
            telephone,
            typeAssurance,
            dateExpiration,
            impayes,
        });

        await newClient.save();
        res.status(201).json({ message: 'Client enregistré avec succès', client: newClient });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }
        handleError(res, error, 'Erreur lors de l\'enregistrement du client.');
    }
};

// Middleware pour valider les données lors de l'enregistrement
export const validateRegister = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const getClient = async (req, res) => {
    try {
        const clients = await Client.find(); // Récupérer tous les clients
        res.status(200).json({ message: 'Clients récupérés avec succès', clients });
    } catch (error) {
        // Gestion des erreurs spécifiques
        if (error.name === 'MongoError') {
            return res.status(500).json({ message: 'Erreur de base de données.', error: error.message });
        } else if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erreur de validation.', error: error.message });
        } else {
            return res.status(500).json({ message: 'Erreur lors de la récupération des clients.', error: error.message });
        }
    }
};

export const getClientById = async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    

    try {
        const client = await Client.findById(id); // Récupérer le client par ID

        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé.' });
        }

        res.status(200).json({ message: 'Client récupéré avec succès', client });
    } catch (error) {
        // Gestion des erreurs
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de client invalide.' });
        }
        return res.status(500).json({ message: 'Erreur lors de la récupération du client.', error: error.message });
    }
};

export const updateClient = async (req, res) => {
    const { id } = req.params;
    const { nom, email, telephone, typeAssurance, dateExpiration, impayes } = req.body;

    try {
        const updatedClient = await Client.findByIdAndUpdate(
            id,
            { nom, email, telephone, typeAssurance, dateExpiration, impayes },
            { new: true, runValidators: true } // 'new' pour retourner le document modifié, 'runValidators' pour valider les données
        );

        if (!updatedClient) {
            return res.status(404).json({ message: 'Client non trouvé.' });
        }

        res.status(200).json({ message: 'Client mis à jour avec succès', client: updatedClient });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }
        handleError(res, error, 'Erreur lors de la mise à jour du client.');
    }
};

export const deleteClient = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedClient = await Client.findByIdAndDelete(id);

        if (!deletedClient) {
            return res.status(404).json({ message: 'Client non trouvé.' });
        }

        res.status(200).json({ message: 'Client supprimé avec succès', client: deletedClient });
    } catch (error) {
        handleError(res, error, 'Erreur lors de la suppression du client.');
    }
};
