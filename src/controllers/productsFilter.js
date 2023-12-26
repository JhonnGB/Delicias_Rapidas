const productsFilter = {};
const Producto = require('../models/Products');
const Category = require("../models/Category");


productsFilter.filtrarProductos = async (req, res) => {
    try {
        const categories = await Category.find();
        const nombreCatego = req.params.categoria;
        const currentUrl = req.url;

        var productos = [];
        
        if(currentUrl == '/productos/todos'){
            // console.log(currentUrl)
            productos = await Producto.find({});
            var isTodosActive = true;
        } 
        else if(nombreCatego) {
            productos = await Producto.find({ categoria: nombreCatego });
        };

        // se guarda la direccion url actual de forma global
        req.session.returnTo = req.url;
        
        // se obtiene los mensajes success y errors
        const successMessage = req.flash("success") 
        const errorsMessage = req.flash("errors")
        
        res.render("pages/productos", { categories, productos, isTodosActive: isTodosActive || false, nombreCatego, successMessage, errorsMessage })

    } catch (error) {
        console.error('Error en el servidor', error)
        res.status(500).send('Error en el servidor', error)
    }    
}

module.exports = productsFilter;