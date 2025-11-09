const form = document.getElementById("form");
const msg = document.getElementById("msg");

// Inicializar mapa
const map = L.map("map").setView([-34.906, -56.186], 15);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Función de color por categoría
function color(cat) {
  switch (cat) {
    case "robo":
      return "red";
    case "narcos":
      return "purple";
    case "vandalismo":
      return "orange";
    case "sospechoso":
      return "yellow";
    default:
      return "blue";
  }
}

// Cargar denuncias
async function loadReports() {
  const res = await fetch("/api/reports");
  const data = await res.json();

  data.forEach((r) => {
    const icon = L.divIcon({
      html: `<div style="background:${color(r.category)};width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 0 3px #0003;"></div>`,
      className: "",
      iconSize: [18, 18],
    });

    const marker = L.marker([r.latitude, r.longitude], { icon }).addTo(map);
    marker.bindPopup(`<strong>${r.category.toUpperCase()}</strong><br>${r.location}<br>${r.description}`);
  });
}

// Enviar nueva denuncia
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "⏳ Enviando...";
  const data = {
    location: form.location.value,
    description: form.description.value,
    category: form.category.value,
  };

  const res = await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    msg.textContent = "✅ Denuncia registrada";
    form.reset();
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });
    loadReports();
  } else {
    msg.textContent = "⚠️ Error al enviar denuncia.";
  }
});

loadReports();
