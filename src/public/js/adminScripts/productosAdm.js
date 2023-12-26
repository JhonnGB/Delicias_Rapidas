// ---- Ventana emergente (Crear) ----
document.getElementById("mostrarVentanaCrear").addEventListener("click", function () {
  var dataCategoria = this.getAttribute("data-categoria");
  mostrarVentanaCrear(dataCategoria);
});

// Muestra la ventana emergente (crear)
function mostrarVentanaCrear(dataCategoria) {
var ventanaCrear = document.getElementById("ventanaCrear");
ventanaCrear.style.display = "block";

// solicitud GET para obtener el HTML de la vista 'crear'
fetch(`/adm/crear/producto?dataCategoria=${dataCategoria}`, {
  method: "GET",
  headers: {
    "Content-Type": "text/html",
  },
})
  .then((response) => response.text())
  .then((html) => {
    // Insertar el HTML obtenido en el contenedor de la ventana emergente
    ventanaCrear.innerHTML = html;

    // Agregar un event listener al botón "Cancelar"
    document.getElementById("cancelarCrear").addEventListener("click", function () {
        cerrarVentanaCrear();
      });
  })
  .catch((error) => {
    console.error("Error al obtener la vista editar:", error);
  });
}

// funcion cerrar la venta emergente (crear)
function cerrarVentanaCrear() {
var ventanaCrear = document.getElementById("ventanaCrear");
ventanaCrear.style.display = "none";
}


// ---- Ventana emergente (Eliminar) ----
// Se obtienen los botones eliminar de toda la iteracion
var botonesEliminar = document.querySelectorAll(".mostrarVentanaEliminar");

// Se agrega un event listener a cada boton de la iteracion
botonesEliminar.forEach(function (button) {
button.addEventListener("click", function () {
  var index = this.getAttribute("data-index");
  mostrarVentanaEliminar(index);
});
});

// muestra la venta emergente (eliminar)
function mostrarVentanaEliminar(index) {
// Obtener el contenedor de la ventana emergente
var ventanaEliminar = document.getElementById("ventanaEliminar" + index);

// Mostrar el contenedor de la ventana emergente
ventanaEliminar.style.display = "block";

// Agregar un event listener al botón "Cancelar"
document
  .getElementById("cancelarEliminar" + index)
  .addEventListener("click", function () {
    cerrarVentanaEliminar(index);
  });
}

// Cierra la venta emergente (eliminar)
function cerrarVentanaEliminar(index) {
var ventanaEliminar = document.getElementById("ventanaEliminar" + index);
ventanaEliminar.style.display = "none";
}

// ---- Ventana emergente (Editar) ----
// Se obtienen los botones editar de toda la iteracion
var botonesEditar = document.querySelectorAll(".mostrarVentanaEditar");

// Se agrega un event listener a cada boton de la iteracion
botonesEditar.forEach(function (button) {
button.addEventListener("click", function () {
  var index = parseInt(this.getAttribute("data-index"), 10);
  var recursoId = this.getAttribute("data-recursoId");
  mostrarVentanaEditar(index, recursoId);
});
});

// Muestra la venta emergente (editar)
function mostrarVentanaEditar(index, recursoId) {
// Obtener el contenedor de la ventana emergente
var ventanaEditar = document.getElementById("ventanaEditar" + index);

// Mostrar el contenedor de la ventana emergente
ventanaEditar.style.display = "block";

// Hacer una solicitud GET para obtener el HTML de la vista 'editar'
fetch(`/adm/editar-producto?recursoId=${recursoId}`, {
  method: "GET",
  headers: {
    "Content-Type": "text/html",
  },
})
  .then((response) => response.text())
  .then((html) => {
    // Insertar el HTML obtenido en el contenedor de la ventana emergente
    ventanaEditar.innerHTML = html;

    document.getElementById("cancelarEditar" + index).addEventListener("click", function() {
      cerrarVentanaEditar(index);
    });
  })
  .catch((error) => {
    console.error("Error al obtener la vista editar:", error);
  });
}

function cerrarVentanaEditar(index) {
  var ventanaEditar = document.getElementById("ventanaEditar" + index);
  ventanaEditar.style.display = "none";
};