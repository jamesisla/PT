import { useState, useRef } from 'react';
import { ClipboardList, Scale, Syringe, Calendar, Bell, X, Check, Pill, Stethoscope, Bug, FlaskConical, Image as ImageIcon, ArrowLeft, AlertTriangle } from 'lucide-react';

interface AddMenuProps {
  onClose: () => void;
  onAddRecord: (type: string, record: any) => void;
  initialOption?: string | null;
}

export default function AddMenu({ onClose, onAddRecord, initialOption = null }: AddMenuProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(initialOption);
  
  // Form states
  const [sintoma, setSintoma] = useState('');
  const [sintomaEstado, setSintomaEstado] = useState<'Normal' | 'Atención' | 'Alerta'>('Normal');
  const [sintomaNota, setSintomaNota] = useState('');
  
  const [peso, setPeso] = useState('');
  const [vacunaNombre, setVacunaNombre] = useState('');
  const [vacunaLote, setVacunaLote] = useState('');
  const [vacunaProxima, setVacunaProxima] = useState('');
  
  const [alertaTitulo, setAlertaTitulo] = useState('');
  const [alertaDesc, setAlertaDesc] = useState('');
  const [alertaTipo, setAlertaTipo] = useState<'critica' | 'preventiva'>('preventiva');

  const [medNombre, setMedNombre] = useState('');
  const [medDosis, setMedDosis] = useState('');
  const [medFrecuencia, setMedFrecuencia] = useState('');
  const [medDuracion, setMedDuracion] = useState('');
  const [medVeterinario, setMedVeterinario] = useState('');

  const [diagTipo, setDiagTipo] = useState<'Consulta General' | 'Urgencia' | 'Especialidad'>('Consulta General');
  const [diagDescripcion, setDiagDescripcion] = useState('');
  const [diagDoctor, setDiagDoctor] = useState('');
  const [diagEstado, setDiagEstado] = useState('Resuelto');
  const [diagClinica, setDiagClinica] = useState('');

  const [despTipo, setDespTipo] = useState<'Interna' | 'Externa'>('Interna');
  const [despProducto, setDespProducto] = useState('');
  const [despDosis, setDespDosis] = useState('');
  const [despPesoMascota, setDespPesoMascota] = useState('');
  const [despProximaFecha, setDespProximaFecha] = useState('');
  const [despVeterinario, setDespVeterinario] = useState('');

  // Lab Form states
  const [labExamen, setLabExamen] = useState('');
  const [labLaboratorio, setLabLaboratorio] = useState('');
  const [labTelefono, setLabTelefono] = useState('');
  const [labSitioWeb, setLabSitioWeb] = useState('');
  const [labDireccion, setLabDireccion] = useState('');
  const [labConvenio, setLabConvenio] = useState('');
  const [labDirectorTecnico, setLabDirectorTecnico] = useState('');
  const [labNotasGenerales, setLabNotasGenerales] = useState('');
  const [labParamNombre, setLabParamNombre] = useState('');
  const [labParamResultado, setLabParamResultado] = useState('');
  const [labParamUnidad, setLabParamUnidad] = useState('');
  const [labParamRango, setLabParamRango] = useState('');
  const [labParamEstado, setLabParamEstado] = useState<'Normal' | 'Alto' | 'Bajo'>('Normal');
  const [labResultados, setLabResultados] = useState<any[]>([]);

  // Image Form states
  const [imgTipo, setImgTipo] = useState<'Radiografía' | 'Ecografía' | 'Endoscopía'>('Radiografía');
  const [imgNombre, setImgNombre] = useState('');
  const [imgIndicacion, setImgIndicacion] = useState('');
  const [imgInforme, setImgInforme] = useState('');
  const [imgDoctor, setImgDoctor] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);

  const [customDate, setCustomDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset * 60 * 1000));
    return localToday.toISOString().split('T')[0];
  });

  const formatToESDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatWeightDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthIndex = parseInt(month, 10) - 1;
    const shortYear = year.slice(-2);
    return `${months[monthIndex]} ${shortYear}`;
  };

  function CustomDatePicker({ value, onChange, label, isWeight }: { value: string; onChange: (val: string) => void; label: string; isWeight?: boolean }) {
    const dateInputRef = useRef<HTMLInputElement>(null);

    const displayValue = isWeight ? formatWeightDate(value) : formatToESDate(value);

    const triggerCalendar = () => {
      if (dateInputRef.current) {
        if (typeof dateInputRef.current.showPicker === 'function') {
          try {
            dateInputRef.current.showPicker();
          } catch {
            dateInputRef.current.focus();
          }
        } else {
          dateInputRef.current.focus();
        }
      }
    };

    return (
      <div className="space-y-1">
        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
          {label}
        </label>
        <div 
          onClick={triggerCalendar}
          className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-[#00AEEF] transition-colors group"
        >
          <span className="text-xs font-black text-gray-800 flex-1">
            {displayValue} <span className="text-[10px] font-semibold text-[#00AEEF] ml-1.5">(DD/MM/YYYY)</span>
          </span>
          <Calendar className="w-4 h-4 text-[#00AEEF] group-hover:scale-110 transition-transform" />
          <input 
            ref={dateInputRef}
            type="date" 
            value={value}
            onChange={e => {
              if (e.target.value) onChange(e.target.value);
            }}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </div>
      </div>
    );
  }

  const options = [
    {
      id: 'sintoma',
      icon: ClipboardList,
      title: 'Registrar Síntoma',
      subtitle: 'Anotar observaciones cotidianas',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'peso',
      icon: Scale,
      title: 'Registrar Peso',
      subtitle: 'Controlar peso y crecimiento',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      id: 'vacuna',
      icon: Syringe,
      title: 'Registrar Vacuna',
      subtitle: 'Historial de inmunizaciones',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'alerta',
      icon: Bell,
      title: 'Agendar Recordatorio',
      subtitle: 'Alertas y citas próximas',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      id: 'medicamento',
      icon: Pill,
      title: 'Registrar Tratamiento',
      subtitle: 'Prescripción o suplemento',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      id: 'diagnostico',
      icon: Stethoscope,
      title: 'Registrar Consulta',
      subtitle: 'Historial y diagnóstico clínico',
      color: 'bg-teal-50 text-teal-600'
    },
    {
      id: 'desparasitacion',
      icon: Bug,
      title: 'Registrar Desparasitación',
      subtitle: 'Control interno o externo',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      id: 'laboratorio',
      icon: FlaskConical,
      title: 'Registrar Laboratorio',
      subtitle: 'Exámenes y análisis clínicos',
      color: 'bg-rose-50 text-rose-600'
    },
    {
      id: 'imagen',
      icon: ImageIcon,
      title: 'Registrar Imagen',
      subtitle: 'Ecografías y radiografías',
      color: 'bg-cyan-50 text-cyan-600'
    },
    {
      id: 'mascota-perdida',
      icon: AlertTriangle,
      title: 'Reportar Mascota Perdida (SOS)',
      subtitle: 'Alerta y búsqueda comunitaria en mapa',
      color: 'bg-red-50 text-red-600 border border-red-200'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let record: any = {};
    const dateStr = formatToESDate(customDate);

    if (selectedOption === 'sintoma') {
      if (!sintoma) return;
      record = {
        id: Date.now(),
        fecha: dateStr,
        sintoma,
        estado: sintomaEstado,
        nota: sintomaNota
      };
    } else if (selectedOption === 'peso') {
      if (!peso) return;
      record = {
        fecha: formatWeightDate(customDate),
        peso: parseFloat(peso)
      };
    } else if (selectedOption === 'vacuna') {
      if (!vacunaNombre) return;
      record = {
        id: Date.now(),
        fecha: dateStr,
        nombre: vacunaNombre,
        lote: vacunaLote || 'N/A',
        veterinario: 'Dr. Veterinario Externo',
        proximaFecha: vacunaProxima || 'No programada',
        estado: 'Aplicada',
        estadoColor: 'bg-green-100 text-green-700'
      };
    } else if (selectedOption === 'alerta') {
      if (!alertaTitulo) return;
      record = {
        id: 'al_' + Date.now(),
        fecha: dateStr,
        tipo: alertaTipo,
        titulo: alertaTitulo.toUpperCase(),
        descripcion: alertaDesc
      };
    } else if (selectedOption === 'medicamento') {
      if (!medNombre) return;
      record = {
        id: Date.now(),
        nombre: medNombre,
        dosis: medDosis || 'N/A',
        frecuencia: medFrecuencia || 'N/A',
        duracion: medDuracion || 'N/A',
        fechaInicio: dateStr,
        veterinario: medVeterinario || 'Dr. Veterinario Externo',
        estado: 'Activo'
      };
    } else if (selectedOption === 'diagnostico') {
      if (!diagDescripcion) return;
      record = {
        id: Date.now(),
        fecha: dateStr,
        tipo: diagTipo,
        tipoColor: 
          diagTipo === 'Urgencia' 
            ? 'bg-red-100 text-red-700 border-red-200' 
            : diagTipo === 'Especialidad' 
              ? 'bg-purple-100 text-purple-700 border-purple-200' 
              : 'bg-blue-100 text-blue-700 border-blue-200',
        descripcion: diagDescripcion,
        doctor: diagDoctor || 'Médico Veterinario de Turno',
        estado: diagEstado,
        estadoColor: diagEstado === 'Resuelto' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700',
        clinica: diagClinica || 'Hospital Veterinario Sania Pet'
      };
    } else if (selectedOption === 'desparasitacion') {
      if (!despProducto) return;
      record = {
        id: Date.now(),
        fecha: dateStr,
        tipo: despTipo,
        producto: despProducto,
        pesoMascota: despPesoMascota ? `${despPesoMascota} kg` : 'N/A',
        dosis: despDosis || 'N/A',
        proximaFecha: despProximaFecha || 'No programada',
        veterinario: despVeterinario || 'Dueño (Auto-administrado)'
      };
    } else if (selectedOption === 'laboratorio') {
      if (!labExamen || !labLaboratorio) return;
      record = {
        id: `lab-${Date.now()}`,
        fecha: dateStr,
        examen: labExamen,
        laboratorio: labLaboratorio,
        telefono: labTelefono || '+56 2 2987 6543',
        sitioWeb: labSitioWeb || 'lab.saniapet.cl',
        direccion: labDireccion || 'Av. Vitacura 5400, Santiago',
        convenio: labConvenio || 'Particular',
        directorTecnico: labDirectorTecnico || 'Dr. Fernando Leyton',
        resultados: labResultados,
        notasGenerales: labNotasGenerales
      };
    } else if (selectedOption === 'imagen') {
      if (!imgNombre) return;
      record = {
        id: Date.now(),
        fecha: dateStr,
        tipo: imgTipo,
        nombre: imgNombre,
        indicacion: imgIndicacion || 'Control preventivo general.',
        informe: imgInforme || 'Sin observaciones significativas.',
        doctor: imgDoctor || 'Dr. Radiólogo de Turno',
        imagenUrl: imgUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400&h=300'
      };
    }

    onAddRecord(selectedOption!, record);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const renderForm = () => {
    if (showSuccess) {
      return (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-lg">¡Registro Exitoso!</h3>
          <p className="text-xs text-gray-400">Los datos se han guardado correctamente.</p>
        </div>
      );
    }

    switch (selectedOption) {
      case 'laboratorio':
        return (
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-extrabold text-gray-900 text-base">Registrar Laboratorio</h3>
              <button type="button" onClick={() => setSelectedOption(null)} className="text-xs text-[#00AEEF] font-bold">Atrás</button>
            </div>
            
            <CustomDatePicker 
              value={customDate} 
              onChange={setCustomDate} 
              label="Fecha del Examen" 
            />
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre del Examen</label>
              <input 
                type="text" 
                required
                placeholder="Ej. Hemograma Completo" 
                value={labExamen}
                onChange={e => setLabExamen(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Laboratorio</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Lab Veterinary Sania" 
                  value={labLaboratorio}
                  onChange={e => setLabLaboratorio(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Director Técnico</label>
                <input 
                  type="text" 
                  placeholder="Ej. Dr. Fernando Leyton" 
                  value={labDirectorTecnico}
                  onChange={e => setLabDirectorTecnico(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Convenio / Seguro</label>
                <input 
                  type="text" 
                  placeholder="Ej. PetPlan, Particular" 
                  value={labConvenio}
                  onChange={e => setLabConvenio(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Teléfono Lab</label>
                <input 
                  type="text" 
                  placeholder="Ej. +56 2 2987 6543" 
                  value={labTelefono}
                  onChange={e => setLabTelefono(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sitio Web</label>
                <input 
                  type="text" 
                  placeholder="Ej. lab.saniapet.cl" 
                  value={labSitioWeb}
                  onChange={e => setLabSitioWeb(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dirección</label>
                <input 
                  type="text" 
                  placeholder="Ej. Av. Vitacura 5400" 
                  value={labDireccion}
                  onChange={e => setLabDireccion(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Notas / Observaciones</label>
              <textarea 
                placeholder="Observaciones generales..." 
                value={labNotasGenerales}
                onChange={e => setLabNotasGenerales(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF] h-16 resize-none"
              />
            </div>

            {/* Parameter Adding Block */}
            <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-3">
              <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-wider">Agregar Parámetro/Resultado</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Nombre. Ej. Hematocrito" 
                  value={labParamNombre}
                  onChange={e => setLabParamNombre(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                />
                <input 
                  type="text" 
                  placeholder="Resultado. Ej. 45.2" 
                  value={labParamResultado}
                  onChange={e => setLabParamResultado(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Unidad. Ej. %, g/dL" 
                  value={labParamUnidad}
                  onChange={e => setLabParamUnidad(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                />
                <input 
                  type="text" 
                  placeholder="Ref. Ej. 37.0 - 55.0" 
                  value={labParamRango}
                  onChange={e => setLabParamRango(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                />
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[9px] font-black text-gray-500 uppercase">Estado:</span>
                {['Normal', 'Alto', 'Bajo'].map(est => (
                  <button
                    key={est}
                    type="button"
                    onClick={() => setLabParamEstado(est as any)}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg border transition-all ${
                      labParamEstado === est 
                        ? 'bg-rose-500 text-white border-rose-500' 
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    {est}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    if (!labParamNombre || !labParamResultado) return;
                    setLabResultados([
                      ...labResultados,
                      {
                        nombre: labParamNombre,
                        resultado: labParamResultado,
                        unidad: labParamUnidad || '',
                        rangoReferencia: labParamRango || '',
                        estado: labParamEstado
                      }
                    ]);
                    setLabParamNombre('');
                    setLabParamResultado('');
                    setLabParamUnidad('');
                    setLabParamRango('');
                  }}
                  className="ml-auto bg-rose-600 text-white px-3.5 py-1.5 text-[10px] font-black uppercase rounded-lg"
                >
                  + Add
                </button>
              </div>

              {labResultados.length > 0 && (
                <div className="space-y-1.5 pt-1 border-t border-rose-100 max-h-24 overflow-y-auto">
                  {labResultados.map((res, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] bg-white px-2 py-1 rounded border border-gray-100">
                      <span className="font-extrabold text-gray-800">{res.nombre} ({res.resultado} {res.unidad})</span>
                      <button 
                        type="button" 
                        onClick={() => setLabResultados(labResultados.filter((_, idx) => idx !== i))}
                        className="text-red-500 font-extrabold ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
              Registrar Laboratorio
            </button>
          </form>
        );
      case 'imagen':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-extrabold text-gray-900 text-base">Registrar Imagen Médica</h3>
              <button type="button" onClick={() => setSelectedOption(null)} className="text-xs text-[#00AEEF] font-bold">Atrás</button>
            </div>

            <CustomDatePicker 
              value={customDate} 
              onChange={setCustomDate} 
              label="Fecha del Registro" 
            />

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tipo de Estudio</label>
              <div className="flex gap-2">
                {['Radiografía', 'Ecografía', 'Endoscopía'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setImgTipo(t as any)}
                    className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                      imgTipo === t 
                        ? 'bg-cyan-500 text-white border-cyan-500' 
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre del Examen / Región</label>
              <input 
                type="text" 
                required
                placeholder="Ej. Radiografía de Tórax Lateral" 
                value={imgNombre}
                onChange={e => setImgNombre(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Indicación Clínica</label>
              <input 
                type="text" 
                placeholder="Ej. Evaluar tos crónica" 
                value={imgIndicacion}
                onChange={e => setImgIndicacion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Médico Radiólogo</label>
                <input 
                  type="text" 
                  placeholder="Ej. Dr. Ignacio Valdivia" 
                  value={imgDoctor}
                  onChange={e => setImgDoctor(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">URL Imagen Demo</label>
                <input 
                  type="text" 
                  placeholder="Ej. https://unsplash.com/..." 
                  value={imgUrl}
                  onChange={e => setImgUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Informe Diagnóstico</label>
              <textarea 
                placeholder="Resultados e informe detallado..." 
                value={imgInforme}
                onChange={e => setImgInforme(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF] h-20 resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
              Registrar Imagen
            </button>
          </form>
        );
      case 'desparasitacion':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-extrabold text-gray-900 text-base">Registrar Desparasitación</h3>
              <button type="button" onClick={() => setSelectedOption(null)} className="text-xs text-[#00AEEF] font-bold">Atrás</button>
            </div>

            <CustomDatePicker 
              value={customDate} 
              onChange={setCustomDate} 
              label="Fecha de Aplicación" 
            />
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tipo de Desparasitación</label>
              <div className="flex gap-2">
                {['Interna', 'Externa'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDespTipo(t as any)}
                    className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                      despTipo === t 
                        ? 'bg-amber-500 text-white border-amber-500' 
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Producto Utilizado</label>
              <input 
                type="text" 
                required
                placeholder="Ej. NexGard Spectra, Drontal" 
                value={despProducto}
                onChange={e => setDespProducto(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dosis / Presentación</label>
                <input 
                  type="text" 
                  placeholder="Ej. 1 tableta, 1 pipeta" 
                  value={despDosis}
                  onChange={e => setDespDosis(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Peso Mascota (kg)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Ej. 12.4" 
                  value={despPesoMascota}
                  onChange={e => setDespPesoMascota(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Próxima Fecha</label>
                <input 
                  type="text" 
                  placeholder="Ej. DD/MM/AAAA" 
                  value={despProximaFecha}
                  onChange={e => setDespProximaFecha(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Veterinario / Administrador</label>
                <input 
                  type="text" 
                  placeholder="Ej. Dueño (Auto-administrado)" 
                  value={despVeterinario}
                  onChange={e => setDespVeterinario(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
              Registrar Desparasitación
            </button>
          </form>
        );
      case 'diagnostico':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-extrabold text-gray-900 text-base">Registrar Consulta</h3>
              <button type="button" onClick={() => setSelectedOption(null)} className="text-xs text-[#00AEEF] font-bold">Atrás</button>
            </div>

            <CustomDatePicker 
              value={customDate} 
              onChange={setCustomDate} 
              label="Fecha de Consulta" 
            />
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tipo de Consulta</label>
              <div className="flex gap-2">
                {['Consulta General', 'Urgencia', 'Especialidad'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDiagTipo(t as any)}
                    className={`flex-1 py-2 text-[10px] font-black rounded-xl border transition-all ${
                      diagTipo === t 
                        ? t === 'Urgencia' 
                          ? 'bg-red-500 text-white border-red-500' 
                          : t === 'Especialidad' 
                            ? 'bg-purple-500 text-white border-purple-500' 
                            : 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {t === 'Consulta General' ? 'General' : t === 'Urgencia' ? 'Urgencia' : 'Especialidad'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Diagnóstico / Hallazgo</label>
              <textarea 
                required
                placeholder="Ej. Chequeo anual, Otitis detectada, Alergia cutánea..." 
                value={diagDescripcion}
                onChange={e => setDiagDescripcion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#00AEEF] h-16 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Médico Veterinario</label>
                <input 
                  type="text" 
                  placeholder="Ej. Dra. Sandra Valenzuela" 
                  value={diagDoctor}
                  onChange={e => setDiagDoctor(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estado Clínico</label>
                <div className="relative">
                  <select
                    value={diagEstado}
                    onChange={e => setDiagEstado(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#00AEEF] appearance-none cursor-pointer"
                  >
                    <option value="Resuelto">Resuelto</option>
                    <option value="En control">En control</option>
                    <option value="Controlado">Controlado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Clínica / Centro</label>
              <input 
                type="text" 
                placeholder="Ej. Hospital Veterinario Sania Pet" 
                value={diagClinica}
                onChange={e => setDiagClinica(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
              Registrar Consulta
            </button>
          </form>
        );
      case 'medicamento':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-extrabold text-gray-900 text-base">Registrar Tratamiento</h3>
              <button type="button" onClick={() => setSelectedOption(null)} className="text-xs text-[#00AEEF] font-bold">Atrás</button>
            </div>

            <CustomDatePicker 
              value={customDate} 
              onChange={setCustomDate} 
              label="Fecha de Inicio" 
            />
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre del Medicamento</label>
              <input 
                type="text" 
                required
                placeholder="Ej. Prednisona, Glandulex" 
                value={medNombre}
                onChange={e => setMedNombre(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dosis</label>
                <input 
                  type="text" 
                  placeholder="Ej. 1/2 comprimido, 5ml" 
                  value={medDosis}
                  onChange={e => setMedDosis(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Frecuencia</label>
                <input 
                  type="text" 
                  placeholder="Ej. Cada 12 horas, Con comida" 
                  value={medFrecuencia}
                  onChange={e => setMedFrecuencia(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Duración</label>
                <input 
                  type="text" 
                  placeholder="Ej. 7 días, Permanente" 
                  value={medDuracion}
                  onChange={e => setMedDuracion(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Veterinario</label>
                <input 
                  type="text" 
                  placeholder="Ej. Dra. Sandra Valenzuela" 
                  value={medVeterinario}
                  onChange={e => setMedVeterinario(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
              Registrar Tratamiento
            </button>
          </form>
        );
      case 'sintoma':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-extrabold text-gray-900 text-base">Registrar Síntoma</h3>
              <button type="button" onClick={() => setSelectedOption(null)} className="text-xs text-[#00AEEF] font-bold">Atrás</button>
            </div>

            <CustomDatePicker 
              value={customDate} 
              onChange={setCustomDate} 
              label="Fecha de Observación" 
            />
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Síntoma o Comportamiento</label>
              <input 
                type="text" 
                required
                placeholder="Ej. Buen apetito, Letargo, Vómito leve" 
                value={sintoma}
                onChange={e => setSintoma(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Estado</label>
              <div className="flex gap-2">
                {['Normal', 'Atención', 'Alerta'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSintomaEstado(st as any)}
                    className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                      sintomaEstado === st 
                        ? st === 'Alerta' 
                          ? 'bg-red-500 text-white border-red-500' 
                          : st === 'Atención' 
                            ? 'bg-amber-500 text-white border-amber-500' 
                            : 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Detalles Adicionales</label>
              <textarea 
                placeholder="Anota observaciones como horas, cambios en la comida, etc." 
                value={sintomaNota}
                onChange={e => setSintomaNota(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#00AEEF] h-20 resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
              Guardar en Diario
            </button>
          </form>
        );

      case 'peso':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-extrabold text-gray-900 text-base">Registrar Peso</h3>
              <button type="button" onClick={() => setSelectedOption(null)} className="text-xs text-[#00AEEF] font-bold">Atrás</button>
            </div>

            <CustomDatePicker 
              value={customDate} 
              onChange={setCustomDate} 
              label="Fecha del Registro" 
              isWeight
            />
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Peso en Kilogramos (kg)</label>
              <input 
                type="number" 
                step="0.01"
                required
                placeholder="Ej. 12.5" 
                value={peso}
                onChange={e => setPeso(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
              Guardar Peso
            </button>
          </form>
        );

      case 'vacuna':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-extrabold text-gray-900 text-base">Registrar Vacuna</h3>
              <button type="button" onClick={() => setSelectedOption(null)} className="text-xs text-[#00AEEF] font-bold">Atrás</button>
            </div>

            <CustomDatePicker 
              value={customDate} 
              onChange={setCustomDate} 
              label="Fecha de Inoculación" 
            />
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre de Vacuna</label>
              <input 
                type="text" 
                required
                placeholder="Ej. Antirrábica, Séxtuple" 
                value={vacunaNombre}
                onChange={e => setVacunaNombre(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lote / Serie</label>
                <input 
                  type="text" 
                  placeholder="Ej. RAB-99A" 
                  value={vacunaLote}
                  onChange={e => setVacunaLote(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Próximo Refuerzo</label>
                <input 
                  type="text" 
                  placeholder="Ej. DD/MM/AAAA" 
                  value={vacunaProxima}
                  onChange={e => setVacunaProxima(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
              Registrar Aplicación
            </button>
          </form>
        );

      case 'alerta':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-extrabold text-gray-900 text-base">Agendar Recordatorio</h3>
              <button type="button" onClick={() => setSelectedOption(null)} className="text-xs text-[#00AEEF] font-bold">Atrás</button>
            </div>

            <CustomDatePicker 
              value={customDate} 
              onChange={setCustomDate} 
              label="Fecha de Programación" 
            />
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Título de Alerta / Evento</label>
              <input 
                type="text" 
                required
                placeholder="Ej. Control Veterinario, Desparasitación interna" 
                value={alertaTitulo}
                onChange={e => setAlertaTitulo(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tipo de Alerta</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAlertaTipo('preventiva')}
                  className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                    alertaTipo === 'preventiva' 
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}
                >
                  Preventiva / Cita
                </button>
                <button
                  type="button"
                  onClick={() => setAlertaTipo('critica')}
                  className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                    alertaTipo === 'critica' 
                      ? 'bg-red-500 text-white border-red-500' 
                      : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}
                >
                  Crítica / Médica
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Descripción o Nota</label>
              <input 
                type="text" 
                required
                placeholder="Ej. Vence la vacuna antirrábica" 
                value={alertaDesc}
                onChange={e => setAlertaDesc(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>

            <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
              Guardar Recordatorio
            </button>
          </form>
        );

      default:
        return (
          <>
            <h2 className="text-lg font-black text-center text-gray-900 mb-5">
              ¿Qué deseas registrar?
            </h2>
            <div className="space-y-3">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (option.id === 'mascota-perdida') {
                        onAddRecord('mascota-perdida', null);
                        onClose();
                      } else {
                        setSelectedOption(option.id);
                      }
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50/50 transition-colors border border-transparent hover:border-gray-100 text-left active:scale-[0.98] transition-transform"
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${option.color}`}>
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-extrabold text-gray-900 text-sm leading-tight">
                        {option.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{option.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Dimmed Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Sliding Drawer / Modal Container */}
      <div
        className="relative bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-lg p-6 pb-9 sm:p-7 border-t sm:border border-gray-100 shadow-2xl z-50 animate-[slideUp_0.25s_ease-out] max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle decoration on mobile */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 -mt-2 sm:hidden" />

        {/* Back button when inside a specific form */}
        {selectedOption && (
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setSelectedOption(null)}
              className="flex items-center gap-1.5 text-xs font-black text-[#00AEEF] hover:text-[#0099D6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a opciones</span>
            </button>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              Nuevo Registro
            </span>
          </div>
        )}

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {renderForm()}
      </div>
    </div>
  );
}
