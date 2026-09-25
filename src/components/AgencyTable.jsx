import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Link as LinkIcon,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Ban
} from 'lucide-react';

export const AgencyTable = ({ agencies, onSelectAgency, onOpenPortalLink }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [stateFilter, setStateFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter agencies
  const filteredAgencies = agencies.filter((agency) => {
    const matchesSearch =
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.cnpj.includes(searchTerm);

    const matchesStatus = statusFilter === 'Todos' || agency.status === statusFilter;
    const matchesState = stateFilter === 'Todos' || agency.state === stateFilter;

    return matchesSearch && matchesStatus && matchesState;
  });

  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage) || 1;
  const paginatedAgencies = filteredAgencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ativa':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Ativa
          </span>
        );
      case 'Pendente':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pendente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Suspensa
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      
      {/* Header with Title and Search/Filters */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">Agências Parceiras</h3>
          <p className="text-xs text-slate-500">Gestão de canais credenciados, cotas e limites de distribuição</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar agência (nome, CNPJ, cidade)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-7 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Ativa">Ativa</option>
              <option value="Pendente">Pendente</option>
              <option value="Suspensa">Suspensa</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* State Filter */}
          <div className="relative">
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-7 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Todos">Todos os Estados</option>
              <option value="SP">São Paulo (SP)</option>
              <option value="RJ">Rio de Janeiro (RJ)</option>
              <option value="PR">Paraná (PR)</option>
              <option value="SC">Santa Catarina (SC)</option>
              <option value="MG">Minas Gerais (MG)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* More Filters button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Mais filtros</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5">Agência</th>
              <th className="py-3 px-4">Cidade / UF</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Limite / Cota</th>
              <th className="py-3 px-4 text-right">Reservas</th>
              <th className="py-3 px-4 text-right">Ingressos</th>
              <th className="py-3 px-4 text-right">Receita (R$)</th>
              <th className="py-3 px-5 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedAgencies.map((agency) => (
              <tr
                key={agency.id}
                className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                onClick={() => onSelectAgency(agency)}
              >
                {/* Agency Name & Avatar */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${agency.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                      {agency.initials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                        {agency.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        CNPJ: {agency.cnpj}
                      </p>
                    </div>
                  </div>
                </td>

                {/* City / UF */}
                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  {agency.location}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  {getStatusBadge(agency.status)}
                </td>

                {/* Quota Limit */}
                <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                  {agency.quotaLimit.toLocaleString('pt-BR')}
                </td>

                {/* Reservations */}
                <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                  {agency.reservationsCount}
                </td>

                {/* Tickets Count */}
                <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                  {agency.ticketsCount.toLocaleString('pt-BR')}
                </td>

                {/* Revenue */}
                <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                  {agency.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>

                {/* Action Buttons */}
                <td
                  className="py-3.5 px-5 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onSelectAgency(agency)}
                      title="Ver detalhes da agência"
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenPortalLink && onOpenPortalLink(agency)}
                      title="Abrir no Portal da Agência"
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectAgency(agency)}
                      title="Mais opções"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Mostrando <span className="font-semibold text-slate-700">{filteredAgencies.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> a{' '}
          <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, 42)}</span> de{' '}
          <span className="font-semibold text-slate-700">42 agências</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg font-semibold flex items-center justify-center transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {page}
            </button>
          ))}

          <span className="px-1 text-slate-400">...</span>
          <button
            onClick={() => setCurrentPage(9)}
            className={`w-7 h-7 rounded-lg font-semibold flex items-center justify-center transition-colors ${
              currentPage === 9
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            9
          </button>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Próximo
          </button>
        </div>
      </div>

    </div>
  );
};
