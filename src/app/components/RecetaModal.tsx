import React from 'react';
import { X, Printer, Stethoscope, Download, CheckCircle2, Shield } from 'lucide-react';
import { Pet } from '../data/petData';
import { useAuth } from '../context/AuthContext';

interface RecetaModalProps {
  pet: Pet;
  onClose: () => void;
}

export default function RecetaModal({ pet, onClose }: RecetaModalProps) {
  const { user } = useAuth();
  const todayStr = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const doctorName = user?.rol === 'veterinario' ? user.nombre : 'Dra. Sandra Valenzuela';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Modal Controls Bar (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#00AEEF]" />
            <h3 className="font-black text-sm">Receta Médica y Ficha Clínica Oficial</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#00AEEF] hover:bg-[#0099D6] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto flex-1 text-gray-800 space-y-6 font-sans print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-gray-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00AEEF] to-[#1A5AD7] rounded-xl flex items-center justify-center text-white font-black text-xs">
                  SP
                </div>
                <h1 className="font-black text-xl text-gray-900 tracking-tight">Hospital Veterinario Sania Pet</h1>
              </div>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Av. Providencia 1234, Santiago • Tel: +56 2 2987 6543 • urgencias@saniapet.cl
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                Documento Clínico
              </span>
              <p className="text-xs text-gray-500 font-bold mt-1.5">Fecha: <strong>{todayStr}</strong></p>
            </div>
          </div>

          {/* Patient and Owner Info Box */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase block">Paciente</span>
              <strong className="text-gray-900 font-black text-sm">{pet.nombre}</strong>
            </div>
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase block">Especie / Raza</span>
              <strong className="text-gray-800">{pet.especie} • {pet.raza}</strong>
            </div>
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase block">Edad / Peso</span>
              <strong className="text-gray-800">{pet.edad} • {pet.pesoActual}</strong>
            </div>
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase block">Microchip</span>
              <strong className="text-gray-800 font-mono text-[11px]">{pet.microchip}</strong>
            </div>

            <div className="col-span-2 sm:col-span-2 pt-2 border-t border-gray-200">
              <span className="text-[9px] font-black text-gray-400 uppercase block">Tutor / Propietario</span>
              <strong className="text-gray-800">{pet.dueno} ({pet.telefonoDueno})</strong>
            </div>
            <div className="col-span-2 sm:col-span-2 pt-2 border-t border-gray-200">
              <span className="text-[9px] font-black text-gray-400 uppercase block">Dirección</span>
              <strong className="text-gray-800">{pet.direccionDueno || 'Santiago, Chile'}</strong>
            </div>
          </div>

          {/* Medical Diagnoses Section */}
          <div>
            <h3 className="font-black text-sm text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-[#00AEEF]" />
              <span>Diagnóstico Clínico</span>
            </h3>
            <div className="space-y-2">
              {pet.diagnosticos && pet.diagnosticos.length > 0 ? (
                pet.diagnosticos.slice(0, 2).map((diag) => (
                  <div key={diag.id} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>{diag.tipo}: {diag.descripcion}</span>
                      <span className="text-gray-500 font-medium">{diag.fecha}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">Atendido por: {diag.doctor} • {diag.clinica}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">Evaluación general periódica en curso.</p>
              )}
            </div>
          </div>

          {/* Prescriptions / Treatments Section */}
          <div>
            <h3 className="font-black text-sm text-gray-900 uppercase tracking-wider mb-2">
              💊 Tratamiento Farmacológico & Posología
            </h3>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 font-black text-gray-700 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Medicamento</th>
                    <th className="p-2.5">Dosis</th>
                    <th className="p-2.5">Frecuencia</th>
                    <th className="p-2.5">Duración</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold">
                  {pet.medicamentos && pet.medicamentos.length > 0 ? (
                    pet.medicamentos.map((med) => (
                      <tr key={med.id} className="hover:bg-gray-50/50">
                        <td className="p-2.5 font-bold text-gray-900">{med.nombre}</td>
                        <td className="p-2.5">{med.dosis}</td>
                        <td className="p-2.5">{med.frecuencia}</td>
                        <td className="p-2.5">{med.duracion}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-400">
                        No hay medicamentos activos recetados actualmente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Professional Doctor Signature Footer */}
          <div className="pt-8 flex justify-between items-end">
            <div className="text-[10px] text-gray-400 space-y-0.5">
              <p>Validez: 30 días desde la fecha de emisión.</p>
              <p>Código Verificación Sania Pet: SP-{pet.id.toUpperCase()}-{Date.now().toString().slice(-6)}</p>
            </div>

            <div className="text-center w-64 border-t border-gray-400 pt-2">
              <p className="font-black text-xs text-gray-900">{doctorName}</p>
              <p className="text-[10px] text-gray-500 font-semibold">Médico Veterinario • ColMeVet Reg. 8421</p>
              <p className="text-[9px] text-gray-400">Hospital Veterinario Sania Pet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
