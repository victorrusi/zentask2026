// Configuración Supabase
const SUPABASE_URL = "https://victorrusgi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kcGVvenhwZ3RoaXFoemt0cGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjAxNzYsImV4cCI6MjA4NDMzNjE3Nn0.pdcQJGZ8FcNUn77JrOrNWkPJp-_ink9zIjkPwsbu-9U"; // reemplazá con tu anon key real
let currentUser = "";

// Función principal de carga
async function load() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    const data = await res.json();
    console.log("Tareas cargadas:", data);
    renderCalendario(data);
  } catch (err) {
    console.error("Error cargando tareas:", err);
  }
}

// Renderizar tareas en el calendario
function renderCalendario(tasks) {
  const calendario = document.getElementById("calendario");
  calendario.innerHTML = "";

  if (!tasks || tasks.length === 0) {
    calendario.textContent = "No hay tareas cargadas.";
    return;
  }

  // Agrupar por fecha
  const porFecha = {};
  tasks.forEach(t => {
    if (!porFecha[t.task_date]) porFecha[t.task_date] = [];
    porFecha[t.task_date].push(t);
  });

  // Crear tarjetas por día
  Object.keys(porFecha).forEach(fecha => {
    const card = document.createElement("div");
    card.className = "day-card";

    const titulo = document.createElement("h4");
    titulo.textContent = fecha;
    card.appendChild(titulo);

    porFecha[fecha].forEach(t => {
      const item = document.createElement("div");
      item.className = "task-item";
      item.textContent = `${t.name} (${t.duration_minutes} min)`;
      card.appendChild(item);
    });

    calendario.appendChild(card);
  });
}

// Funciones de filtrado
function filtrarSemana(btn) {
  activarBoton(btn);
  alert("Vista semanal (pendiente de implementación)");
}

function toggleMeses(btn) {
  activarBoton(btn);
  alert("Vista mensual (pendiente de implementación)");
}

function filtrarTodo(btn) {
  activarBoton(btn);
  load(); // recarga todas las tareas
}

function activarBoton(btn) {
  document.querySelectorAll(".nav-buttons button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// Exportar a PDF
function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Listado de tareas", 10, 10);
  const tareas = document.querySelectorAll(".task-item");
  let y = 20;
  tareas.forEach(t => {
    doc.text(t.textContent, 10, y);
    y += 10;
  });
  doc.save("tareas.pdf");
}

// Borrar todas las tareas del año
async function borrarTodo() {
  if (!confirm("¿Seguro que quieres borrar todas las tareas del año?")) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    alert("✅ Todas las tareas borradas");
    load();
  } catch (err) {
    console.error("Error borrando tareas:", err);
  }
}
