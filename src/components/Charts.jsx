import React, { useState } from 'react';
import { BrazilMap } from './BrazilMap';
import { ChevronDown, Calendar, TrendingUp } from 'lucide-react';
import { STATES_DISTRIBUTION, EVOLUTION_DATA } from '../data/mockData';

export const Charts = () => {
  const [metricFilter, setMetricFilter] = useState('Ingressos');
  const [periodFilter, setPeriodFilter] = useState('Últimos 30 dias');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // SVG Chart Dimensions for Evolution Line Chart
  const svgWidth = 460;
  const svgHeight = 180;
  const paddingLeft = 35;
  const paddingRight = 35;
  const paddingTop = 20;
  const paddingBottom = 25;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  // Max values for scaling
  const maxReservas = 200;
  const maxIngressos = 1000;

  // Compute points for SVG lines
  const pointsReservas = EVOLUTION_DATA.map((d, index) => {
    const x = paddingLeft + (index / (EVOLUTION_DATA.length - 1)) * chartW;
    const y = paddingTop + chartH - (d.reservas / maxReservas) * chartH;
    return { ...d, x, y };
  });

  const pointsIngressos = EVOLUTION_DATA.map((d, index) => {
    const x = paddingLeft + (index / (EVOLUTION_DATA.length - 1)) * chartW;
    const y = paddingTop + chartH - (d.ingressos / maxIngressos) * chartH;
    return { ...d, x, y };
  });

  // Construct SVG path strings
  const lineReservasPath = pointsReservas.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  const areaReservasPath = `${lineReservasPath} L ${pointsReservas[pointsReservas.length - 1].x} ${paddingTop + chartH} L ${pointsReservas[0].x} ${paddingTop + chartH} Z`;

  const lineIngressosPath = pointsIngressos.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  // Donut Chart calculations
  const totalTickets = 6842;
  const radius = 60;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  // Donut slices with precise cumulative offsets
  const donutSlices = [
    { uf: 'PR', name: 'Paraná', pct: 28, color: '#2563eb' },
    { uf: 'SP', name: 'São Paulo', pct: 18, color: '#10b981' },
    { uf: 'SC', name: 'Santa Catarina', pct: 12, color: '#f59e0b' },
    { uf: 'RJ', name: 'Rio de Janeiro', pct: 10, color: '#06b6d4' },
    { uf: 'MG', name: 'Minas Gerais', pct: 8, color: '#8b5cf6' },
    { uf: 'Outros', name: 'Outros', pct: 24, color: '#94a3b8' }
  ];

  let accumulatedPercent = 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      
      {/* 1. Vendas por Estado (Map + Legend) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-800">Vendas por Estado</h3>
          <div className="relative">
            <select
              value={metricFilter}
              onChange={(e) => setMetricFilter(e.target.value)}
              className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1 pl-2.5 pr-7 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Ingressos">Ingressos</option>
              <option value="Receita">Receita (R$)</option>
              <option value="Reservas">Reservas</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Brazil Interactive Map */}
          <div className="flex-1">
            <BrazilMap statesData={STATES_DISTRIBUTION} />
          </div>

          {/* Map Legend */}
          <div className="w-36 space-y-2 py-1 pr-1 text-xs">
            {STATES_DISTRIBUTION.map((st) => (
              <div key={st.uf} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-1 rounded">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                  <span className="text-slate-600 font-medium group-hover:text-slate-900">{st.name}</span>
                </div>
                <span className="font-bold text-slate-800">{st.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Evolução das Reservas B2B (Dual Line Chart) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-sm text-slate-800">Evolução das Reservas B2B</h3>
          <div className="relative">
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1 pl-2.5 pr-7 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Últimos 30 dias">Últimos 30 dias</option>
              <option value="Setembro 2026">Setembro 2026</option>
              <option value="Últimos 15 dias">Últimos 15 dias</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600" />
            <span className="text-slate-600 font-medium">Reservas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-orange-500" />
            <span className="text-slate-600 font-medium">Ingressos</span>
          </div>
        </div>

        {/* SVG Dual Line Chart */}
        <div className="relative w-full h-[190px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="reservasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = paddingTop + chartH * (1 - ratio);
              return (
                <g key={i}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 ? "none" : "3,3"}
                  />
                  {/* Left Axis label (Reservas) */}
                  <text
                    x={paddingLeft - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-slate-400 select-none"
                  >
                    {Math.round(ratio * maxReservas)}
                  </text>
                  {/* Right Axis label (Ingressos) */}
                  <text
                    x={svgWidth - paddingRight + 6}
                    y={y + 3}
                    textAnchor="start"
                    className="text-[9px] fill-slate-400 select-none"
                  >
                    {Math.round(ratio * maxIngressos)}
                  </text>
                </g>
              );
            })}

            {/* Area fill for Reservas */}
            <path d={areaReservasPath} fill="url(#reservasGradient)" />

            {/* Line for Ingressos (Orange) */}
            <path
              d={lineIngressosPath}
              fill="none"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Line for Reservas (Blue) */}
            <path
              d={lineReservasPath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data interactive points */}
            {pointsReservas.map((pt, idx) => (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2"
                  className="hover:r-5 transition-all"
                />
              </g>
            ))}

            {/* X-axis date labels */}
            {['01/09', '07/09', '14/09', '21/09', '30/09'].map((dateLabel, idx) => {
              const xPos = paddingLeft + (idx / 4) * chartW;
              return (
                <text
                  key={dateLabel}
                  x={xPos}
                  y={svgHeight - 4}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-400 select-none"
                >
                  {dateLabel}
                </text>
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-700 z-20 transform -translate-x-1/2 -translate-y-full -top-1"
              style={{ left: `${(hoveredPoint.x / svgWidth) * 100}%` }}
            >
              <div className="font-semibold text-slate-200">{hoveredPoint.date}</div>
              <div className="text-blue-400 font-medium">Reservas: {hoveredPoint.reservas}</div>
              <div className="text-orange-400 font-medium">Ingressos: {hoveredPoint.ingressos}</div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Origem dos Turistas (Donut Chart) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-800">Origem dos Turistas <span className="text-xs font-normal text-slate-500">(por Estado)</span></h3>
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Donut SVG */}
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
              {donutSlices.map((slice, index) => {
                const strokeDasharray = `${(slice.pct / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += slice.pct;

                return (
                  <circle
                    key={slice.uf}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="hover:opacity-90 cursor-pointer transition-opacity"
                  />
                );
              })}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-base font-black text-slate-900 leading-tight">6.842</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">ingressos</span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="flex-1 space-y-1.5 text-xs">
            {donutSlices.map((slice) => (
              <div key={slice.uf} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-0.5 rounded">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="text-slate-600 font-medium group-hover:text-slate-900">{slice.uf}</span>
                </div>
                <span className="font-bold text-slate-800">{slice.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Small Bottom Info */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Principal emissor: <strong>Paraná (28%)</strong></span>
          <span className="text-blue-600 font-medium hover:underline cursor-pointer">Ver relatório completo</span>
        </div>
      </div>

    </div>
  );
};
