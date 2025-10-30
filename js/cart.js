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
      <p>${signoMoneda} ${subtotalItem.toLocaleString()}</p>
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
});
