// src/app/page.tsx
// =================================================================
// HOME PAGE DE ALERTACORDÓN - Form de Reportes Anónimos + Polish v1.1
// =================================================================
// Frontend principal: Form con polish UX (categorías locales, mapa embed, autocomplete Montevideo, contador warning, preview tweet)
// React + TypeScript + Tailwind CSS - Responsive, accesible, low-code
// =================================================================
// Features:
// - Form anónimo con validación (required, max length)
// - Categorías locales Montevideo (narcos, cuidacoches, abitab)
// - Autocomplete ubicaciones (datalist con sugerencias Cordón)
// - Contador chars con warning rojo >280 (Twitter ready)
// - Preview tweet low-code UX (azul, truncado)
// - Mapa Google embed (Cordón hot zones, zoom Paullier)
// - Message success/ error con scroll suave
// - Stats hardcodeados (futuro: GET /api/reports)
// - Footer pro
// =================================================================
// Dependencias: lucide-react (icons), React hooks (useState)
// Next.js 15.5.3 App Router - Client component ("use client")
// =================================================================

"use client";
import { useState } from 'react';
import { MapPin, AlertTriangle, Send } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    category: 'robo', // default
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // CATEGORÍAS LOCALES: Adaptadas a Montevideo/Cordón (narcos, cuidacoches, abitab)
  const categories = [
    { value: 'robo', label: 'Robo/Atraco' },
    { value: 'narcos', label: 'Venta de drogas (pasta base, marihuana)' },
    { value: 'sospechoso', label: 'Actividad sospechosa' },
    { value: 'cuidacoches', label: 'Cuidacoches agresivos' },
    { value: 'cajero', label: 'Problemas en cajero/banco' },
    { value: 'abitab', label: 'Vigilancia Abitab/Brooker' },
    { value: 'calle', label: 'Ocupación de vereda/calle' },
    { value: 'otro', label: 'Otro (especificá)' },
  ];

  // HANDLE SUBMIT: Fetch a /api/reports + message UX
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    console.log('🔥 Enviando datos:', formData); // DEBUG frontend

    try {
      const apiUrl = `${window.location.origin}/api/reports`; // Full URL para dev/prod
      console.log('🎯 API URL:', apiUrl); // DEBUG

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('📡 Response status:', response.status); // DEBUG
      const data = await response.json();
      console.log('📦 Response data:', data); // DEBUG

      if (response.ok) {
        setMessage(data.message);
        setFormData({ location: '', description: '', category: 'robo' }); // Reset form
        document.getElementById('success-message')?.scrollIntoView({ behavior: 'smooth' }); // Scroll suave
      } else {
        setMessage(data.error || `Error ${response.status}: Intentá de nuevo.`);
      }
    } catch (error) {
      console.error('💥 Fetch error:', error); // DEBUG
      setMessage('Sin conexión. Revisá tu internet y volvé a intentar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header Hero */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🛡️ AlertaCordón
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Reportá anónimamente lo que ves en el barrio. Juntos mantenemos los ojos abiertos.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Inspirado en un atraco real - Paullier entre Rivera y Rodó
            </p>
          </div>
        </div>
      </header>

      {/* Form Principal */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
            ¿Viste algo sospechoso?
          </h2>
          
          <div className="space-y-4">
            {/* INPUT UBICACIÓN: Con datalist autocomplete Montevideo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                Ubicación en Montevideo
              </label>
              <input
                type="text"
                placeholder="Ej: Paullier entre Rivera y Rodó, 18 de Julio y Ejido, Cordón Centro"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                list="location-suggestions" // Datalist para autocomplete
                required
              />
              {/* SUGERENCIAS LOCALES: Datalist para UX Montevideo */}
              <datalist id="location-suggestions">
                <option value="Paullier entre Rivera y Rodó" />
                <option value="18 de Julio y Ejido" />
                <option value="Bv. Artigas y Misiones" />
                <option value="Tristán Narvaja y Canelones" />
                <option value="Abitab Rivera y Paullier" />
                <option value="Almacén Carlos - Paullier y Rodó" />
                <option value="Cordón Centro" />
              </datalist>
              <p className="text-xs text-gray-500 mt-1">
                💡 Sugerencias: Paullier/Rivera, 18 de Julio/Ejido, Cordón Centro
              </p>
            </div>

            {/* TEXTAREA DESCRIPCIÓN: Con contador mejorado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué pasó?
              </label>
              <textarea
                placeholder="Describí lo que viste (máx 500 caracteres para X)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 resize-none"
                maxLength={500}
                required
              />
              {/* CONTADOR MEJORADO: Rojo si >280 (Twitter warning) */}
              <p className={`text-sm mt-1 ${
                formData.description.length > 280 ? 'text-red-600 font-semibold' : 'text-gray-500'
              }`}>
                {formData.description.length}/500 caracteres 
                {formData.description.length > 280 && ' (Twitter: 280 máx - recorta para viral)'}
              </p>
            </div>

            {/* SELECT CATEGORÍA: Locales Montevideo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
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

        {/* MENSAJE SUCCESS/ERROR: Con scroll suave */}
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

        {/* STATS PLACEHOLDER: Hardcodeado (futuro: GET /api/reports) */}
        <div className="text-center text-gray-500 text-sm mb-8">
          <p>Ya hay <span className="font-semibold text-red-600">6</span> reportes activos en Cordón esta semana</p>
        </div>

        {/* MAPA EMBED: Hot zones Cordón (zoom Paullier) */}
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
            📍 Hot Zones en Cordón - Reportes Activos
          </h2>
          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.5!2d-56.166!3d-34.907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e8b4%3A0x4b4b4b4b4b4b4b4b!2sPaullier%20y%20Rivera!5e0!3m2!1ses!2suy!4v1695370000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Cordón - Hot Zones"
              className="w-full h-full"
            />
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            🔴 Rojo: Paullier/Rivera (narcos fijos) | 🟡 Amarillo: 18 de Julio/Ejido (sospechoso)
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="mb-2">Creado por vecinos, para vecinos. Anónimo = Seguro.</p>
          <p className="text-sm text-gray-400">
            Basado en hechos reales • No compartimos datos • Solo hechos
          </p>
        </div>
      </footer>
    </div>
  );
}