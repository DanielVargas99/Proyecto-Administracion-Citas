// Datos del formulario
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

// UI
const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");

let editando = false;

// Clases

class Citas {

    constructor() {
        this.citas = [];
    }
    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }
    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
    }
    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI {

    // Encargada de imprimir todo tipo de alerta
    imprimirAlerta(mensaje, tipo){

        // Crear el div con las clases de CSS
        const divMensaje = document.createElement("div");
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase de acuerdo al tipo de error
        if (tipo === "error"){
            divMensaje.classList.add('alert-danger');
        }
        else {
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

    limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
   }
}

const ui = new UI();
const administrarCitas = new Citas();

// Event Listeners

eventListeners();
function eventListeners(){
    mascotaInput.addEventListener("input", datosCita);
    propietarioInput.addEventListener("input", datosCita);
    telefonoInput.addEventListener("input", datosCita);
    fechaInput.addEventListener("input", datosCita);
    horaInput.addEventListener("input", datosCita);
    sintomasInput.addEventListener("input", datosCita);
    formulario.addEventListener("submit", nuevaCita);
}

// Objeto con la información de la cita
const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: ""
}

// Funciones

// Asignar los datos al objeto de las citas según el campo correspondiente
function datosCita(e){
    citaObj[e.target.name] = e.target.value;
}

// Crear una nueva cita segun los datos del formulario
function nuevaCita(e){

    e.preventDefault();
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    if (mascota === "" || propietario === "" || telefono === "" || fecha === "" || hora === "" || sintomas === "") {
        ui.imprimirAlerta("Se deben llenar todos los campos", "error");
        return;
    }

    if (editando) {
        // Pasar una copia del objeto citaObj
        administrarCitas.editarCita({...citaObj});

        // Imprimir mensaje de confirmación
        ui.imprimirAlerta("Editado Correctamente");

        // Cambiar el texto del botón del formulario
        formulario.querySelector("button[type='submit']").textContent = "Crear Cita";

        // Reiniciar el valor de editando
        editando = false;
    }
    else{
        // Añadir un ID unico a la cita
        citaObj.id = Date.now();

        // Añadir la cita al arreglo de citas
        administrarCitas.agregarCita({...citaObj});

        // Imprimir mensaje de confirmación
        ui.imprimirAlerta("La cita se creó correctamente");
    }

    // Imprimir la cita en pantalla
    ui.imprimirCitas(administrarCitas);

    // Reiniciar el objeto de la cita tras presionar Submit
    reiniciarObjeto();

    // Reiniciar los campos del formulario
    formulario.reset()
}

function reiniciarObjeto(){
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

function eliminarCita(id){
    // Eliminar la cita
    administrarCitas.eliminarCita(id);

    // Mostrar mensaje de eliminación correcta
    ui.imprimirAlerta("La cita se ha eliminado correctamente");

    // Actualizar la lista de citas
    ui.imprimirCitas(administrarCitas);
}

function cargarEdicion(cita){
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar el formulario con los datos de la cita que se quiere editar
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Asignar al objeto de citas global los datos de la cita que se quiere editar
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector("button[type='submit']").textContent = "Guardar Cambios";
    
    // Activar el modo edición del formulario
    editando = true;
}