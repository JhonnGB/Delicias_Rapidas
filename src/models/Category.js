const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
    nomCatego: {type: String},
    numProducts: {type: Number},
    cover: {type: String},
    icono: {type: String},
});

module.exports = model('Category', CategorySchema);