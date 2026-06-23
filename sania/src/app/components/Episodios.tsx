import { useState } from 'react';
import { ChevronDown, Grid, Clock, Activity } from 'lucide-react';

export default function Episodios() {
  const [filter, setFilter] = useState<'todos' | 'andres' | 'maty'>('todos');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'ambulatoria', title: 'Atención Ambulatoria' },
    { id: 'urgencias', title: 'Atención de Urgencias' },
    { id: 'hospitalizacion', title: 'Hospitalización' },
    { id: 'examenes', title: 'Exámenes' },
    { id: 'procedimientos', title: 'Procedimientos' }
  ];

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <div className="flex-1 overflow-auto pb-20">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Episodios</h2>
          <p className="text-sm text-gray-500">Timeline de eventos clínicos</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'todos'
                ? 'bg-[#00AEEF] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('andres')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'andres'
                ? 'bg-[#00AEEF] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Andrés
          </button>
          <button
            onClick={() => setFilter('maty')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'maty'
                ? 'bg-[#00AEEF] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Maty
          </button>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-[#00AEEF] transition-colors">
            <Grid className="w-4 h-4" />
            Secciones
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-[#00AEEF] transition-colors">
            <Clock className="w-4 h-4" />
            Últimos
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-[#00AEEF] transition-colors">
            <Activity className="w-4 h-4" />
            Controles
          </button>
        </div>

        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="overflow-hidden rounded-2xl">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full bg-[#4856D6] text-white p-4 flex items-center justify-between hover:bg-[#3D4AC7] transition-colors"
              >
                <span className="font-semibold">{category.title}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    expandedCategory === category.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedCategory === category.id && (
                <div className="bg-white border-x border-b border-gray-200 p-4">
                  <p className="text-gray-500 text-sm text-center py-8">
                    No hay episodios registrados en esta categoría
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
