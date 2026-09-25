import React, { useState } from 'react';
import {
  Users,
  Map,
  FileText,
  Ticket,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Info
} from 'lucide-react';

export const KPIStats = ({ kpis }) => {
  const [showFeeInfo, setShowFeeInfo] = useState(false);

  const cards = [
    {
      id: 'agencies',
      title: 'Agências Ativas',
      value: kpis.activeAgencies.value,
      change: kpis.activeAgencies.change,
      period: kpis.activeAgencies.period,
      icon: Users,
      iconBg: 'bg-blue-500',
      iconText: 'text-white'
    },
    {
      id: 'states',
      title: 'Estados Atendidos',
      value: kpis.servedStates.value,
      change: kpis.servedStates.change,
      period: kpis.servedStates.period,
      icon: Map,
      iconBg: 'bg-emerald-500',
      iconText: 'text-white'
    },
    {
      id: 'reservations',
      title: 'Reservas B2B',
      value: kpis.b2bBookings.formatted,
      change: kpis.b2bBookings.change,
      period: kpis.b2bBookings.period,
      icon: FileText,
      iconBg: 'bg-purple-500',
      iconText: 'text-white'
    },
    {
      id: 'tickets',
      title: 'Ingressos Distribuídos',
      value: kpis.distributedTickets.formatted,
      change: kpis.distributedTickets.change,
      period: kpis.distributedTickets.period,
      icon: Ticket,
      iconBg: 'bg-orange-500',
      iconText: 'text-white'
    },
    {
      id: 'revenue',
      title: 'Receita Bruta',
      value: kpis.grossRevenue.formatted,
      change: kpis.grossRevenue.change,
      period: kpis.grossRevenue.period,
      icon: DollarSign,
      iconBg: 'bg-teal-500',
      iconText: 'text-white'
    },
    {
      id: 'fee',
      title: 'Taxas DiskIngressos',
      value: kpis.diskFees.formatted,
      subtext: kpis.diskFees.note,
      isFee: true,
      icon: PieChart,
      iconBg: 'bg-rose-500',
      iconText: 'text-white'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} ${card.iconText} flex items-center justify-center shrink-0 shadow-xs`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-500 line-clamp-1">
                {card.title}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xl xl:text-2xl font-black text-slate-900 tracking-tight">
                {card.value}
              </span>

              {card.isFee ? (
                <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500 relative">
                  <span>{card.subtext}</span>
                  <button
                    onMouseEnter={() => setShowFeeInfo(true)}
                    onMouseLeave={() => setShowFeeInfo(false)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    <Info className="w-3 h-3" />
                  </button>

                  {showFeeInfo && (
                    <div className="absolute bottom-6 left-0 w-52 bg-slate-900 text-white text-[11px] p-2.5 rounded-lg shadow-xl z-30 pointer-events-none">
                      <p className="font-semibold mb-0.5">Taxa de Intermediação 6%</p>
                      <p className="text-slate-300 leading-tight">
                        Calculada sobre o valor-base dos ingressos distribuídos para agências parceiras credenciadas.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{card.change}</span>
                  <span className="text-slate-400 font-normal">{card.period}</span>
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};
