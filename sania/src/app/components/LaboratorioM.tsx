import { useState } from 'react';
import { ArrowLeft, ChevronDown, FlaskConical, User, Building2, Globe, Phone, FileText, CheckCircle2, AlertCircle, Beaker } from 'lucide-react';
import { labDataSets } from '../data/laboratorioData';

interface LaboratorioMProps {
  onBack: () => void;
  setId?: string;
}

export default function LaboratorioM({ onBack, setId = '001294643' }: LaboratorioMProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  
  const data = labDataSets[setId] || labDataSets['001294643'];

  const toggleItem = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter(i => i !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  return (
    <div className="flex-1 overflow-auto pb-24 bg-gray-50/50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#27AE60] to-[#1E8449] p-6 text-white shadow-lg sticky top-0 z-10 rounded-b-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/90 mb-4 hover:text-white transition-colors group"
        >
          <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Volver al Historial</span>
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Detalle de Examen</h1>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-0.5">Orden #{data.orden}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Lab info */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-green-50 p-2.5 rounded-2xl">
              <Building2 className="w-5 h-5 text-[#27AE60]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg leading-tight">{data.laboratorio.nombre}</h2>
              <p className="text-gray-500 text-xs mt-1">{data.laboratorio.direccion}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-50">
            <a href={`tel:${data.laboratorio.telefono}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#27AE60]">
              <Phone className="w-3.5 h-3.5" />
              {data.laboratorio.telefono}
            </a>
            <a href={`https://${data.laboratorio.sitio_web}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#27AE60]">
              <Globe className="w-3.5 h-3.5" />
              {data.laboratorio.sitio_web}
            </a>
          </div>
        </div>

        {/* Patient info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 gap-y-4">
             <div className="col-span-2 flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-base font-bold text-gray-800">{data.paciente.nombre}</span>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] text-gray-400 uppercase font-black">Documento</p>
                <p className="text-xs text-gray-700 font-bold">{data.paciente.documento_tipo} {data.paciente.documento_numero}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] text-gray-400 uppercase font-black">Edad / Sexo</p>
                <p className="text-xs text-gray-700 font-bold">{data.paciente.edad} / {data.paciente.sexo}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] text-gray-400 uppercase font-black">Fecha Ingreso</p>
                <p className="text-xs text-gray-700 font-bold">{data.fechas.ingreso}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] text-gray-400 uppercase font-black">Convenio</p>
                <p className="text-xs text-gray-700 font-bold line-clamp-1">{data.convenio}</p>
             </div>
          </div>
        </div>

        <div className="space-y-4 pb-10">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-gray-900 font-extrabold text-xl">Resultados</h3>
            <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-1 rounded-md uppercase">
              {data.resultados.length} Pruebas
            </span>
          </div>

          {data.resultados.map((item: any, index: number) => {
            const isExpanded = expandedItems.includes(index);
            const hasAlert = item.observacion?.includes('*') || item.nota?.includes('*');
            
            return (
              <div 
                key={index}
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 ${isExpanded ? 'shadow-md border-green-200' : 'shadow-sm border-gray-100'}`}
              >
                {/* Simplified Header */}
                <div 
                  onClick={() => toggleItem(index)}
                  className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                        {item.muestra}
                      </span>
                      {hasAlert && (
                        <span className="bg-red-50 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Alerta
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 text-base leading-tight pr-4">{item.examen}</h4>
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0">
                    {item.resultado !== undefined && (
                      <div className="text-right">
                        <div className="flex items-baseline gap-1 pt-1">
                          <span className={`text-xl font-black ${hasAlert ? 'text-red-500' : 'text-[#27AE60]'}`}>
                            {item.resultado}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">{item.unidad_medida}</span>
                        </div>
                      </div>
                    )}
                    <div className={`p-1.5 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-green-50 text-[#27AE60]' : 'bg-gray-50 text-gray-400'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Nested Detail Table if exists (Hemograma, etc) */}
                    {item.resultados_detalle && (
                      <div className="bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-100/50 text-[9px] text-gray-400 uppercase font-black text-left">
                              <th className="px-3 py-2">Parámetro</th>
                              <th className="px-3 py-2 text-right">Resultado</th>
                              <th className="px-3 py-2 text-right">Referencia</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Object.entries(item.resultados_detalle).map(([key, val]: [string, any]) => {
                               if (typeof val === 'string') {
                                 return (
                                   <tr key={key}>
                                     <td className="px-3 py-2 text-gray-500 font-bold uppercase text-[9px]">{key}</td>
                                     <td className="px-3 py-2 text-right font-black text-gray-700" colSpan={2}>{val}</td>
                                   </tr>
                                 );
                               }
                               return (
                                <tr key={key} className="hover:bg-white/50 transition-colors">
                                  <td className="px-3 py-2 text-gray-500 font-bold uppercase text-[9px]">{key.replace('_', ' ')}</td>
                                  <td className="px-3 py-2 text-right font-black text-[#27AE60]">
                                    {val.valor} <span className="text-[8px] opacity-60 ml-0.5">{val.unidad}</span>
                                  </td>
                                  <td className="px-3 py-2 text-right text-gray-400 font-medium text-[9px]">{val.rango_ref}</td>
                                </tr>
                               );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Specific handling for Creatinina/VFGe if format is different */}
                    {item.creatinina && (
                       <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 flex justify-between items-center">
                          <p className="text-[10px] text-gray-400 uppercase font-black">Creatinina</p>
                          <p className="text-sm text-gray-700 font-black">{item.creatinina.valor || 'S/D'} <span className="text-xs opacity-50">{item.creatinina.unidad}</span></p>
                       </div>
                    )}
                    {item.VFGe && (
                       <div className="bg-blue-50/30 p-3 rounded-2xl border border-blue-50">
                          <div className="flex justify-between items-center mb-1.5">
                            <p className="text-[10px] text-blue-600 uppercase font-black">VFGe</p>
                            <p className="text-sm text-blue-700 font-black">{item.VFGe.valor || 'S/D'} <span className="text-xs opacity-50">{item.VFGe.unidad}</span></p>
                          </div>
                          <p className="text-[9px] text-blue-400 italic leading-tight">{item.VFGe.nota}</p>
                       </div>
                    )}

                    {/* Standard details */}
                    <div className="grid grid-cols-2 gap-3">
                      {item.resultado_anterior !== null && item.resultado_anterior !== undefined && (
                        <div className="bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
                           <p className="text-[8px] text-gray-400 uppercase font-black mb-1">Anterior</p>
                           <p className="text-xs text-gray-700 font-black">{item.resultado_anterior} <span className="text-[10px] font-medium opacity-50">{item.unidad_medida}</span></p>
                        </div>
                      )}
                      {item.metodo && (
                        <div className="bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
                           <p className="text-[8px] text-gray-400 uppercase font-black mb-1">Método</p>
                           <p className="text-xs text-gray-700 font-bold line-clamp-1">{item.metodo}</p>
                        </div>
                      )}
                    </div>

                    {item.valores_referencia && (
                      <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Beaker className="w-3.5 h-3.5 text-blue-500" />
                          <p className="text-[9px] text-blue-600 uppercase font-black">Valores de Referencia</p>
                        </div>
                        {typeof item.valores_referencia === 'object' ? (
                          <div className="space-y-1.5">
                             {Object.entries(item.valores_referencia).map(([key, val]: [string, any]) => {
                               if (key === 'fuente') return null;
                               return (
                                 <div key={key} className="flex justify-between text-xs border-b border-blue-50/50 pb-1 last:border-0 last:pb-0">
                                   <span className="text-gray-500 capitalize">{key}</span>
                                   <span className="text-gray-900 font-bold">{val}</span>
                                 </div>
                               );
                             })}
                             {item.valores_referencia.fuente && (
                               <p className="text-[8px] text-gray-400 italic mt-2 border-t border-blue-100/50 pt-1.5">Fuente: {item.valores_referencia.fuente}</p>
                             )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-900 font-bold">{item.valores_referencia}</p>
                        )}
                      </div>
                    )}

                    {/* Observations */}
                    {(item.observacion || item.nota) && (
                      <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100/50 flex items-start gap-2.5">
                         <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                         <p className="text-[10px] text-amber-700 leading-normal italic font-medium">{item.observacion || item.nota}</p>
                      </div>
                    )}

                    {/* Validation/Platform info */}
                    <div className="pt-2 border-t border-gray-50 space-y-2">
                       <div className="flex items-center gap-2 text-[9px] text-gray-400 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span>Validado por: <span className="text-gray-600 font-black tracking-normal">{item.validado_por}</span></span>
                       </div>
                       {item.plataforma && item.plataforma !== 'No especificada' && (
                         <div className="flex items-center gap-2 text-[9px] text-gray-400 font-bold">
                            <div className="size-1.5 bg-gray-200 rounded-full" />
                            <span className="line-clamp-1">Plataforma: <span className="text-gray-600 font-black">{item.plataforma}</span></span>
                         </div>
                       )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global notes */}
        {data.notas_generales && (
          <div className="bg-gray-100/50 p-5 rounded-3xl border border-dashed border-gray-200 mb-6">
             <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <p className="text-[10px] text-gray-500 uppercase font-black">Notas Generales</p>
             </div>
             <p className="text-xs text-gray-500 leading-relaxed italic">{data.notas_generales}</p>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center pb-12 border-t border-gray-100 pt-8">
           <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mb-1.5">Director Técnico</p>
           <p className="text-sm text-gray-600 font-black">{data.director_tecnico}</p>
        </div>
      </div>
    </div>
  );
}
