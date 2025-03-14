import Client from '../models/clientmodels.js';
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
                }

                if (daysUntilExpiration === 14) { // 2 semaines avant
                    await transporter.sendMail({
                        from: 'leskalpel@gmail.com',
                        to: client.email,
                        subject: 'Rappel : Renouvellement de contrat dans 2 semaines',
                        text: `Bonjour ${client.nom},\n\nVotre contrat d'assurance arrivera à expiration dans 2 semaines. Pensez à le renouveler !\n\nCordialement,\nVotre agence d'assurance`,
                    });
                    console.log(`Email de rappel envoyé à ${client.email} pour 2 semaines avant expiration`);
                }

                if (daysUntilExpiration === 0) { //Jour J
                    await transporter.sendMail({
                        from: 'leskalpel@gmail.com',
                        to: client.email,
                        subject: 'Urgent : Fin de votre contrat d\'assurance aujourd\'hui',
                        text: `Bonjour Mr/Mme ${client.nom},\n\nVotre contrat d'assurance est arrivé à expiration aujourd'hui. Veuillez le renouveler dès que possible.\n\nCordialement,\nVotre agence d'assurance Bamboo assur`,
                    });
                    console.log(`Email de rappel envoyé à Mr/Mme ${client.email} pour indiquer la fin de votre contrat avec Bamboo assur`);
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
                text: `Bonjour ${client.nom},\n\nVous avez des impayés concernant votre assurance ${client.typeAssurance}. Merci de régulariser votre situation au plus vite.\n\nCordialement,\nVotre agence d'assurance`,
            });
            console.log(`Email de rappel envoyé à ${client.email} pour impayés (${client.typeAssurance})`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des rappels de paiement:', error);
    }
};

