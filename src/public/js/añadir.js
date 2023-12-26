document.addEventListener("DOMContentLoaded", function () {
  const restarBtn = document.querySelector(".restar");
  const sumarBtn = document.querySelector(".sumar");
  const cantidadInput = document.querySelector(".cantidad-producto");

  // Event listeners para controlar la cantidad
  restarBtn.addEventListener("click", function (event) {
    event.preventDefault();
    if (cantidadInput.value > 0) {
      cantidadInput.value = parseInt(cantidadInput.value) - 1;
    }
  });

  sumarBtn.addEventListener("click", function (event) {
    event.preventDefault();
    cantidadInput.value = parseInt(cantidadInput.value) + 1;
  });
});
