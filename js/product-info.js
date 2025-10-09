document.addEventListener("DOMContentLoaded", function (e) {
  // Obtiene el ID del producto seleccionado previamente
  let prodID = localStorage.getItem("prodID");
  let producto = []
  let indexEstrellasSeleccionadas = 0;
  let productosRelacionados = [];


  // Ejecuta la petición para obtener los productos de la categoría seleccionada
  getJSONData(PRODUCT_INFO_URL + prodID + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      producto = resultObj.data;      
      productosRelacionados = producto.relatedProducts;
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
      ObtenerCalificaciones(prodID);
      ObtenerProductosRelacionados(productosRelacionados);
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

  function PintarEstrellasEnCalificar() {
    const estrellas = document.querySelectorAll(".seleccionEstrellas .estrella");
    indexEstrellasSeleccionadas = 0;

    estrellas.forEach((estrella, index) => {
      estrella.addEventListener("mouseenter", () => {
        estrellas.forEach((s, i) => {
          if (i <= index) {
            s.classList.remove("far");
            s.classList.add("fas");
          } else {
            s.classList.remove("fas");
            s.classList.add("far");
          }
        });
      });

      estrella.addEventListener("mouseleave", () => {
        estrellas.forEach((s, i) => {
          if (i < indexEstrellasSeleccionadas) {
            s.classList.remove("far");
            s.classList.add("fas");
          } else {
            s.classList.remove("fas");
            s.classList.add("far");
          }
        });
      });

      estrella.addEventListener("click", () => {
        indexEstrellasSeleccionadas = index + 1;
      });
    });
  }

  PintarEstrellasEnCalificar();
});

// Función para obtener las calificaciones del producto y mostrarlo en pantalla
function ObtenerCalificaciones(prodID) {
  let comentarios = [];
  let html = "";
  getJSONData(PRODUCT_INFO_COMMENTS_URL + prodID + ".json")
    .then(function (resultObj) {
      if (resultObj.status === 'ok') {
        comentarios = resultObj.data;

        // Aquí hacer la consulta al localStorage y en caso de que haya datos
        // agregarlo a comentarios con comentarios.shift(dato)


        // Si hay comentarios los agrega en caso contrario devuelve un texto
        if (comentarios.length > 0) {
          comentarios.forEach((c, i) => {
            // Crear estrellas
            let estrellasHTML = '';
            for (let i = 1; i <= 5; i++) {
              if (i <= c.score) {
                estrellasHTML += '<i class="fas fa-star"></i>';
              } else {
                estrellasHTML += '<i class="far fa-star"></i>';
              }
            }
            html += `
            <div class="comentarioItem">
            <div class="comentarioEncabezado">
            <span class="comentarioUsuario">${c.user}</span>
            <div class="comentarioEstrellas">
              ${estrellasHTML}
            </div>
            <span class="comentarioFecha">
            <i class="fas fa-clock"></i> ${c.dateTime}
            </span>
            </div>
            <p class="comentarioTexto">${c.description}</p>
            </div>
            `;
          });
        } else {
          html = `
            <div class="sinComentarios">
              <i class="far fa-comments"></i>
              <p>Aún no hay comentarios para este producto. ¡Sé el primero en opinar!</p>
            </div> 
          `;
        }

        document.getElementById("listaComentarios").innerHTML = html;
      }
    });

}

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

function ObtenerProductosRelacionados(productos){
  let htmlContentToAppend = "";
  productos.forEach((producto, index)=>{
    getJSONData(PRODUCT_INFO_URL + producto.id + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      producto = resultObj.data;      
      let currency = producto.currency;
      let signoMoneda = `${currency === "UYU" ? "$" : "U$D"}`;
      // Añade los productos relacionados
      
        htmlContentToAppend += `
        
          <div class="tarjeta me-3" onclick="MostrarProducto(${producto.id})">
            <img src="${producto.images[0]}" alt="Imagen de ${producto.name}" />
            <p class="precio">${signoMoneda} ${producto.cost}</p>
            <h2>${producto.name}</h2>
            <p class="descripcion" title="${producto.description}">${producto.description}</p>
            <button class="btnAgregarAlCarrito">Agregar al carrito</button>
            <div class="vendidos">Vendidos: ${producto.soldCount}</div>
          </div>
        `;
      
      
    }
    
    document.getElementById("productosRelacionados").innerHTML = htmlContentToAppend;
  });
  });
  window.MostrarProducto = function(id) {
      localStorage.setItem("prodID", id);
      location.reload();
    }
}
