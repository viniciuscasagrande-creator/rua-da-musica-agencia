import React, { useState } from 'react';
import {
  Layers,
  Ticket,
  Calendar,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Plus
} from 'lucide-react';
import { OPERATOR_INFO, TICKET_CATALOG } from '../../data/mockData';

export const InventoryTab = () => {
  const [selectedDate, setSelectedDate] = useState('2026-09-24');
  
  const daysCapacity = [
    { date: '2026-09-24 (Hoje)', total: 3000, soldSite: 1420, soldBoxOffice: 710, reservedB2B: 680, remaining: 190, occupancy: '93%' },
    { date: '2026-09-25 (Amanhã)', total: 3000, soldSite: 1100, soldBoxOffice: 450, reservedB2B: 700, remaining: 750, occupancy: '75%' },
    { date: '2026-09-26 (Sábado)', total: 3500, soldSite: 1900, soldBoxOffice: 800, reservedB2B: 700, remaining: 100, occupancy: '97%' },
    { date: '2026-09-27 (Domingo)', total: 3500, soldSite: 1750, soldBoxOffice: 780, reservedB2B: 650, remaining: 320, occupancy: '90%' },
    { date: '2026-09-28 (Segunda)', total: 3000, soldSite: 620, soldBoxOffice: 310, reservedB2B: 480, remaining: 1590, occupancy: '47%' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">Gestão de Inventário & Capacidade Central</h3>
          </div>
          <p className="text-xs text-slate-500">
            Estoque único por dia do Parque Jaime Lerner distribuído entre Site, Bilheteria e Agências B2B
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Capacidade Padrão:</span>
          <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
            3.000 ingressos / dia
          </span>
        </div>
      </div>

      {/* Daily Capacity Status Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h4 className="font-bold text-sm text-slate-800">Ocupação & Estoque por Data</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Data da Visita</th>
                <th className="py-3 px-4 text-right">Capacidade Total</th>
                <th className="py-3 px-4 text-right">Site (Online)</th>
                <th className="py-3 px-4 text-right">Bilheteria Local</th>
                <th className="py-3 px-4 text-right">Cota B2B (Agências)</th>
                <th className="py-3 px-4 text-right font-bold text-slate-800">Saldo Livre</th>
                <th className="py-3 px-5 text-center">Taxa de Ocupação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {daysCapacity.map((day) => (
                <tr key={day.date} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-5 font-bold text-slate-800">{day.date}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-700">{day.total.toLocaleString('pt-BR')}</td>
                  <td className="py-3.5 px-4 text-right text-blue-600 font-medium">{day.soldSite}</td>
                  <td className="py-3.5 px-4 text-right text-emerald-600 font-medium">{day.soldBoxOffice}</td>
                  <td className="py-3.5 px-4 text-right text-purple-600 font-bold">{day.reservedB2B}</td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900">
                    <span className={day.remaining < 200 ? 'text-rose-600' : 'text-slate-800'}>
                      {day.remaining}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      parseInt(day.occupancy) > 90
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {day.occupancy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
