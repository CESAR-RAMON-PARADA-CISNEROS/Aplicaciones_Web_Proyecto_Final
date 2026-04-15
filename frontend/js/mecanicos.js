const url = 'http://localhost:3000/mecanicos';

let editandoId = null;

obtenerMecanicos();

// Obtener datos
async function obtenerMecanicos() {
    const res = await fetch(url, {
        credentials: 'include',
    });

    const data = await res.json();

    const tabla = document.getElementById('tabla_mecanicos');
    tabla.innerHTML = '';

    data.forEach(m => {
        tabla.innerHTML += `
            <tr>
                <td>${m.id}</td>
                <td>${m.nombre}</td>
                <td>${m.direccion}</td>
                <td>${m.telefono}</td>
                <td>${m.fecha_ingreso.split('T')[0]}</td>
                <td>
                    <button class="btn_eliminar" onclick="eliminar(${m.id})">Eliminar</button>
                    <button class="btn_editar" onclick="editar(${m.id}, '${m.nombre}', '${m.direccion}', '${m.telefono}', '${m.fecha_ingreso}')">Editar</button>
                </td>
            </tr>
        `;
    });
}

// Agregar / Modificar
async function agregar() {
    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;
    const fecha_ingreso = document.getElementById('fecha').value;

    if (!nombre || !direccion || !telefono || !fecha_ingreso) {
        alert('Todos los campos son obligatorios');
        return;
    }

    let res;

    if (editandoId) {
        res = await fetch(`${url}/${editandoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                direccion,
                telefono,
                fecha_ingreso
            }),
            credentials: 'include',
        });

        editandoId = null;
        document.querySelector('.btn_agregar').textContent = 'Agregar';
        document.querySelector('.btn_cancelar').style.display = 'inline-block';

    } else {
        res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                direccion,
                telefono,
                fecha_ingreso
            }),
            credentials: 'include',
        });
    }

    if (res.ok) {
        limpiar();
        obtenerMecanicos();
    } else {
        alert('Error al guardar');
    }
}

// Editar
function editar(id, nombre, direccion, telefono, fecha) {
    document.getElementById('nombre').value = nombre;
    document.getElementById('direccion').value = direccion;
    document.getElementById('telefono').value = telefono;
    document.getElementById('fecha').value = fecha.split('T')[0];

    editandoId = id;

    document.querySelector('.btn_agregar').textContent = 'Modificar';
    document.querySelector('.btn_cancelar').style.display = 'inline-block';
}

// Eliminar
async function eliminar(id) {
    if (!confirm('¿Estás seguro de eliminar este mecánico?')) return;

    await fetch(`${url}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    obtenerMecanicos();
}

// Limpiar
function limpiar() {
    document.getElementById('nombre').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('fecha').value = '';
}

// Cancelar
function cancelarEdicion() {
    limpiar();
    editandoId = null;
    document.querySelector('.btn_agregar').textContent = 'Agregar';
    document.querySelector('.btn_cancelar').style.display = 'none';
}

// Cerrar Sesión
async function logout() {
    await fetch('http://localhost:3000/logout', {
        credentials: 'include'
    });

    window.location.replace('login.html');
}