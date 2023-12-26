const {Schema, model} = require('mongoose');

const ProductSchema = new Schema({
    categoria: {type: String},
    nombre: {type: String},
    descripcion: {type: String},
    precio: {type: Number},
    img: {type: String},
}, {
    timestamps: true
});

module.exports = model('Producto', ProductSchema);