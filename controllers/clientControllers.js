import Client from '../models/clientmodels.js';



export const registerClient = async (req, res) => {
    const { nom, email, telephone, typeAssurance, dateExpiration, impayé } = req.body;

    try {
        // Créer une nouvelle instance de Client
        const newClient = new Client({
            nom,
            email,
            telephone,
            typeAssurance,
            dateExpiration,
            impayes,
        });

        // Sauvegarder le client dans la base de données
        await newClient.save();

        // Répondre avec un message de succès
        res.status(201).json({ message: 'Client enregistré avec succès', client: newClient });
    } catch (error) {
        // Gérer les erreurs
        if (error.code === 11000) {
            // Erreur de duplication (email unique)
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement du client', error: error.message });
    }
};
