// src/app/page.tsx
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

  const categories = [
    { value: 'robo', label: 'Robo/Atraco' },
    { value: 'narcos', label: 'Venta de drogas' },
    { value: 'sospechoso', label: 'Actividad sospechosa' },
    { value: 'otro', label: 'Otro' },
  ];

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  // 🔥 DEBUG: Log de datos
  console.log('🔥 Enviando:', formData);

  try {
    // 🎯 URL completa para evitar path issues
    const apiUrl = `${window.location.origin}/api/reports`;
    console.log('🎯 Fetching:', apiUrl);

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
      setFormData({ location: '', description: '', category: 'robo' });
      // Scroll suave
      setTimeout(() => {
        document.getElementById('success-message')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    } else {
      setMessage(data.error || `Error ${response.status}: ${data.message || 'Intentá de nuevo'}`);
    }
  } catch (error) {
    console.error('💥 Network error:', error);
    setMessage('Sin conexión real. Chequeá la consola (F12) para más info.');
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                Ubicación
              </label>
              <input
                type="text"
                placeholder="Ej: Paullier entre Rivera y Rodó"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué pasó?
              </label>
              <textarea
                placeholder="Describí lo que viste (máx 280 caracteres para X)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                maxLength={280}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/280 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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

        {/* Mensaje de éxito */}
        {message && (
          <div
            id="success-message"
            className={`p-4 rounded-lg mb-4 ${
              message.includes('gracias') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            }`}
          >
            {message}
          </div>
        )}

        {/* Stats placeholder */}
        <div className="text-center text-gray-500 text-sm">
          <p>Ya hay <span className="font-semibold text-red-600">3</span> reportes activos en Cordón esta semana</p>
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
