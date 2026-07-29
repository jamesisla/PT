import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Scale } from 'lucide-react';
import { PesoRegistro } from '../data/petData';

interface PesoGraficoProps {
  data: PesoRegistro[];
  pesoActual: string;
}

export default function PesoGrafico({ data, pesoActual }: PesoGraficoProps) {
  if (!data || data.length < 2) {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="bg-orange-50 p-2 rounded-xl">
              <Scale className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm leading-none mb-1">Evolución de Peso</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Historial biométrico</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 font-bold block">Actual</span>
            <span className="text-lg font-black text-gray-900 leading-none">{pesoActual}</span>
          </div>
        </div>
        <div className="py-6 text-center border border-dashed border-gray-100 rounded-2xl bg-gray-50/50 mt-2">
          <p className="text-xs text-gray-500 font-bold">Se requieren al menos 2 registros de peso</p>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Agrega más mediciones para visualizar la gráfica de evolución.</p>
        </div>
      </div>
    );
  }

  // Extract numerical values for min/max calculations
  const weights = data.map(d => d.peso);
  const minWeight = Math.floor(Math.min(...weights) - 0.5);
  const maxWeight = Math.ceil(Math.max(...weights) + 0.5);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-orange-50 p-2 rounded-xl">
            <Scale className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm leading-none mb-1">Evolución de Peso</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Historial biométrico</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 font-bold block">Actual</span>
          <span className="text-lg font-black text-gray-900 leading-none">{pesoActual}</span>
        </div>
      </div>

      <div className="w-full h-40 -ml-4 pr-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#00AEEF" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="fecha" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}
            />
            <YAxis 
              domain={[minWeight, maxWeight]}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}
              width={25}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #f3f4f6', 
                borderRadius: '16px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                fontFamily: 'Inter, sans-serif'
              }}
              labelStyle={{ fontWeight: 'bold', fontSize: 11, color: '#374151' }}
              itemStyle={{ fontWeight: 'black', fontSize: 12, color: '#00AEEF', padding: 0 }}
              formatter={(value: any) => [`${value} kg`, 'Peso']}
            />
            <Area 
              type="monotone" 
              dataKey="peso" 
              stroke="#00AEEF" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorPeso)" 
              dot={{ stroke: '#00AEEF', strokeWidth: 2, fill: '#ffffff', r: 4 }}
              activeDot={{ stroke: '#00AEEF', strokeWidth: 2, fill: '#00AEEF', r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
