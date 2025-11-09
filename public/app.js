const form = document.getElementById("form");
const map = L.map("map").setView([-34.906, -56.186], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

async function loadReports() {
  const res = await fetch("/api/reports");
  const reports = await res.json();
  reports.forEach((r) => {
    const color =
      r.category === "robo"
        ? "red"
        : r.category === "narcos"
        ? "purple"
        : r.category === "vandalismo"
        ? "orange"
        : r.category === "sospechoso"
        ? "yellow"
        : "blue";

    const icon = L.divIcon({
      html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;"></div>`,
      className: "",
      iconSize: [14, 14],
    });
    L.marker([r.latitude, r.longitude], { icon })
      .addTo(map)
      .bindPopup(`<b>${r.category}</b><br>${r.location}<br>${r.description}`);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    location: form.location.value,
    description: form.description.value,
    category: form.category.value,
  };
  await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  form.reset();
  loadReports();
});

loadReports();
