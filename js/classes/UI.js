// Mostrar detalles en la interfaz, como alertas o datos de citas

import {eliminarCita, cargarEdicion} from "../funciones.js"
import {contenedorCitas, heading} from "../selectores.js"

class UI {

    // Encargada de imprimir todo tipo de alerta
    imprimirAlerta(mensaje, tipo){

        // Crear el div con las clases de CSS
        const divMensaje = document.createElement("div");
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase de acuerdo al tipo de error
        if (tipo === "error"){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;

        // Agregarlo al DOM
        document.querySelector("#contenido").insertBefore(divMensaje, document.querySelector(".agregar-cita"));

        // Quitar la alerta después de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000)
    }

    // Encargada de mostrar las citas
    imprimirCitas({citas}){

        this.limpiarHTML();
        this.actualizarHeading(citas);

        citas.forEach(cita => {

            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            // Crear el div contenedor de los datos de la cita
            const divCita = document.createElement("div");
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Creación de los elementos de una cita
            const mascotaParrafo = document.createElement("h2");
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement("p");
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder"> Propietario: </span> ${propietario}`;

            const telefonoParrafo = document.createElement("p");
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder"> Telefono: </span> ${telefono}`;

            const fechaParrafo = document.createElement("p");
            fechaParrafo.innerHTML = `<span class="font-weight-bolder"> Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement("p");
            horaParrafo.innerHTML = `<span class="font-weight-bolder"> Hora: </span> ${hora}`;

            const sintomasParrafo = document.createElement("p");
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder"> Síntomas: </span> ${sintomas}`;

            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
            btnEliminar.onclick = () => eliminarCita(id);

            const btnEditar = document.createElement("button");
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
            btnEditar.onclick = () => cargarEdicion(cita);

            // Añadir los elementos de la cita al div de la cita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // Añadir el div de la cita al HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    actualizarHeading(citas){
        if (citas.length > 0){
            heading.textContent = "Administra tus Citas";
        } else {
            heading.textContent = "No hay citas, ¡Crea una nueva!";
        }
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
   }
}

export default UI;