fetch('http://localhost:3000/perfil', {
    credentials: 'include'
})
.then(res => {
    if (!res.ok) {
        window.location.href = 'login.html';
    }
    return res.json();
})
.then(data => {
    document.getElementById('usuario').textContent = data.nombre;
});


function logout() {
    fetch('http://localhost:3000/logout', {
        credentials: 'include'
    })
    .then(() => {
        window.location.replace('login.html');
    });
}