document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'https://coraza-api.onrender.com';

  // Formulario de asociados
  const formAsociado = document.getElementById('form-asociado');

  formAsociado.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cedula = document.getElementById('cedula').value.trim();
    const nombres = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellido').value.trim();
    const zona = document.getElementById('zona').value;
    const fecha_ingreso = document.getElementById('fecha_ingreso').value;

    const nuevoAsociado = {
      cedula,
      nombres,
      apellidos,
      zona: zona ? parseInt(zona) : null,
      fecha_ingreso: fecha_ingreso || null
    };

    console.log('📤 Enviando datos:', nuevoAsociado);

    try {
      const response = await fetch(`${API_BASE}/api/asociados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoAsociado)
      });

      const clonedResponse = response.clone(); // Para evitar el error de doble lectura
      console.log('📦 Respuesta cruda:', clonedResponse);

      let resultado;
      try {
        resultado = await response.json();
      } catch (jsonError) {
        const rawText = await clonedResponse.text();
        console.error('❌ No se pudo parsear JSON. Texto recibido:', rawText);
        alert('⚠️ El servidor respondió con un formato inesperado.');
        return;
      }

      if (response.ok) {
        alert('✅ Asociado registrado correctamente');
        formAsociado.reset();
      } else {
        alert(`⚠️ Error: ${resultado.error || 'Respuesta inesperada del servidor'}`);
      }
    } catch (error) {
      console.error('Error al enviar datos:', error);
      alert('❌ Error de conexión con el servidor');
    }
  });

  // Formulario de entregas
  const formEntrega = document.getElementById('form-entrega');

  formEntrega.addEventListener('submit', async (e) => {
    e.preventDefault();

    const elemento_id = parseInt(document.getElementById('elemento').value);
    const usuario = document.getElementById('usuario').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad').value);

    if (!elemento_id || !usuario || !cantidad || cantidad <= 0) {
      alert('⚠️ Todos los campos son obligatorios y la cantidad debe ser mayor a cero.');
      return;
    }

    const nuevaEntrega = { elemento_id, usuario, cantidad };

    console.log('📤 Enviando entrega:', nuevaEntrega);

    try {
      const response = await fetch(`${API_BASE}/api/entregas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaEntrega)
      });

      const clonedResponse = response.clone();
      console.log('📦 Respuesta cruda:', clonedResponse);

      let resultado;
      try {
        resultado = await response.json();
      } catch (jsonError) {
        const rawText = await clonedResponse.text();
        console.error('❌ No se pudo parsear JSON. Texto recibido:', rawText);
        alert('⚠️ El servidor respondió con un formato inesperado.');
        return;
      }

      if (response.ok) {
        alert('✅ Entrega registrada correctamente');
        formEntrega.reset();
      } else {
        alert(`⚠️ Error: ${resultado.error || 'Respuesta inesperada del servidor'}`);
      }
    } catch (error) {
      console.error('Error al registrar entrega:', error);
      alert('❌ Error de conexión con el servidor');
    }
  });
});