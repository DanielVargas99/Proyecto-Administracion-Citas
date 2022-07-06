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
export let DB;

// Objetos de clases

const ui = new UI();

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
        // Editar Registro

        // Editar el registro en IndexDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        // put es para actualizar
        objectStore.put(citaObj);

        transaction.oncomplete = () => {
            // Imprimir mensaje de confirmación
            ui.imprimirAlerta("Editado Correctamente");

            // Cambiar el texto del botón del formulario
            formulario.querySelector("button[type='submit']").textContent = "Crear Cita";

            // Reiniciar el valor de editando
            editando = false;
        }

        transaction.onerror = () => {
            console.log("Hubo un error al editar los datos de la cita");
        }
    }
    else{
        // Nuevo Registro

        // Añadir un ID unico a la cita
        citaObj.id = Date.now();

        // Añadir el objeto a IndexDB
        let transaction = DB.transaction(['citas'], "readwrite");

        // Habilitar el objectStore
        let objectStore = transaction.objectStore('citas');

        // Agregar a la DB
        objectStore.add(citaObj);

        // En caso de error en la transacción
        transaction.onerror = () => { console.log('Hubo un error al crear la cita'); }

        // En caso de éxito en la transacción
        transaction.oncomplete = () => {
            console.log('Transacción Completada');

            // Imprimir mensaje de confirmación
            ui.imprimirAlerta('La cita se creó correctamente');
        }
    }

    // Imprimir la cita en pantalla
    ui.imprimirCitas();

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

    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    // Eliminar la cita
    objectStore.delete(id);

    transaction.onsuccess = () => {
        // Mostrar mensaje de eliminación correcta
        console.log(`La cita con el id ${id} se eliminó correctamente`);
    }

    transaction.onerror = () => {
        console.log(`Hubo un error al eliminar la cita: ${id}`)
    }

    // Actualizar la lista de citas
    ui.imprimirCitas();
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

export function crearDB(){

    // Crear la base de datos
    const crearDB = window.indexedDB.open("citas", 1.1);

    // Si hay un error
    crearDB.onerror = () => { console.log("Hubo un error al crear la DB"); }

    // Si se crea correctamente
    crearDB.onsuccess = () => {
        console.log("DB Creada")
        DB = crearDB.result; 
        
        // Mostrar las citas guardadas en IndexDB
        ui.imprimirCitas();
    }

    // Definir la estructura de la BD
    crearDB.onupgradeneeded = function(e){
        let db = e.target.result;
        let objectStore = db.createObjectStore('citas', { keyPath: 'id',  autoIncrement: true } );

        // Definir las columnas de la BD
        objectStore.createIndex('id', 'id', { unique: true } );
        objectStore.createIndex('mascota', 'mascota', { unique: false } );
        objectStore.createIndex('propietario', 'propietario', { unique: false } );
        objectStore.createIndex('telefono', 'telefono', { unique: false } );
        objectStore.createIndex('fecha', 'fecha', { unique: false } );
        objectStore.createIndex('hora', 'hora', { unique: false } );
        objectStore.createIndex('sintomas', 'sintomas', { unique: false } );

        console.log("DB creada y lista");
    }
}