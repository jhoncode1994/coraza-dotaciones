
function mostrarMensajeForm(msg, tipo = "error") {
  let div = document.getElementById("form-mensaje");
  if (!div) {
    div = document.createElement("div");
    div.id = "form-mensaje";
    const form = document.getElementById("form-asociado");
    if (form) form.parentNode.insertBefore(div, form);
  }
  div.textContent = msg || "";
  div.style.color = tipo === "error" ? "#b71c1c" : "#33691e";
  div.style.margin = msg ? "10px 0" : "0";
}

function limpiarMensajeForm() {
  mostrarMensajeForm("");
}

function validarCampos() {
  const nombre = document.getElementById("new-nombre")?.value.trim();
  const cedula = document.getElementById("new-cedula")?.value.trim();
  const fechaIngreso = document.getElementById("new-fecha-ingreso")?.value;
  const btnGuardar = document.getElementById("btn-guardar");
  let valido = true;
  let mensaje = "";

  if (!nombre) {
    valido = false;
    mensaje = "El nombre es obligatorio.";
  } else if (!cedula) {
    valido = false;
    mensaje = "La cédula es obligatoria.";
  } else if (!/^[0-9]+$/.test(cedula)) {
    valido = false;
    mensaje = "La cédula solo debe contener números.";
  } else if (!fechaIngreso) {
    valido = false;
    mensaje = "La fecha de ingreso es obligatoria.";
  } else {
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fecha = new Date(fechaIngreso);
    if (fecha < hoy) {
      valido = false;
      mensaje = "La fecha de ingreso debe ser hoy o una fecha futura.";
    }
  }

  if (btnGuardar) btnGuardar.disabled = !valido;
  mostrarMensajeForm(mensaje, valido ? "ok" : "error");
  return valido;
}

// Validar en tiempo real
function agregarListenersValidacion() {
  ["new-nombre", "new-cedula", "new-fecha-ingreso"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", validarCampos);
    }
  });
}

// Forzar solo números en cédula
function soloNumerosCedula() {
  const cedulaInput = document.getElementById("new-cedula");
  if (cedulaInput) {
    cedulaInput.addEventListener("input", function(e) {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  }
}

async function saveAssociate(e) {
  e.preventDefault();

  limpiarMensajeForm();
  if (!validarCampos()) {
    mostrarMensajeForm("Por favor complete todos los campos correctamente.");
    return;
  }

  const nombre = document.getElementById("new-nombre")?.value.trim();
  const cedula = document.getElementById("new-cedula")?.value.trim();
  const fechaIngreso = document.getElementById("new-fecha-ingreso")?.value;

  const asociado = {
    nombre,
    cedula,
    fecha_ingreso: fechaIngreso
  };

  try {
    const url = modoEdicion
      ? `http://localhost:3000/api/asociados/${cedulaOriginal}`
      : "http://localhost:3000/api/asociados";

    const method = modoEdicion ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(asociado)
    });

    if (!response.ok) {
      const errorText = await response.text();
      mostrarMensajeForm(errorText || "Error al guardar en el servidor");
      throw new Error(errorText);
    }

    mostrarMensajeForm(modoEdicion ? "Asociado actualizado correctamente" : "Asociado creado correctamente", "ok");

    document.getElementById("form-asociado").reset?.();
    modoEdicion = false;
    cedulaOriginal = null;

    cargarAsociados();
    validarCampos(); // Para deshabilitar el botón tras limpiar
    setTimeout(limpiarMensajeForm, 2000);
  } catch (error) {
    console.error("Error al guardar asociado:", error);
    mostrarMensajeForm("Error al guardar el asociado en el servidor");
  }
}


// Mostrar todos los asociados al cargar
async function cargarAsociados() {
  try {
    const response = await fetch("http://localhost:3000/api/asociados");
    if (!response.ok) throw new Error("Error al obtener asociados");
    const asociados = await response.json();

    const tabla = document.getElementById("tabla-asociados");
    tabla.innerHTML = "";

    asociados.forEach(asociado => {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${asociado.nombre}</td>
    <td>${asociado.cedula}</td>
    <td>${asociado.fecha_ingreso ? asociado.fecha_ingreso.split("T")[0] : ""}</td>
    <td>
      <button onclick="editarAsociado('${asociado.cedula}')">✏️</button>
      <button onclick="eliminarAsociado('${asociado.cedula}')">🗑️</button>
    </td>
  `;
  tabla.appendChild(fila);
});

  } catch (error) {
    console.error("Error al cargar asociados:", error);
  }
}


window.addEventListener("DOMContentLoaded", () => {
  cargarAsociados();
  agregarListenersValidacion();
  soloNumerosCedula();
  validarCampos();
});

let modoEdicion = false;
let cedulaOriginal = null;

function editarAsociado(cedula) {
  const fila = [...document.querySelectorAll("#tabla-asociados tr")].find(f => f.cells[1].textContent === cedula);
  if (fila) {
    document.getElementById("new-nombre").value = fila.cells[0].textContent;
    document.getElementById("new-cedula").value = fila.cells[1].textContent;
    document.getElementById("new-fecha-ingreso").value = fila.cells[2].textContent;
    modoEdicion = true;
    cedulaOriginal = cedula;
  }
}

async function eliminarAsociado(cedula) {
  if (!confirm("¿Estás seguro de eliminar este asociado?")) return;

  try {
    const response = await fetch(`http://localhost:3000/api/asociados/${cedula}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Error al eliminar");

    mostrarMensajeForm("Asociado eliminado correctamente", "ok");
    cargarAsociados();
    setTimeout(limpiarMensajeForm, 2000);
  } catch (error) {
    console.error("Error al eliminar asociado:", error);
    mostrarMensajeForm("Hubo un error al eliminar");
  }
}
