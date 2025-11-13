document.addEventListener("DOMContentLoaded", function () {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    document.getElementById("carrito-vacio").style.display = "block";
    document.getElementById("carrito-productos").style.display = "none";
  } else {
    document.getElementById("carrito-vacio").style.display = "none";
    document.getElementById("carrito-productos").style.display = "block";
    mostrarProductosEnCarrito(carrito);
  }

  function mostrarProductosEnCarrito(carrito) {
    let htmlContentToAppend = "";

    carrito.forEach((producto, index) => {
      let moneda = producto.moneda;
      let signoMoneda = `${moneda === "UYU" ? "$" : "U$D"}`;
      let subtotalItem = producto.precio * (producto.cantidad || 1);

      //30-10-25 se agrego id="subtotal-item-${index}" para poder targetearlo para la funcion de subtotales
      htmlContentToAppend += `
        <div class="carrito-tarjeta">
          <div class="carrito-tarjeta-imagen">
           <img src="${producto.imagen}" alt="${producto.nombre}">
          </div>
          <div class="carrito-tarjeta-contenido">
            <h3>${producto.nombre}</h3>
            <div class="disminuir-aumentar">
              <button class="disminuir" data-index="${index}">−</button>
              <input type="number" min="1" value="${
                producto.cantidad || 1
              }" data-index="${index}" readonly />
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
    agregarEventosCarrito(carrito);
  }

  // Funciones para aumentar, disminuir y cambiar cantidad
  function agregarEventosCarrito(carrito) {
    document.querySelectorAll(".aumentar").forEach((btn) => {
      btn.addEventListener("click", () => {
        let i = btn.dataset.index;
        carrito[i].cantidad = (carrito[i].cantidad || 1) + 1;
      });
    });

    document.querySelectorAll(".disminuir").forEach((btn) => {
      btn.addEventListener("click", () => {
        let i = btn.dataset.index;
        if (carrito[i].cantidad > 1) carrito[i].cantidad--;
      });
    });

    document.querySelectorAll(".disminuir-aumentar input").forEach((input) => {
      input.addEventListener("change", () => {
        let i = input.dataset.index;
        carrito[i].cantidad = parseInt(input.value) || 1;
      });
    });
  }

  // Eliminar producto del carrito
  function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
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
    localStorage.removeItem("carrito");
    location.reload();
  });
  document.querySelector(".col-lg-8").appendChild(vaciarCarrito);

  // Modal concluir compra
  const btnComprar = document.getElementById("btnComprar");
  const modal = document.getElementById("concluirCompraModal");
  const btnCerrarModal = document.getElementById("btnCerrar");

  const btnAnterior = document.getElementById("btnAnterior");
  const btnSiguiente = document.getElementById("btnSiguiente");
  const tabs = ["datos", "pago", "confirmacion"];
  let indiceTab = 0;

  const select = document.querySelector(".selectorTipoEnvio");
  const display = select.querySelector(".seleccionado");
  const opciones = select.querySelector(".opciones");
  const opcionesItems = opciones.querySelectorAll("div");
  const selectReal = document.getElementById("selectEnvio");

  // Abrir modal
  btnComprar.addEventListener("click", function () {
    modal.style.display = "flex";
    MostrarTab(0);
  });

  // Cerrar modal
  btnCerrarModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Lógica de tabs
  document.querySelectorAll(".botonTabs").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Desactivar botones
      document
        .querySelectorAll(".botonTabs")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Mostrar contenido correspondiente
      const tab = btn.getAttribute("data-tab");
      document
        .querySelectorAll(".tab-pane")
        .forEach((p) => p.classList.remove("active"));
      document.getElementById(tab).classList.add("active");
      MostrarTab(tabs.indexOf(tab));
    });
  });

  function MostrarTab(index) {
    // Evitar que se salga de rango
    if (index < 0 || index >= tabs.length) return;

    indiceTab = index;

    // Actualizar botón activo
    document
      .querySelectorAll(".botonTabs")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelector(`[data-tab="${tabs[indiceTab]}"]`)
      .classList.add("active");

    // Mostrar contenido correspondiente
    document
      .querySelectorAll(".tab-pane")
      .forEach((p) => p.classList.remove("active"));
    document.getElementById(tabs[indiceTab]).classList.add("active");

    // Cambiar texto de los botones del footer del modal
    ModificarBotonesFooterModal(tabs[indiceTab]);
  }

  function ModificarBotonesFooterModal(tab) {
    btnSiguiente.classList.remove("final");
    switch (tab) {
      case "datos":
        btnAnterior.innerHTML = `Volver al carrito`;
        btnSiguiente.innerHTML = `Siguiente <i class="fa-solid fa-arrow-right"></i>`;
        break;
      case "pago":
        btnAnterior.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Atrás`;
        btnSiguiente.innerHTML = `Siguiente <i class="fa-solid fa-arrow-right"></i>`;
        break;
      case "confirmacion":
        btnAnterior.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Atrás`;
        btnSiguiente.innerHTML = `Finalizar`;
        btnSiguiente.classList.add("final");
        break;
    }
  }

  btnSiguiente.addEventListener("click", () => {
    if (indiceTab < tabs.length - 1) {
      MostrarTab(indiceTab + 1);
    } else {
      // Acá va cuando finalizan la compra, no se olviden de eliminar este comentario
      // cuando hagan la funcionalidad de finalizar la compra a quien le toque
    }
  });

  btnAnterior.addEventListener("click", () => {
    if (indiceTab > 0) {
      MostrarTab(indiceTab - 1);
    } else {
      modal.style.display = "none";
    }
  });

  const vencimientoInput = document.getElementById("vencimiento");

  vencimientoInput.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, "");

    if (valor.length >= 3) {
      valor = valor.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }

    e.target.value = valor.slice(0, 5);
  });

  vencimientoInput.addEventListener("blur", () => {
    const val = vencimientoInput.value;
    const [mes, año] = val.split("/");

    if (mes < 1 || mes > 12 || !año || año.length < 2) {
      vencimientoInput.classList.add("is-invalid");
    } else {
      vencimientoInput.classList.remove("is-invalid");
    }
  });

  /// Selector tipo de envio
  document.addEventListener("click", function (e) {
    if (display.contains(e.target)) {
      opciones.style.display =
        opciones.style.display === "block" ? "none" : "block";
    } else {
      opciones.style.display = "none";
    }
    opcionesItems.forEach((op) => {
      if (op.contains(e.target)) {
        display.innerHTML =
          op.innerText + ' <i class="fa fa-chevron-down ms-auto"></i>';
        opciones.style.display = "none";

        opcionesItems.forEach((o) => o.classList.remove("activo"));
        op.classList.add("activo");

        selectReal.value = op.dataset.value;
      }
    });
  });

  /// Funciones para cambiar y actualizar el subtotal en tiempo real.
  const FACTOR_CONVERSION_PESOS_URUGUAYOS_A_DOLARES = 0.025;
  const INTERVALO_OBSERVACION_CARRITO_MILISEGUNDOS = 100;
  const SIMBOLO_MONEDA_PRINCIPAL = "U$D";

  let ESTADO_ANTERIOR_DEL_CARRITO = JSON.stringify(carrito);

  /// Almacena el carrito en el localStorage como un array JSON.
  function GuardarCarritoEnLocalStorage(carritoActualizado) {
    localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
    ObtenerCantidadDelCarrito(carritoActualizado);
  }

  /// Calcula el subtotal general de los productos en el carrito.
  /// Convierte los precios en pesos uruguayos a dólares para unificar valores.
  function CalcularSubtotalDelCarrito() {
    const SUBTOTAL = carrito.reduce((acumulador, producto) => {
      const CANTIDAD_PRODUCTO = producto.cantidad || 1;
      let costoEnDolares = producto.precio;

      // Conversión de moneda si el producto está en pesos uruguayos (UYU)
      if (producto.moneda === "UYU") {
        costoEnDolares =
          producto.precio * FACTOR_CONVERSION_PESOS_URUGUAYOS_A_DOLARES;
      }

      return acumulador + costoEnDolares * CANTIDAD_PRODUCTO;
    }, 0);

    return SUBTOTAL;
  }

  /// Actualiza el total general mostrado en el DOM dentro del elemento con id "total-precio".
  function ActualizarTotalEnHTML(TOTAL_DEL_CARRITO) {
    const TOTAL_FORMATEADO = TOTAL_DEL_CARRITO.toFixed(0).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );

    const ELEMENTO_TOTAL = document.getElementById("total-precio");

    if (ELEMENTO_TOTAL) {
      ELEMENTO_TOTAL.textContent = `${SIMBOLO_MONEDA_PRINCIPAL} ${TOTAL_FORMATEADO}`;
    }
  }

  /// Observa los cambios en el carrito cada cierto intervalo de tiempo para mantener la vista actualizada.
  function ObservarCambiosEnCarrito() {
    if (carrito.length === 0) return;

    const ESTADO_ACTUAL_DEL_CARRITO = JSON.stringify(carrito);

    if (ESTADO_ACTUAL_DEL_CARRITO !== ESTADO_ANTERIOR_DEL_CARRITO) {
      GuardarCarritoEnLocalStorage(carrito);
      mostrarProductosEnCarrito(carrito);

      const NUEVO_SUBTOTAL = CalcularSubtotalDelCarrito();
      ActualizarTotalEnHTML(NUEVO_SUBTOTAL);

      ESTADO_ANTERIOR_DEL_CARRITO = ESTADO_ACTUAL_DEL_CARRITO;
    }
  }

  // Llamada inicial para asegurar que el total se muestre correctamente al cargar.
  if (carrito.length > 0) {
    const SUBTOTAL_INICIAL = CalcularSubtotalDelCarrito();
    ActualizarTotalEnHTML(SUBTOTAL_INICIAL);
  }

  // Inicia el proceso de observación periódica del carrito.
  setInterval(
    ObservarCambiosEnCarrito,
    INTERVALO_OBSERVACION_CARRITO_MILISEGUNDOS
  );
}); // Fin de DOMContentLoaded
