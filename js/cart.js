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
    const inputCostoEnvio = document.getElementById("inputCostoEnvio");
    const inputSubTotal = document.getElementById("inputSubTotal");
    const inputTotal = document.getElementById("inputTotal");


    display.innerHTML = 'Seleccione un tipo de envío <i class="fa fa-chevron-down ms-auto"></i>'; 
    selectReal.value = ""; 

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
        btn.addEventListener("click", (e) => { 
            const tabASeleccionar = btn.getAttribute("data-tab");
            const indiceASeleccionar = tabs.indexOf(tabASeleccionar);
            let puedeAvanzar = true;

            // Validación solo si el usuario intenta SALTAR o AVANZAR a una pestaña mayor
            if (indiceASeleccionar > indiceTab) {
                if (indiceTab === 0) { // Si estamos en "Datos"
                    puedeAvanzar = validarDatosPestana();
                } else if (indiceTab === 1) { // Si estamos en "Pago"
                    puedeAvanzar = validarPagoPestana();
                }
            }

            if (!puedeAvanzar) {
                e.preventDefault(); // Bloquea el cambio de pestaña
                Swal.fire({
                    title: '¡Datos Incompletos!',
                    text: 'Debe completar los datos en la pestaña actual para continuar.',
                    icon: 'warning',
                    confirmButtonText: 'Corregir'
                });
                return;
            }

                // Desactivar botones
            document
                .querySelectorAll(".botonTabs")
                .forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            // Mostrar contenido correspondiente
            document
                .querySelectorAll(".tab-pane")
                .forEach((p) => p.classList.remove("active"));
            document.getElementById(tabASeleccionar).classList.add("active");
            MostrarTab(indiceASeleccionar);
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
        let puedeAvanzar = true;

        if (indiceTab === 0) { // De Datos a Pago
            puedeAvanzar = validarDatosPestana();
        } else if (indiceTab === 1) { // De Pago a Confirmación
            puedeAvanzar = validarPagoPestana();
        }

        // AVANCE O FINALIZACIÓN (solo si la validación pasó)
        if (puedeAvanzar) {
            if (indiceTab < tabs.length - 1) {
                MostrarTab(indiceTab + 1);
            } else {
                if (validarCantidadProductos(carrito)) { 
                    Swal.fire({
                        title: '¡Compra Exitosa!',
                        text: 'Tu pedido ha sido procesado de forma ficticia. ¡Gracias por tu compra!',
                        icon: 'success',
                        confirmButtonText: 'Cerrar'
                    }).then(() => {
                        document.getElementById("concluirCompraModal").style.display = "none";
                    });
                }
            }
        } else {
            // Si la validación falló
            Swal.fire({
                title: '¡Datos Incompletos!',
                text: 'Debe completar los datos en la pestaña actual para continuar.',
                icon: 'warning',
                confirmButtonText: 'Corregir'
            });
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

    // Lógica de Vencimiento 
    vencimientoInput.addEventListener("blur", () => {
        const val = vencimientoInput.value;
        const [mes, año] = val.split("/");
        const errorVencimiento = document.getElementById("errorVencimiento");

        if (val.trim() === "" || mes < 1 || mes > 12 || !año || año.length < 2) {
            vencimientoInput.classList.add("is-invalid");
            if (errorVencimiento) errorVencimiento.textContent = "Debe ingresar una fecha de vencimiento válida (MM/AA).";
        } else {
            vencimientoInput.classList.remove("is-invalid");
            if (errorVencimiento) errorVencimiento.textContent = "";
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
                CalcularCosto(CalcularSubtotalDelCarrito());
            }
        });
    });

    function CalcularCosto(subtotal) {
        let costoEnvio = 0;
        const tipoEnvio = selectReal.value;
        switch (tipoEnvio) {
            case "0":
                costoEnvio = subtotal * 0.05;
                break
            case "1":
                costoEnvio = subtotal * 0.07;
                break
            case "2":
                costoEnvio = subtotal * 0.15;
                break
        }
        inputCostoEnvio.value = `U$D ${costoEnvio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        const totalConEnvio = subtotal + costoEnvio;
        inputSubTotal.value = `U$D ${subtotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        inputTotal.value = `U$D ${totalConEnvio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }

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
            CalcularCosto(NUEVO_SUBTOTAL);

            ESTADO_ANTERIOR_DEL_CARRITO = ESTADO_ACTUAL_DEL_CARRITO;
        }
    }

    // Llamada inicial para asegurar que el total se muestre correctamente al cargar.
    if (carrito.length > 0) {
        const SUBTOTAL_INICIAL = CalcularSubtotalDelCarrito();
        ActualizarTotalEnHTML(SUBTOTAL_INICIAL);
        CalcularCosto(SUBTOTAL_INICIAL);
    }

    // Inicia el proceso de observación periódica del carrito.
    setInterval(
        ObservarCambiosEnCarrito,
        INTERVALO_OBSERVACION_CARRITO_MILISEGUNDOS
    );
}); // Fin de DOMContentLoaded

// FUNCIONES DE VALIDACIÓN 

function validarDatosPestana() {
    let formularioEsValido = true;

    // Limpiar errores previos de envío 
    const errorEnvio = document.getElementById("errorTipoEnvio");
    if (errorEnvio) errorEnvio.textContent = "";

    // VALIDACIÓN DE CAMPOS DE DIRECCIÓN (No vacíos)
    const campos = [
        { id: "departamento", errorId: "errorDepartamento", mensaje: "Debe ingresar el Departamento." },
        { id: "localidad", errorId: "errorLocalidad", mensaje: "Debe ingresar la Localidad." },
        { id: "calle", errorId: "errorCalle", mensaje: "Debe ingresar la Calle." },
        { id: "numero", errorId: "errorNumero", mensaje: "Debe ingresar el Número." },
        { id: "esquina", errorId: "errorEsquina", mensaje: "Debe ingresar la Esquina." },
    ];

    campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const error = document.getElementById(campo.errorId);

        if (input) {
            if (input.value.trim() === "") {
                input.setCustomValidity(campo.mensaje);
                error.textContent = input.validationMessage;
                input.classList.add("is-invalid");
                formularioEsValido = false;
            } else {
                input.setCustomValidity("");
                error.textContent = "";
                input.classList.remove("is-invalid");
            }
        }
    });

    // VALIDACIÓN DE TIPO DE ENVÍO (Seleccionado)
    const selectReal = document.getElementById("selectEnvio");
    if (!selectReal || selectReal.value === "" || selectReal.value === "Seleccione un tipo de envío") {
        if (errorEnvio) errorEnvio.textContent = "Debe seleccionar una forma de envío.";
        formularioEsValido = false;
    }

    return formularioEsValido;
}


function validarPagoPestana() {
    let formularioEsValido = true;

    const errorMetodo = document.getElementById("errorMetodoPago");
    if (errorMetodo) errorMetodo.textContent = "";
    limpiarErroresPago(true);

    // Validar que la forma de pago esté seleccionada
    const metodoPagoSeleccionado = document.querySelector('input[name="metodo"]:checked');

    if (!metodoPagoSeleccionado) {
        if (errorMetodo) errorMetodo.textContent = "Debe seleccionar una forma de pago.";
        return false;
    }

    // Validar los campos específicos del método seleccionado (No vacíos)
    const metodo = metodoPagoSeleccionado.value;
    let campos = [];

    if (metodo === 'tarjeta') {
        campos = [
            { id: "titularTarjeta", errorId: "errorTitular", mensaje: "Falta el titular de la tarjeta." },
            { id: "numeroTarjeta", errorId: "errorNumeroTarjeta", mensaje: "Falta el número de tarjeta." },
            { id: "vencimiento", errorId: "errorVencimiento", mensaje: "Falta la fecha de vencimiento (MM/AA)." },
            { id: "cvcTarjeta", errorId: "errorCVC", mensaje: "Falta el código CVC." },
        ];
    } else if (metodo === 'transferencia') {
        campos = [
            { id: "numeroCuenta", errorId: "errorCuenta", mensaje: "Falta el número de cuenta bancaria." },
        ];
    }

    campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const error = document.getElementById(campo.errorId);

        if (input) {
            if (input.value.trim() === "") {
                input.setCustomValidity(campo.mensaje);
                error.textContent = input.validationMessage;
                input.classList.add("is-invalid");
                formularioEsValido = false;
            } else {
                input.setCustomValidity("");
                error.textContent = "";
                input.classList.remove("is-invalid");
            }
        }
    });
    
    return formularioEsValido;
}

function limpiarErroresPago(limpiarMetodo = false) {
    const todosLosErrores = ["errorTitular", "errorNumeroTarjeta", "errorVencimiento", "errorCVC", "errorCuenta"];
    todosLosErrores.forEach(id => {
        const errorElement = document.getElementById(id);
        if (errorElement) errorElement.textContent = "";
    });
    const todosLosInputs = document.querySelectorAll('#pago input[type="text"]');
    todosLosInputs.forEach(input => input.classList.remove('is-invalid'));
    
    if (limpiarMetodo) {
        const errorMetodo = document.getElementById("errorMetodoPago");
        if (errorMetodo) errorMetodo.textContent = "";
    }
}


// Validación de cantidad de productos
function validarCantidadProductos(carritoActual) {
    if (!carritoActual || carritoActual.length === 0 || carritoActual.some(p => (p.cantidad || 0) <= 0)) {
        Swal.fire('Error de Cantidad', 'Asegúrate de que haya productos en el carrito y que las cantidades sean mayores a 0.', 'error');
        return false;
    }
    return true;
}