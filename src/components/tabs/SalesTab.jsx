import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  Ticket,
  CheckCircle,
  Clock,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { ORDERS_SALES_LIST } from '../../data/mockData';

export const SalesTab = () => {
  const [orders, setOrders] = useState(ORDERS_SALES_LIST);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.agencyName.toLowerCase().includes(search.toLowerCase()) ||
    o.buyerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Core Transacional DiskIngressos • Vendas B2B</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Pedidos & Vendas Originadas pelas Agências
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Acompanhe cada pedido emitido pelos canais de distribuição (Portal B2B, API Direta e Links Rastreados de Afiliados).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Faturado</span>
            <span className="text-base font-black text-slate-900">R$ 428.150,00</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código de pedido, agência ou comprador..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <span className="text-xs text-slate-500 font-semibold">{filteredOrders.length} pedidos encontrados</span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Pedido & Data</th>
                <th className="py-3 px-4">Agência Parceira</th>
                <th className="py-3 px-4">Titular / Grupo</th>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4 text-center">Ingressos</th>
                <th className="py-3 px-4 text-right">Valor Total</th>
                <th className="py-3 px-4">Canal Origem</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-blue-700 font-mono block">{ord.id}</span>
                    <span className="text-[10px] text-slate-400">{ord.date}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {ord.agencyName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {ord.buyerName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {ord.product}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                    {ord.totalTickets}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    R$ {ord.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {ord.channel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Detalhes do pedido ${ord.id}:\nAgência: ${ord.agencyName}\nTitular: ${ord.buyerName}\nIngressos: ${ord.totalTickets}\nValor: R$ ${ord.totalAmount.toFixed(2)}`)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                      title="Ver Detalhes do Pedido"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
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
