document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    document.getElementById('carrito-vacio').style.display = 'block';
    document.getElementById('carrito-productos').style.display = 'none';
  } else {
    document.getElementById('carrito-vacio').style.display = 'none';
    document.getElementById('carrito-productos').style.display = 'block';
    mostrarProductosEnCarrito(cart);
  }
  
  
  function mostrarProductosEnCarrito(cart) {
    let htmlContentToAppend = "";
    
    cart.forEach((producto, index) => {
      let currency = producto.currency;
      let signoMoneda = `${currency === "UYU" ? "$" : "U$D"}`;
      let subtotalItem = producto.cost * (producto.quantity || 1);
      
      //30-10-25 se agrego id="subtotal-item-${index}" para poder targetearlo para la funcion de subtotales
      htmlContentToAppend += `
      <div class="carrito-tarjeta">
      <div class="carrito-tarjeta-imagen">
      <img src="${producto.images[0]}" alt="${producto.name}">
      </div>
      <div class="carrito-tarjeta-contenido">
      <h3>${producto.name}</h3>
      <div class="disminuir-aumentar">
      <button class="disminuir" data-index="${index}">−</button>
      <input type="number" min="1" value="${producto.quantity || 1}" data-index="${index}" readonly>
      <button class="aumentar" data-index="${index}">+</button>
      </div>
      </div>
      <div class="precio">
      <div class="eliminar-producto">
      <i class=" fa-solid fa-lg fa-trash-can" data-index="${index}"></i>
      </div>
      <p id="subtotal-item-${index}">${signoMoneda} ${subtotalItem.toLocaleString()}</p> 
      </div>
      </div>
      `;
    });
    
    document.getElementById("carrito-items").innerHTML = htmlContentToAppend;
    agregarEventosCarrito(cart);
  }
  
  // Funciones para aumentar, disminuir y cambiar cantidad
  function agregarEventosCarrito(cart) {
    document.querySelectorAll(".aumentar").forEach(btn => {
      btn.addEventListener("click", () => {
        let i = btn.dataset.index;
        cart[i].quantity = (cart[i].quantity || 1) + 1;
      });
    });
    
    document.querySelectorAll(".disminuir").forEach(btn => {
      btn.addEventListener("click", () => {
        let i = btn.dataset.index;
        if (cart[i].quantity > 1) cart[i].quantity--;
      });
    });
    
    document.querySelectorAll(".disminuir-aumentar input").forEach(input => {
      input.addEventListener("change", () => {
        let i = input.dataset.index;
        cart[i].quantity = parseInt(input.value) || 1;
      });
    });
  }
  
  // Eliminar producto del carrito
  function eliminarProducto(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
  }
  
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("fa-trash-can")) {
      let index = e.target.dataset.index;
      eliminarProducto(index);
    }
  });

  // Vaciar carrito
  const vaciarCarrito = document.createElement("div");
  vaciarCarrito.textContent = "Vaciar carrito";
  vaciarCarrito.classList.add("vaciar-carrito");
  vaciarCarrito.addEventListener("click", () => {
    localStorage.removeItem("cart");
    location.reload();
  });
  document.querySelector(".col-lg-8").appendChild(vaciarCarrito);
  
  
 /// Funciones para cambiar y actualizar el subtotal en tiempo real.

const FACTOR_CONVERSION_PESOS_URUGUAYOS_A_DOLARES = 0.025;
const INTERVALO_OBSERVACION_CARRITO_MILISEGUNDOS = 100;
const SIMBOLO_MONEDA_PRINCIPAL = "U$D";

let ESTADO_ANTERIOR_DEL_CARRITO = JSON.stringify(cart);


/// Almacena el carrito en el localStorage como un array JSON.
function GuardarCarritoEnLocalStorage(CARRITO_ACTUALIZADO) {
  localStorage.setItem("cart", JSON.stringify(CARRITO_ACTUALIZADO));
}

/// Calcula el subtotal general de los productos en el carrito.
/// Convierte los precios en pesos uruguayos a dólares para unificar valores.
function CalcularSubtotalDelCarrito() {
  const SUBTOTAL = cart.reduce((ACUMULADOR, PRODUCTO) => {
    const CANTIDAD_PRODUCTO = PRODUCTO.quantity || 1;
    let COSTO_EN_DOLARES = PRODUCTO.cost;

    // Conversión de moneda si el producto está en pesos uruguayos (UYU)
    if (PRODUCTO.currency === "UYU") {
      COSTO_EN_DOLARES = PRODUCTO.cost * FACTOR_CONVERSION_PESOS_URUGUAYOS_A_DOLARES;
    }

    return ACUMULADOR + COSTO_EN_DOLARES * CANTIDAD_PRODUCTO;
  }, 0);

  return SUBTOTAL;
}

/// Actualiza el total general mostrado en el DOM dentro del elemento con id "total-precio".
function ActualizarTotalEnHTML(TOTAL_DEL_CARRITO) {
  const TOTAL_FORMATEADO = TOTAL_DEL_CARRITO
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const ELEMENTO_TOTAL = document.getElementById("total-precio");

  if (ELEMENTO_TOTAL) {
    ELEMENTO_TOTAL.textContent = `${SIMBOLO_MONEDA_PRINCIPAL} ${TOTAL_FORMATEADO}`;
  }
}

/// Observa los cambios en el carrito cada cierto intervalo de tiempo para mantener la vista actualizada.
function ObservarCambiosEnCarrito() {
  if (cart.length === 0) return;

  const ESTADO_ACTUAL_DEL_CARRITO = JSON.stringify(cart);

  if (ESTADO_ACTUAL_DEL_CARRITO !== ESTADO_ANTERIOR_DEL_CARRITO) {
    GuardarCarritoEnLocalStorage(cart);
    mostrarProductosEnCarrito(cart);

    const NUEVO_SUBTOTAL = CalcularSubtotalDelCarrito();
    ActualizarTotalEnHTML(NUEVO_SUBTOTAL);

    ESTADO_ANTERIOR_DEL_CARRITO = ESTADO_ACTUAL_DEL_CARRITO;
  }
}

// Llamada inicial para asegurar que el total se muestre correctamente al cargar.
if (cart.length > 0) {
  const SUBTOTAL_INICIAL = CalcularSubtotalDelCarrito();
  ActualizarTotalEnHTML(SUBTOTAL_INICIAL);
}

// Inicia el proceso de observación periódica del carrito.
setInterval(ObservarCambiosEnCarrito, INTERVALO_OBSERVACION_CARRITO_MILISEGUNDOS);

}); // Fin de DOMContentLoaded