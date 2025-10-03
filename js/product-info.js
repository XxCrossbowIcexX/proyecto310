document.addEventListener("DOMContentLoaded", function (e) {
  // Obtiene el ID del producto seleccionado previamente
  let prodID = localStorage.getItem("prodID");
  let producto = []

  // Ejecuta la petición para obtener los productos de la categoría seleccionada
  getJSONData(PRODUCT_INFO_URL + prodID + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      producto = resultObj.data;

      // Actualizamos el breadcrumb
      document.getElementById("breadcrumb").innerHTML = `
                      <a href="index.html">Inicio</a> 
                      <i class="fas fa-arrow-right"></i> 
                      <a href="categories.html">Categorías</a>
                      <i class="fas fa-arrow-right"></i>
                      <a href="products.html">${producto.category}</a>
                      <i class="fas fa-arrow-right"></i> 
                      <strong>${producto.name}</strong>`;

      // Muestra la información del producto
      CargarInfoProducto(producto);
    }
  });


  function CargarInfoProducto(p) {
    let currency = p.currency;
    let signoMoneda = `${currency === "UYU" ? "$" : "U$D"}`;

    // Crear HTML para las miniaturas
    let miniaturasHTML = "";
    p.images.forEach((img, index) => {
      miniaturasHTML += `
        <img src="${img}" 
             class="imgMiniatura ${index === 0 ? 'activa' : ''}" 
             onclick="CambiarImagenPrincipal('${img}', this)"
             alt="Miniatura ${index + 1}">
      `;
    });

    let htmlContentToAppend = `
        <div class="col-md-12 col-lg-6">
          <div class="contenedorGaleria">
            <img id="imagenPrincipal" src="${p.images[0]}" class="img-fluid imagenPrincipal" alt="${p.name}">
            <div class="contenedorMiniaturas">
              ${miniaturasHTML}
            </div>
          </div>
        </div>
        <div class="col-md-12 col-lg-6 d-flex flex-column justify-content-start">
          <h1 id="nombre">${p.name}</h1>
          <h3 id="descripcion">${p.description}</h3>
          <p>Categoría: <span>${p.category}</span></p>
          <p>Vendidos: <span>${p.soldCount}</span></p>
          <h2 id="precio">${signoMoneda} ${p.cost}</h2>
          <button class="btnAgregarAlCarrito">Agregar al carrito</button>
        </div>
    `;

    document.getElementById("infoProducto").innerHTML = htmlContentToAppend;
  }
});

// Función para cambiar la imagen principal
function CambiarImagenPrincipal(nuevaImagen, elemento) {
  // Obtenemos la imagen y le colocamos la nueva imagen
  document.getElementById("imagenPrincipal").src = nuevaImagen;

  // Remover la clase 'activa' de todas las miniaturas
  document.querySelectorAll(".imgMiniatura").forEach(img => {
    img.classList.remove("activa");
  });

  // Agregar la clase 'activa' a la miniatura clickeada
  elemento.classList.add("activa");
}