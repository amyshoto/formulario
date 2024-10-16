    // Función para agregar tarea
    const agregarTarea = async () => {
        const nombre = document.querySelector('#nombre').value;
        const materia = document.querySelector('#materia').value; // Campo de materia
        const descripcion = document.querySelector('#nuevaTarea').value;

        const response = await fetch('http://localhost:3000/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, materia, descripcion }), // Enviamos todos los datos
        });

        const tarea = await response.json();
        
        // Imprimir en consola la tarea que se agregó
        console.log('Tarea agregada:', tarea);

        agregarTareaALista(tarea);
        document.querySelector('#nombre').value = ''; // Limpiar el input de nombre
        document.querySelector('#materia').value = ''; // Limpiar el input de materia
        document.querySelector('#nuevaTarea').value = ''; // Limpiar el input de tarea
    };

    // Función para obtener y mostrar tareas
    const obtenerTareas = async () => {
        const response = await fetch('http://localhost:3000/tareas');
        const data = await response.json();

        // Imprimir en consola las tareas recuperadas
        console.log('Tareas recuperadas:', data.tareas);

        if (data.tareas && data.tareas.length > 0) {
            data.tareas.forEach((tarea) => agregarTareaALista(tarea));
        } else {
            console.log('No hay tareas disponibles.');
        }
    };
    
    // Función para agregar tarea a la lista visualmente
    const agregarTareaALista = (tarea) => {
        const lista = document.querySelector('#listaTareas');
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${tarea.nombre}</strong> (${tarea.materia}): ${tarea.descripcion}</span>
            <button class="delete" onclick="eliminarTarea(${tarea.id}, this)">Eliminar</button>
        `;
        lista.appendChild(li);
    };
    
    // Función para eliminar tarea
    const eliminarTarea = async (id, elemento) => {
        const response = await fetch(`http://localhost:3000/tareas/${id}`, {
        method: 'DELETE',
        });
    
        if (response.ok) {
        const li = elemento.parentNode;
        li.parentNode.removeChild(li); // Eliminar la tarea de la interfaz
        } else {
        alert('Error al eliminar la tarea');
        }
    };
    
    // Cargar las tareas cuando se cargue la página
    document.addEventListener('DOMContentLoaded', obtenerTareas);
  