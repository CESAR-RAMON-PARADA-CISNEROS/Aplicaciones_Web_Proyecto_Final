const url = 'http://localhost:3000/clientes';

let editandoId = null;

obtenerClientes();

// Obtener datos
async function obtenerClientes() {
    const res = await fetch(url, {
        credentials: 'include',
    });

    const data = await res.json();

    const tabla = document.getElementById('tabla_clientes');
    tabla.innerHTML = '';

    data.forEach(m => {
        tabla.innerHTML += `
            <tr>
                <td>${m.id}</td>
                <td>${m.nombre}</td>
                <td>${m.telefono}</td>
                <td>${m.auto}</td>
                <td>${m.descripcion_problema}</td>
                <td>
                    <button class="btn_eliminar" onclick="eliminar(${m.id})">Eliminar</button>
                    <button class="btn_editar" onclick="editar(${m.id}, '${m.nombre}', '${m.telefono}', '${m.auto}', '${m.descripcion_problema}')">Editar</button>
                </td>
            </tr>
        `;
    });
}

// Agregar / Modificar
async function agregar() {
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const auto = document.getElementById('auto').value;
    const problema = document.getElementById('problema').value;

    if (!nombre || !telefono || !auto || !problema) {
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
                telefono,
                auto,
                descripcion_problema: problema
            }),
            credentials: 'include',
        });

        editandoId = null;
        document.querySelector('.btn_agregar').textContent = 'Agregar';
        document.querySelector('.btn_cancelar').style.display = 'none';

    } else {
        res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                telefono,
                auto,
                descripcion_problema: problema
            }),
            credentials: 'include',
        });
    }

    if (res.ok) {
        limpiar();
        obtenerClientes();
    } else {
        alert('Error al guardar');
    }
}

// Editar
function editar(id, nombre, telefono, auto, problema) {
    document.getElementById('nombre').value = nombre;
    document.getElementById('telefono').value = telefono;
    document.getElementById('auto').value = auto;
    document.getElementById('problema').value = problema;

    editandoId = id;

    document.querySelector('.btn_agregar').textContent = 'Modificar';
    document.querySelector('.btn_cancelar').style.display = 'inline-block';
}

// Eliminar
async function eliminar(id) {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;

    await fetch(`${url}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    obtenerClientes();
}

// Limpiar
function limpiar() {
    document.getElementById('nombre').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('auto').value = '';
    document.getElementById('problema').value = '';
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