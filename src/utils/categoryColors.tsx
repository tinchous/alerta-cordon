// src/utils/categoryColors.ts - Colores por categoría Alertacordón
// =================================================================
// Mapea categorías a colores Tailwind + hex para Leaflet pins
// Uso: Badges, mapa, emails, dashboard
// =================================================================

export interface CategoryColor {
  value: string;
  label: string;
  tailwind: string;  // Para CSS classes
  hex: string;       // Para Leaflet pins
  description: string;
}

export const categories = [
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
] as CategoryColor[];

// Función helper: Get color por value
export const getCategoryColor = (category: string): CategoryColor => {
  return categories.find(cat => cat.value === category) || categories[7]; // Default 'otro'
};

// Función helper: Badge component
export const CategoryBadge = ({ category }: { category: string }) => {
  const cat = getCategoryColor(category);
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${cat.tailwind}`}>
      {cat.label}
    </span>
  );
};