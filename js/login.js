document.addEventListener("DOMContentLoaded" ,()=>{

    let boton = document.getElementById("login");

    boton.addEventListener("click", (event)=>{
        event.preventDefault(); 
        let user = document.getElementById("user").value.trim();
        let pass = document.getElementById("password").value.trim();

        if (user.length>0 && pass.length>0){
            sessionStorage.setItem("user",user);

            location.href = "products.html";
            }else{
                alert("Falta rellenar Usuario o Contraseña");
            }    
    });
});