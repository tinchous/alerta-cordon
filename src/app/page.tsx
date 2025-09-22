// src/app/page.tsx
// =================================================================
// HOME PAGE DE ALERTACORDÓN v1.2 - Form Polish + Mapa Interactivo
// =================================================================
// Frontend principal: Form anónimo + Categorías locales + Mapa Leaflet + Preview tweet
// React + TypeScript + Tailwind + Leaflet - Responsive, accesible, Montevideo-ready
// =================================================================
// Features v1.2:
// - Form con validación (required, max 500 chars)
// - 8 categorías locales (narcos, cuidacoches, abitab) con colores
// - Autocomplete ubicaciones Cordón (datalist)// - Contador chars rojo >280 (Twitter warning)
// - Preview tweet low-code (azul, truncado)
// - Mapa Leaflet interactivo: Pins coloreados por categoría + popups
// - Badge preview en select (color dinámico)
// - Message success/error + scroll suave
// =================================================================
// Dependencias: lucide-react (icons), react-leaflet (mapa), React hooks
// Next.js 15.5.3 App Router - Client component ("use client")
// =================================================================

"use client";
import { useState } from 'react';
import { MapPin, AlertTriangle, Send } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// FIX LEAFLET ICONS: Default icons no cargan en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// INTERFACES: TypeScript pro para categorías y reportes
interface Category {
  value: string;
  label: string;
  tailwind: string;
  hex: string;
  description: string;
}

interface Reporte {
  id: number;
  location: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
}

