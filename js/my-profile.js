document.addEventListener("DOMContentLoaded", () => {
  const email = document.getElementById("email");
  const nombre = document.getElementById("nombre");
  const apellido = document.getElementById("apellido");
  const telefono = document.getElementById("telefono");
  const form = document.getElementById("perfilForm");
  const btnActualizarPerfil = document.querySelector(".btnActualizarPerfil");

  // Traer datos guardados
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};

  // El formulario empezará vacío siempre
  email.value = "";
  nombre.value = "";
  if (apellido) apellido.value = "";
  if (telefono) telefono.value = "";

  if (usuario.email) email.value = usuario.email;
  if (usuario.nombre) nombre.value = usuario.nombre;
  if (usuario.apellido) apellido.value = usuario.apellido;
  if (usuario.telefono) telefono.value = usuario.telefono;

  function GuardarDatos() {
    if (!form.checkValidity()) {
      // Si no es válido, mostrar validación visual y NO guardar
      form.classList.add("was-validated");
      return false;
    }

    // Solo si el formulario es válido, guardar los datos
    usuario.email = email.value;
    usuario.nombre = nombre.value;
    usuario.apellido = apellido.value;
    usuario.telefono = telefono.value;

    localStorage.setItem("usuario", JSON.stringify(usuario));
    Swal.fire({
      title: "¡Éxito!",
      text: "Datos actualizados correctamente.",
      icon: "success",
      timer: 3000,
      showConfirmButton: true,
      confirmButtonColor: "var(--color_principal)",
      confirmButtonText: "Aceptar",
    });
    return true;
  }

  // Guardar cambios al enviar el formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    GuardarDatos();
  });

  if (btnActualizarPerfil) {
    btnActualizarPerfil.addEventListener("click", (e) => {
      e.preventDefault();
      GuardarDatos();
    });
  }
});

// Función para validar email
function ValidarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Cerrar sesión
document.addEventListener("click", (e) => {
  if (e.target.id === "logout") {
    localStorage.removeItem("usuario");

    setTimeout(() => {
      window.location.href = "/login.html";

    },50);

    return true;
  }
});
