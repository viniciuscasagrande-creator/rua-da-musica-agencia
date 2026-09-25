import React, { useState } from 'react';

// Simplified geometric path representation for Brazilian states
// accurately scaled to fit a compact responsive map container
export const BrazilMap = ({ statesData, onSelectState, selectedState }) => {
  const [hoveredState, setHoveredState] = useState(null);

  // States with their coordinates and path outlines
  const states = [
    { uf: 'PR', name: 'Paraná', d: 'M 195 240 L 235 238 L 245 252 L 210 262 L 190 250 Z', x: 215, y: 250, value: '28%', tickets: '1.915' },
    { uf: 'SP', name: 'São Paulo', d: 'M 215 220 L 265 210 L 275 235 L 238 242 L 215 225 Z', x: 245, y: 228, value: '18%', tickets: '1.231' },
    { uf: 'SC', name: 'Santa Catarina', d: 'M 205 260 L 240 256 L 245 275 L 210 278 Z', x: 225, y: 268, value: '12%', tickets: '821' },
    { uf: 'RS', name: 'Rio Grande do Sul', d: 'M 190 278 L 240 275 L 235 315 L 185 305 Z', x: 210, y: 295, value: '5%', tickets: '342' },
    { uf: 'RJ', name: 'Rio de Janeiro', d: 'M 276 226 L 305 220 L 300 236 L 272 235 Z', x: 290, y: 228, value: '10%', tickets: '684' },
    { uf: 'MG', name: 'Minas Gerais', d: 'M 230 170 L 285 160 L 310 200 L 275 225 L 220 215 Z', x: 265, y: 195, value: '8%', tickets: '547' },
    { uf: 'ES', name: 'Espírito Santo', d: 'M 306 195 L 322 190 L 318 220 L 304 220 Z', x: 312, y: 205, value: '3%', tickets: '205' },
    { uf: 'BA', name: 'Bahia', d: 'M 255 125 L 320 115 L 335 175 L 285 185 L 250 160 Z', x: 290, y: 150, value: '4%', tickets: '273' },
    { uf: 'MS', name: 'Mato Grosso do Sul', d: 'M 155 195 L 210 205 L 205 245 L 150 235 Z', x: 180, y: 220, value: '3%', tickets: '205' },
    { uf: 'MT', name: 'Mato Grosso', d: 'M 125 125 L 210 135 L 200 195 L 130 190 Z', x: 165, y: 160, value: '2%', tickets: '136' },
    { uf: 'GO', name: 'Goiás / DF', d: 'M 205 165 L 255 160 L 250 210 L 200 205 Z', x: 228, y: 185, value: '3%', tickets: '205' },
    { uf: 'AM', name: 'Amazonas', d: 'M 40 60 L 140 45 L 135 120 L 45 110 Z', x: 90, y: 80, value: '1%', tickets: '68' },
    { uf: 'PA', name: 'Pará', d: 'M 145 40 L 245 45 L 235 125 L 140 120 Z', x: 190, y: 80, value: '2%', tickets: '136' },
    { uf: 'RO', name: 'Rondônia', d: 'M 80 120 L 125 118 L 120 155 L 75 145 Z', x: 100, y: 135, value: '0.5%', tickets: '34' },
    { uf: 'AC', name: 'Acre', d: 'M 20 110 L 70 108 L 65 135 L 15 125 Z', x: 42, y: 120, value: '0.3%', tickets: '20' },
    { uf: 'RR', name: 'Roraima', d: 'M 95 10 L 135 12 L 130 45 L 90 40 Z', x: 112, y: 28, value: '0.2%', tickets: '14' },
    { uf: 'AP', name: 'Amapá', d: 'M 205 15 L 235 15 L 230 45 L 200 40 Z', x: 218, y: 30, value: '0.2%', tickets: '14' },
    { uf: 'MA', name: 'Maranhão', d: 'M 240 55 L 280 60 L 275 115 L 235 105 Z', x: 258, y: 85, value: '1%', tickets: '68' },
    { uf: 'PI', name: 'Piauí', d: 'M 275 70 L 305 75 L 295 130 L 270 118 Z', x: 288, y: 100, value: '1%', tickets: '68' },
    { uf: 'CE', name: 'Ceará', d: 'M 305 60 L 335 65 L 330 95 L 300 90 Z', x: 318, y: 78, value: '2%', tickets: '136' },
    { uf: 'RN', name: 'Rio G. do Norte', d: 'M 335 70 L 360 72 L 355 90 L 330 88 Z', x: 345, y: 80, value: '1%', tickets: '68' },
    { uf: 'PB', name: 'Paraíba', d: 'M 335 90 L 365 92 L 360 105 L 330 102 Z', x: 348, y: 98, value: '0.8%', tickets: '55' },
    { uf: 'PE', name: 'Pernambuco', d: 'M 310 105 L 365 105 L 360 120 L 305 118 Z', x: 338, y: 112, value: '1.5%', tickets: '102' },
    { uf: 'AL', name: 'Alagoas', d: 'M 340 122 L 362 122 L 358 135 L 338 132 Z', x: 350, y: 128, value: '0.7%', tickets: '48' },
    { uf: 'SE', name: 'Sergipe', d: 'M 335 135 L 355 136 L 350 148 L 332 145 Z', x: 342, y: 142, value: '0.5%', tickets: '34' },
    { uf: 'TO', name: 'Tocantins', d: 'M 215 105 L 245 105 L 240 160 L 210 155 Z', x: 228, y: 130, value: '0.5%', tickets: '34' }
  ];

  const getColor = (uf) => {
    switch (uf) {
      case 'PR': return '#1e40af'; // Paraná 28% (deep royal blue)
      case 'SP': return '#2563eb'; // São Paulo 18% (vibrant blue)
      case 'SC': return '#3b82f6'; // Santa Catarina 12% (mid blue)
      case 'RJ': return '#60a5fa'; // Rio de Janeiro 10% (sky blue)
      case 'MG': return '#93c5fd'; // Minas Gerais 8% (light blue)
      default: return '#cbd5e1';   // Other states (soft muted blue-gray)
    }
  };

  const activeHover = states.find(s => s.uf === hoveredState);

  return (
    <div className="relative w-full h-[240px] flex items-center justify-center select-none">
      <svg
        viewBox="0 0 380 330"
        className="w-full h-full max-h-[230px] drop-shadow-sm transition-all"
      >
        <defs>
          <filter id="map-shadow" x="-5%" y="-5%" width="115%" height="115%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.08" />
          </filter>
        </defs>

        {states.map((st) => {
          const isHovered = hoveredState === st.uf;
          const isSelected = selectedState === st.uf;
          const fillColor = getColor(st.uf);

          return (
            <g
              key={st.uf}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredState(st.uf)}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => onSelectState && onSelectState(st.uf)}
            >
              <path
                d={st.d}
                fill={isHovered || isSelected ? '#1d4ed8' : fillColor}
                stroke="#ffffff"
                strokeWidth={isHovered || isSelected ? "2" : "1.2"}
                strokeLinejoin="round"
                className="transition-colors duration-150 hover:brightness-110"
              />
              {/* State abbreviation for major states */}
              {['PR', 'SP', 'SC', 'RJ', 'MG', 'BA', 'RS'].includes(st.uf) && (
                <text
                  x={st.x}
                  y={st.y + 4}
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-white pointer-events-none select-none drop-shadow"
                >
                  {st.uf}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip on Hover */}
      {activeHover && (
        <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none border border-slate-700/50 flex flex-col gap-0.5 z-20">
          <span className="font-semibold text-slate-100">{activeHover.name} ({activeHover.uf})</span>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span>{activeHover.value} do total</span>
            <span>•</span>
            <span className="text-blue-300 font-medium">{activeHover.tickets} ingressos</span>
          </div>
        </div>
      )}
    </div>
  );
};
