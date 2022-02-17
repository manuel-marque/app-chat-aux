const socket = io();

// Recuperar los elementos del DOM

const mensaje = document.getElementById('mensajes');
const inputNombre = document.getElementById('inputNombre');
const inputMensaje = document.getElementById('inputMensaje');
const btnEnviar = document.getElementById('btnEnviar');
const numUsuarios = document.getElementById('numUsuarios');


// click del boton

btnEnviar.addEventListener('click', () => {
    const data = {
        nombre: inputNombre.value,
        mensaje: inputMensaje.value
    }
    socket.emit('mensaje_chat', data);
    // console.log(data);

});

// Captura de eventos

socket.on('mensaje_chat', (data) => {
    console.log(data);
    const li = document.createElement('li');
    li.innerHTML = `<strong>${data.nombre}: </strong>${data.mensaje}`;

    if(data.tipo === 'admin') {
        // li.classList.add('admin');
        li.style.color = 'black';

    } 



    mensaje.appendChild(li);

});

socket.on('usuarios_chat', data => {
    //En el HTML generar un h3 con el id numUsuarios
    //dentro de este evento, modificamos el h3 con el numero de usuarios recibidos del servidor
    numUsuarios.innerText = `Usuarios: ${data}`;

})