// api/reports.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function geocode(location) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location + ", Montevideo, Uruguay"
      )}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (err) {
    console.error("Error geocodificando:", err);
  }
  // fallback a Cordón
  return { lat: -34.906, lng: -56.186 };
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const reports = await prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      return res.status(200).json(reports);
    } catch (error) {
      console.error("Error listando reportes:", error);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
  }

  if (req.method === "POST") {
    try {
      const { location, description, category } = req.body;
      if (!location || !description) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
      }

      const { lat, lng } = await geocode(location);

      const report = await prisma.report.create({
        data: {
          location,
          description,
          category: category || "otros",
          latitude: lat,
          longitude: lng,
        },
      });

      return res.status(201).json(report);
    } catch (error) {
      console.error("Error creando reporte:", error);
      return res.status(500).json({ error: "Error creando reporte" });
    }
  }

  res.status(405).json({ error: "Método no permitido" });
}