export default function Home() {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    category: 'robo', // default
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // CATEGORÍAS LOCALES: Montevideo/Cordón con colores Tailwind + hex para pins
  const categories: Category[] = [
    { 
      value: 'robo', 
      label: 'Robo/Atraco', 
      tailwind: 'category-robo',
      hex: '#ef4444',  // Rojo
      description: 'Robo con violencia, arrebato, amenaza'
    },
    { 
      value: 'narcos', 
      label: 'Venta de drogas', 
      tailwind: 'category-narcos', 
      hex: '#f97316',  // Naranja
      description: 'Pasta base, marihuana, vigilancia Abitab'
    },
    { 
      value: 'sospechoso', 
      label: 'Actividad sospechosa', 
      tailwind: 'category-sospechoso', 
      hex: '#eab308',  // Amarillo
      description: 'Personas merodeando, comportamiento raro'
    },
    { 
      value: 'cuidacoches', 
      label: 'Cuidacoches agresivos', 
      tailwind: 'category-cuidacoches', 
      hex: '#d97706',  // Ámbar
      description: 'Amenazas, grupos organizados'
    },
    { 
      value: 'cajero', 
      label: 'Problemas en cajero/banco', 
      tailwind: 'category-cajero', 
      hex: '#3b82f6',  // Azul
      description: 'Vigilancia cajeros, Redpagos'
    },
    { 
      value: 'abitab', 
      label: 'Vigilancia Abitab/Brooker', 
      tailwind: 'category-abitab', 
      hex: '#8b5cf6',  // Violeta
      description: 'Personas esperando retiros/pagos'
    },
    { 
      value: 'calle', 
      label: 'Ocupación de vereda/calle', 
      tailwind: 'category-calle', 
      hex: '#22c55e',  // Verde
      description: 'Bloqueo peatonal, comercio ambulante agresivo'
    },
    { 
      value: 'otro', 
      label: 'Otro (especificá)', 
      tailwind: 'category-otro', 
      hex: '#6b7280',  // Gris
      description: 'Situaciones no contempladas'
    },
  ];

  // HELPER: Get categoría por value
  const getCategoryColor = (categoryValue: string): Category => {
    return categories.find(cat => cat.value === categoryValue) || categories[7]; // Default 'otro'
  };

  // HELPER: Badge component con color dinámico
  const CategoryBadge = ({ category }: { category: string }) => {
    const cat = getCategoryColor(category);
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${cat.tailwind}`}>
        {cat.label}
      </span>
    );
  };

  // HANDLE SUBMIT: POST a /api/reports + UX feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    console.log('🔥 Enviando:', formData); // DEBUG

    try {
      const apiUrl = `${window.location.origin}/api/reports`;
      console.log('🎯 API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('📡 Status:', response.status);
      const data = await response.json();
      console.log('📦 Data:', data);

      if (response.ok) {
        setMessage(data.message);
        setFormData({ location: '', description: '', category: 'robo' }); // Reset
        // Scroll suave al mensaje
        setTimeout(() => {
          document.getElementById('success-message')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }, 100);
      } else {
        setMessage(data.error || `Error ${response.status}: Intentá de nuevo.`);
      }
    } catch (error) {
      console.error('💥 Network error:', error);
      setMessage('Sin conexión. Revisá tu internet y volvé a intentar.');
    } finally {
      setLoading(false);
    }
  };

  // MAPA INTERACTIVO: Reportes hardcodeados (futuro: GET /api/reports)
  const reportes: Reporte[] = [
    {
      id: 1,
      location: 'Paullier entre Rivera y Rodó',
      category: 'narcos',
      description: 'Tipos en asientos rústicos vendiendo pasta base, vigilando Abitab',
      lat: -34.9075,
      lng: -56.1668,
    },
    {
      id: 2,
      location: '18 de Julio y Ejido',
      category: 'sospechoso',
      description: '2 personas vigilando cajero 24hs, comportamiento raro',
      lat: -34.9050,
      lng: -56.1690,
    },
    {
      id: 3,
      location: 'Bv. Artigas y Misiones',
      category: 'robo',
      description: 'Atraco moto a peatón - Cuidado al cruzar',
      lat: -34.9100,
      lng: -56.1620,
    },
    {
      id: 4,
      location: 'Tristán Narvaja y Canelones',
      category: 'cuidacoches',
      description: 'Cuidacoches agresivos amenazando peatones',
      lat: -34.9045,
      lng: -56.1645,
    },
  ];

  // COMPONENTE MAPA: Leaflet con pins coloreados
  const MapaInteractivo = () => {
    const center = [-34.9075, -56.1668]; // Cordón centro

    return (
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          📍 Hot Zones en Cordón - {reportes.length} Reportes Activos
        </h2>
        <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
          <MapContainer 
            center={center} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            className="rounded-xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* PINS COLOREADOS POR CATEGORÍA */}
            {reportes.map((reporte) => {
              const color = getCategoryColor(reporte.category);
              const icon = L.divIcon({
                className: 'custom-pin',
                html: `
                  <div class="w-8 h-8 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white text-xs font-bold" 
                       style="background-color: ${color.hex};">
                    ${reporte.id}
                  </div>
                `,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              });

              return (
                <Marker 
                  key={reporte.id} 
                  position={[reporte.lat, reporte.lng]} 
                  icon={icon}
                >
                  <Popup>
                    <div className="min-w-72">
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">{reporte.location}</h3>
                      <div className="mb-3">
                        <CategoryBadge category={reporte.category} />
                      </div>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {reporte.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Reporte #{reporte.id}</span>
                        <span className="text-gray-400">Click para reportar similar</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-gray-600">
            🔴 Narcos | 🟠 Robo | 🟡 Sospechoso | Click pins para detalles
          </p>
          <p className="text-xs text-gray-400 mt-1">
            * Datos simulados - Próximamente reportes reales de la comunidad
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* HEADER HERO */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🛡️ AlertaCordón
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Reportá anónimamente lo que ves en el barrio. Juntos mantenemos los ojos abiertos.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Inspirado en un atraco real - Paullier entre Rivera y Rodó (19/09/25)
            </p>
          </div>
        </div>
      </header>

      {/* FORM PRINCIPAL */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
            ¿Viste algo sospechoso?
          </h2>
          
          <div className="space-y-4">
            {/* INPUT UBICACIÓN: Autocomplete Montevideo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                Ubicación en Montevideo
              </label>
              <input
                type="text"
                placeholder="Ej: Paullier entre Rivera y Rodó, 18 de Julio y Ejido"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                list="location-suggestions"
                required
              />
              {/* AUTOCOMPLETE SUGERENCIAS */}
              <datalist id="location-suggestions">
                <option value="Paullier entre Rivera y Rodó" />
                <option value="18 de Julio y Ejido" />
                <option value="Bv. Artigas y Misiones" />
                <option value="Tristán Narvaja y Canelones" />
                <option value="Abitab Rivera y Paullier" />
                <option value="Almacén Carlos - Paullier y Rodó" />
                <option value="Cordón Centro" />
                <option value="Constituyente y Campero" />
              </datalist>
              <p className="text-xs text-gray-500 mt-1">
                💡 Sugerencias: Paullier/Rivera, 18 de Julio/Ejido, Cordón Centro
              </p>
            </div>

            {/* TEXTAREA DESCRIPCIÓN: Contador + Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué pasó?
              </label>
              <textarea
                placeholder="Describí lo que viste (máx 500 caracteres - 280 para Twitter)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 resize-none"
                maxLength={500}
                required
              />
              {/* CONTADOR MEJORADO */}
              <p className={`text-sm mt-1 ${
                formData.description.length > 280 ? 'text-red-600 font-semibold' : 'text-gray-500'
              }`}>
                {formData.description.length}/500 caracteres 
                {formData.description.length > 280 && ' (Twitter: 280 máx - recorta para viral)'}
              </p>
            </div>

            {/* SELECT CATEGORÍA: Con badge preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white text-gray-900 appearance-none pr-12"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {/* BADGE PREVIEW: Color dinámico */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <CategoryBadge category={formData.category} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💎 El color aparece en el mapa y alertas
              </p>
            </div>
          </div>

          {/* BOTÓN SUBMIT */}
          <button
            type="submit"
            disabled={loading || !formData.location || !formData.description}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>¡Enviar Alerta!</span>
              </>
            )}
          </button>
        </form>

        {/* MESSAGE SUCCESS/ERROR */}
        {message && (
          <div 
            id="success-message"
            className={`p-4 rounded-lg mb-4 ${
              message.includes('enviada') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            }`}
          >
            {message}
          </div>
        )}

        {/* PREVIEW TWEET: Low-code UX */}
        {formData.description.length > 0 && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-semibold mb-2">📱 Preview para X (Twitter):</p>
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-blue-900">
                🚨 ALERTA CORDÓN: <strong>{formData.location}</strong> -{' '}
                <CategoryBadge category={formData.category} />
                <br />
                <span className="text-gray-600">
                  {formData.description.substring(0, 100)}
                  {formData.description.length > 100 && '...'}
                </span>
              </p>
            </div>
            <p className={`text-xs mt-2 ${
              formData.description.length > 280 ? 'text-red-600' : 'text-blue-600'
            }`}>
              {formData.description.length > 280 ? '✂️ Acortar para Twitter (280 máx)' : '✅ Listo para publicar'}
            </p>
          </div>
        )}

        {/* STATS */}
        <div className="text-center text-gray-500 text-sm mb-8">
          <p>Ya hay <span className="font-semibold text-red-600">6</span> reportes activos en Cordón esta semana</p>
        </div>
      </main>

      {/* MAPA INTERACTIVO */}
      <MapaInteractivo />

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="mb-2">Creado por vecinos, para vecinos. Anónimo = Seguro.</p>
          <p className="text-sm text-gray-400">
            Basado en hechos reales • No compartimos datos • Solo hechos
          </p>
          <p className="text-xs text-gray-500 mt-2">
            © 2025 AlertaCordón - Montevideo, Uruguay
          </p>
        </div>
      </footer>
    </div>
  );
}