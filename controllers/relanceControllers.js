import Client from '../models/clientmodels.js';
import Admin from '../models/adminModel.js';
import moment from 'moment';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';





dotenv.config();

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
});


// Fonction pour envoyer une notification aux administrateurs
export const notifyAdministrators = async (clientEmail, subject) => {
    try {
        // Récupérer tous les administrateurs
        const admins = await Admin.find({}, 'email'); // Récupère uniquement les emails
        const adminEmails = admins.map(admin => admin.email); // Extraire les emails

        await transporter.sendMail({
            from: 'leskalpel@gmail.com',
            to: adminEmails,
            subject: `Notification : ${subject}`,
            text: `Un email a été envoyé à ${clientEmail} concernant : ${subject}.`,
        });
        console.log(`Notification envoyée aux administrateurs pour l'email envoyé à ${clientEmail}`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification aux administrateurs:', error);
    }
};

export const sendRenewalReminders = async () => {
    try {
        const clients = await Client.find();
        const today = moment();

        for (const client of clients) {
            const expirationDate = moment(client.dateExpiration);
            const daysUntilExpiration = expirationDate.diff(today, 'days');

            if (!client.impayes) {
                if (daysUntilExpiration === 30) { // 1 mois avant
                    await transporter.sendMail({
                        from: 'leskalpel@gmail.com',
                        to: client.email,
                        subject: 'Rappel : Renouvellement de contrat dans 1 mois',
                        text: `Bonjour ${client.nom},\n\nVotre contrat d'assurance arrivera à expiration dans 1 mois. Pensez à le renouveler !\n\nCordialement,\nVotre agence d'assurance`,
                    });
                    console.log(`Email de rappel envoyé à ${client.email} pour 1 mois avant expiration`);
                    await notifyAdministrators(client.email, 'Rappel : Renouvellement de contrat dans 1 mois');
                }

                if (daysUntilExpiration === 14) { // 2 semaines avant
                    await transporter.sendMail({
                        from: 'leskalpel@gmail.com',
                        to: client.email,
                        subject: 'Rappel : Renouvellement de contrat dans 2 semaines',
                        text: `Bonjour ${client.nom},\n\nVotre contrat d'assurance arrivera à expiration dans 2 semaines. Pensez à le renouveler !\n\nCordialement,\nVotre agence d'assurance`,
                    });
                    console.log(`Email de rappel envoyé à ${client.email} pour 2 semaines avant expiration`);
                    await notifyAdministrators(client.email, 'Rappel : Renouvellement de contrat dans 2 semaines');
                }

                if (daysUntilExpiration === 0) { // Jour J
                    await transporter.sendMail({
                        from: 'leskalpel@gmail.com',
                        to: client.email,
                        subject: 'Urgent : Fin de votre contrat d\'assurance aujourd\'hui',
                        text: `Bonjour Mr/Mme ${client.nom},\n\nVotre contrat d'assurance est arrivé à expiration aujourd'hui. Veuillez le renouveler dès que possible.\n\nCordialement,\nVotre agence d'assurance Bamboo assur`,
                    });
                    console.log(`Email de rappel envoyé à Mr/Mme ${client.email} pour indiquer la fin de votre contrat avec Bamboo assur`);
                    await notifyAdministrators(client.email, 'Urgent : Fin de votre contrat d\'assurance aujourd\'hui');
                }
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des rappels de renouvellement:', error);
    }
};



export const sendPaymentReminders = async () => {
    try {
        const clients = await Client.find({ impayes: true });
        
        for (const client of clients) {
            // Notification pour les impayés
            await transporter.sendMail({
                from: 'leskalpel@gmail.com',
                to: client.email,
                subject: 'Rappel : Assurance impayée',
                text: `Bonjour ${client.nom},\n\nNous souhaitons vous rappeler que vous avez des impayés concernant votre contrat d'assurance de type ${client.typeAssurance}. Nous vous prions de bien vouloir régulariser votre situation dans les plus brefs délais afin d'éviter toute interruption de service.\n\nNous restons à votre disposition pour toute question.\n\nCordialement,\nVotre agence d'assurance`,
            });
            console.log(`Email de rappel envoyé à ${client.email} pour impayés (${client.typeAssurance})`);
            await notifyAdministrators(client.email, `Rappel : Impayés pour le client ${client.nom}`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des rappels de paiement:', error);
    }
};



export const countClients = async () => {
    try {
        const totalClients = await Client.countDocuments();
        const clientsWithImpayes = await Client.countDocuments({ impayes: true });
        const clientsPaid = totalClients - clientsWithImpayes; // Clients ayant payé
        const clientsRenewed = await Client.countDocuments({ renouvelle: true });
        const clientsNotRenewed = totalClients - clientsRenewed; // Clients n'ayant pas renouvelé leur assurance

        console.log(`Nombre total de clients : ${totalClients}`);
        console.log(`Clients avec impayés : ${clientsWithImpayes}`);
        console.log(`Clients ayant payé : ${clientsPaid}`);
        console.log(`Clients ayant renouvelé leur assurance : ${clientsRenewed}`);
        console.log(`Clients n'ayant pas renouvelé leur assurance : ${clientsNotRenewed}`);
    } catch (error) {
        console.error('Erreur lors du comptage des clients:', error);
    }
};


