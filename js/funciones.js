import Citas from "./classes/Citas.js"
import UI from './classes/UI.js';

import {
    mascotaInput,
    propietarioInput,
    telefonoInput,
    fechaInput,
    horaInput,
    sintomasInput,
    formulario
} from "./selectores.js"

let editando = false;

// Objetos de clases

const ui = new UI();
const administrarCitas = new Citas();

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
export function datosCita(e){
    citaObj[e.target.name] = e.target.value;
}

// Crear una nueva cita segun los datos del formulario
export function nuevaCita(e){

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

export function reiniciarObjeto(){
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

export function eliminarCita(id){
    // Eliminar la cita
    administrarCitas.eliminarCita(id);

    // Mostrar mensaje de eliminación correcta
    ui.imprimirAlerta("La cita se ha eliminado correctamente");

    // Actualizar la lista de citas
    ui.imprimirCitas(administrarCitas);
}

export function cargarEdicion(cita){
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