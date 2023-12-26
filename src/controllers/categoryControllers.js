const categoryControllers = {}
const Category = require("../models/Category");


categoryControllers.findCategories = async (req, res) => {
    try {
        // se llaman a todas las categorias de BD
        const categories = await Category.find();

        // se guarda la direccion url actual de forma global
        req.session.returnTo = req.url;

        // se obtiene los mensajes success y errors
        const successMessage = req.flash("success") 
        const errorsMessage = req.flash("errors");
        
        res.render("index", { categories, successMessage, errorsMessage })
        
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).send("Error al obtener las categorías");
    }
};

module.exports = categoryControllers;