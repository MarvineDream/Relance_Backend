import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    typeAssurance: { type: String, enum: ['auto', 'sante', 'risques divers'], required: true },
    dateExpiration: { type: Date, required: true },
    impayes: { type: Boolean, default: true },
    renouvellement: { type: Boolean, default: false },
}, 
{ timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
