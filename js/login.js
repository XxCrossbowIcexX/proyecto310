document.addEventListener("DOMContentLoaded", () => {

    let boton = document.getElementById("login");

    boton.addEventListener("click", (event) => {
        event.preventDefault();
        let email = document.getElementById("email").value.trim();
        let pass = document.getElementById("password").value.trim();
        let mantenerSesion = document.getElementById("mantenerSesion").checked;

        if (email.length > 0 && pass.length > 0) {
            sessionStorage.setItem("sesion", email);
            if (mantenerSesion) {
                localStorage.setItem("sesion", email);
            }
            location.href = "index.html";
        } else {
            alert("Falta rellenar Email o Contraseña");
        }
    });
});