(async function () {
    try {
        const res = await fetch('http://localhost:3000/perfil', {
            credentials: 'include'
        });

        if (!res.ok) {
            window.location.replace('login.html');
        }
    } catch (error) {
        window.location.replace('login.html');
    }
})();

window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        window.location.reload();
    }
});