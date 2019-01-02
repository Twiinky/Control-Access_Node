const mongoose = require('mongoose');
const { Schema } = mongoose;

const CodigoSchema = new Schema({
    tipovehiculo: {type: String, required: true},
    descripcion: {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: {type: String }
});

module.exports = mongoose.model('Codigo', CodigoSchema);