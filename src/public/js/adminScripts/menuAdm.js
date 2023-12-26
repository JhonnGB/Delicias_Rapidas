document.getElementById('abrirMenuAdmin').addEventListener('click', function() {
    abrirMenu();
});

// funcion para abrir la barra
function abrirMenu() {
    var menuBarra = document.querySelector('.menu-adm__barra')
    menuBarra.style.width = '230px'

    var spanBarra = document.querySelector('.menu-adm__span')
    spanBarra.style.display = 'block'

    var navAdmin = document.querySelector('.adm-nav')
    navAdmin.classList.add('mostrar-nav');

    // Agrega un event listener al documento para cerrar el menú
    document.addEventListener('click', cerrarMenu);

    // Detiene la propagación del clic dentro del menú 
    navAdmin.addEventListener('click', function (event) {
        event.stopPropagation();
    });
};

// Funcion para cerrar la barra
function cerrarMenu(event) {
    var menuBarra = document.querySelector('.menu-adm__barra');
    var navAdmin = document.querySelector('.adm-nav');

    // Verifica si el clic ocurrió dentro de menuBarra o navAdmin
    if (!menuBarra.contains(event.target) && !navAdmin.contains(event.target)) {
        // Cerrar el menú solo si el clic no ocurrió dentro de menuBarra o navAdmin
        menuBarra.style.width = '80px';
        var spanBarra = document.querySelector('.menu-adm__span')
        spanBarra.style.display = 'none'
        navAdmin.classList.remove('mostrar-nav');
    }
};