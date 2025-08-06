const apiAsociados = 'https://coraza-api.onrender.com/api/asociados';

document.getElementById('form-asociado').addEventListener('submit', async function (e) {
  e.preventDefault();

  const cedula = document.getElementById('cedula').value;
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const cargo = document.getElementById('cargo').value;

  const nuevoAsociado = {
    cedula,
    nombre,
    apellido,
    cargo
  };

  try {
    const res = await fetch(apiAsociados, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoAsociado)
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById('mensaje').innerText = '✅ Asociado registrado correctamente';
      document.getElementById('form-asociado').reset();
    } else {
      document.getElementById('mensaje').innerText = `❌ Error: ${data.error || 'No se pudo registrar el asociado.'}`;
    }
  } catch (error) {
    document.getElementById('mensaje').innerText = '❌ Error al conectar con el servidor.';
    console.error(error);
  }
});
