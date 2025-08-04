const apiAsociados = 'https://coraza-api.onrender.com/api/asociados';
const apiInventario = 'https://coraza-api.onrender.com/api/inventario';
const apiEntregas = 'https://coraza-api.onrender.com/api/entregas';

const elementos = ["kepis", "goleana", "pantalon", "overol", "camisa", "botas", "corbata", "moña", "riata", "botas pantanera"];

// ------------------ Navegación por pestañas ------------------

function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";

  if (id === "inventario") cargarInventario();
  if (id === "asociados") cargarAsociados();
}

// ------------------ Asociados ------------------

document.getElementById("formAsociado").addEventListener("submit", async (e) => {
  e.preventDefault();
  const asociado = {
    cedula: document.getElementById("cedula").value,
    nombre: document.getElementById("nombre").value,
    cargo: document.getElementById("cargo").value,
    empresa: document.getElementById("empresa").value
  };
  await fetch(apiAsociados, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(asociado)
  });
  e.target.reset();
  cargarAsociados();
});

async function cargarAsociados() {
  const res = await fetch(apiAsociados);
  const asociados = await res.json();
  const contenedor = document.getElementById("listaAsociados");
  contenedor.innerHTML = asociados.map(a => `
    <div class="card">
      <strong>${a.nombre}</strong><br>
      Cédula: ${a.cedula}<br>
      Cargo: ${a.cargo}<br>
      Empresa: ${a.empresa}<br>
    </div>
  `).join('');
}

// ------------------ Inventario ------------------

async function cargarInventario() {
  const res = await fetch(apiInventario);
  const inventario = await res.json();
  const tabla = document.getElementById("tablaInventario");
  tabla.innerHTML = `
    <table><thead><tr>${elementos.map(e => `<th>${e}</th>`).join('')}</tr></thead>
    <tbody><tr>${elementos.map(e => `<td>${inventario[e] || 0}</td>`).join('')}</tr></tbody></table>
  `;
}

// ------------------ Ingreso de Dotación ------------------

document.getElementById("itemsDotacionIngreso").innerHTML = elementos.map(e => `
  <label>${e}: <input type="number" min="0" name="${e}" value="0" /></label>
`).join("<br>");

document.getElementById("formIngreso").addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = {};
  elementos.forEach(el => {
    const cantidad = parseInt(e.target[el].value) || 0;
    if (cantidad > 0) datos[el] = cantidad;
  });
  await fetch(apiInventario, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  alert("Ingreso registrado");
  e.target.reset();
  cargarInventario();
});

// ------------------ Entrega de Dotación ------------------

document.getElementById("itemsDotacionEntrega").innerHTML = elementos.map(e => `
  <label>${e}: <input type="number" min="0" name="${e}" value="0" /></label>
`).join("<br>");

document.getElementById("formEntrega").addEventListener("submit", async (e) => {
  e.preventDefault();
  const cedula = document.getElementById("cedulaEntrega").value;
  const entrega = { cedula, items: {} };
  elementos.forEach(el => {
    const cantidad = parseInt(e.target[el].value) || 0;
    if (cantidad > 0) entrega.items[el] = cantidad;
  });
  await fetch(apiEntregas, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entrega)
  });
  alert("Dotación asignada");
  e.target.reset();
  cargarInventario();
});

// ------------------ Historial ------------------

async function cargarHistorial() {
  const cedula = document.getElementById("cedulaHistorial").value;
  if (!cedula) return alert("Ingresa una cédula");
  const res = await fetch(`${apiEntregas}?cedula=${cedula}`);
  const historial = await res.json();
  const contenedor = document.getElementById("resultadoHistorial");
  if (historial.length === 0) {
    contenedor.innerHTML = "No hay entregas registradas.";
    return;
  }
  contenedor.innerHTML = historial.map(entrega => `
    <div class="card">
      <strong>Fecha:</strong> ${new Date(entrega.fecha).toLocaleDateString()}<br>
      ${Object.entries(entrega.items).map(([item, cantidad]) =>
        `<span>${item}: ${cantidad}</span>`).join("<br>")}
    </div>
  `).join("");
}
