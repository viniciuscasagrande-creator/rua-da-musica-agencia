import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/tabs/OverviewTab';
import { PricingTab } from './components/tabs/PricingTab';
import { BookingsTab } from './components/tabs/BookingsTab';
import { FinancialTab } from './components/tabs/FinancialTab';
import { CommissionsTab } from './components/tabs/CommissionsTab';
import { ReportsTab } from './components/tabs/ReportsTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { VouchersTab } from './components/tabs/VouchersTab';
import { InventoryTab } from './components/tabs/InventoryTab';
import { BoxOfficeTab } from './components/tabs/BoxOfficeTab';
import { ContractsTab } from './components/tabs/ContractsTab';
import { GroupsManifestTab } from './components/tabs/GroupsManifestTab';
import { MarketingHubTab } from './components/tabs/MarketingHubTab';
import { IntegrationsTab } from './components/tabs/IntegrationsTab';
import { AccessTab } from './components/tabs/AccessTab';
import { ProductsPackagesTab } from './components/tabs/ProductsPackagesTab';
import { SalesTab } from './components/tabs/SalesTab';
import { AgencyTable } from './components/AgencyTable';
import { AgencyPortal } from './components/agency_portal/AgencyPortal';
import { PromoterModule } from './components/promoters/PromoterModule';
import { NewAgencyModal } from './components/NewAgencyModal';
import { AgencyDetailModal } from './components/AgencyDetailModal';
import { VoucherModal } from './components/VoucherModal';
import {
  Calendar,
  Plus,
  ChevronDown,
  Building2,
  Briefcase,
  Users,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import {
  OPERATOR_INFO,
  KPIS_OVERVIEW,
  AGENCIES_LIST,
  BOOKINGS_LIST
} from './data/mockData';

export function App() {
  // Navigation State
  // 'operator': Painel do Operador (Parque Jaime Lerner B2B)
  // 'agency': Portal da Agência (Agência Turismo Brasil)
  // 'promoter': Painel do Produtor (Equipe de Vendas)
  const [currentView, setCurrentView] = useState('operator');
  const [operatorSubTab, setOperatorSubTab] = useState('dashboard');

  // Data State
  const [agencies, setAgencies] = useState(AGENCIES_LIST);
  const [kpis, setKpis] = useState(KPIS_OVERVIEW);

  // Fetch initial agencies from B2B API
  useEffect(() => {
    fetch('/api/b2b/agencies')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setAgencies(res.data);
        }
      })
      .catch(err => console.warn('[B2B-API] Could not fetch agencies, using mock data:', err));
  }, []);

  // Modals State
  const [isNewAgencyModalOpen, setIsNewAgencyModalOpen] = useState(false);
  const [isAgencyDropdownOpen, setIsAgencyDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('01/09/2026 - 30/09/2026');
  const [selectedAgencyForDetail, setSelectedAgencyForDetail] = useState(null);
  const [selectedBookingForVoucher, setSelectedBookingForVoucher] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddAgency = (newAgency) => {
    setAgencies(prev => [newAgency, ...prev]);
    showToast(`Agência "${newAgency.name}" credenciada com sucesso! Cota liberada: ${newAgency.quotaLimit} ingressos.`);
  };

  const handleUpdateQuota = async (agencyId, newQuota) => {
    setAgencies(prev =>
      prev.map(ag => ag.id === agencyId ? { ...ag, quotaLimit: newQuota } : ag)
    );

    try {
      await fetch(`/api/b2b/agencies/${agencyId}/quota`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotaLimit: newQuota })
      });
      showToast("Limite de cota atualizado com sucesso!");
    } catch (err) {
      console.warn('[B2B-API] Failed to sync quota with API:', err);
      showToast("Limite de cota atualizado localmente!");
    }
  };

  const handleSimulateCheckin = (bookingId) => {
    showToast(`Check-in de visitantes da reserva ${bookingId} confirmado com sucesso!`);
  };

  const operatorTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'agencias', label: 'Agências' },
    { id: 'condicoes-comerciais', label: 'Condições Comerciais' },
    { id: 'produtos-pacotes', label: 'Produtos e Pacotes' },
    { id: 'reservas-grupos', label: 'Reservas e Grupos' },
    { id: 'vendas', label: 'Vendas' },
    { id: 'acessos', label: 'Acessos' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'relatorios', label: 'Relatórios' },
    { id: 'integracoes', label: 'Integrações' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* 1. Global Header Bar */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        operatorInfo={OPERATOR_INFO}
      />

      {/* Surface Quick-Toggle Banner (Visible on all screens) */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-slate-200">Portal de Agências • Parque Jaime Lerner:</span>
          <span className="text-slate-400 hidden sm:inline">Plataforma de Distribuição Turística B2B</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] hidden md:inline">Alternar Superfície:</span>
          <button
            onClick={() => setCurrentView('operator')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              currentView === 'operator'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            🏢 1. Operador (Parque)
          </button>
          <button
            onClick={() => setCurrentView('agency')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              currentView === 'agency'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            🎒 2. Portal da Agência
          </button>
          <button
            onClick={() => setCurrentView('promoter')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              currentView === 'promoter'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            👥 3. Produtor (Equipe Vendas)
          </button>
        </div>
      </div>

      {/* 2. OPERATOR VIEW: Painel do Operador (Distribuição Turística B2B) */}
      {currentView === 'operator' && (
        <div className="flex-1 flex">
          
          {/* Operator Left Sidebar */}
          <Sidebar
            activeSubTab={operatorSubTab}
            onSubTabChange={setOperatorSubTab}
          />

          {/* Operator Main Workspace */}
          <main className="flex-1 p-4 md:p-6 space-y-6 max-w-[1600px] w-full overflow-hidden">
            
            {/* Breadcrumb & Title Section (Exact match to 11_26_17.png) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <span>Parque Jaime Lerner</span>
                  <span>&gt;</span>
                  <span>Distribuição Turística B2B</span>
                  <span>&gt;</span>
                  <span className="text-slate-700 font-semibold capitalize">
                    {operatorTabs.find(t => t.id === operatorSubTab)?.label || 'Visão Geral'}
                  </span>
                </div>
                
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Distribuição Turística B2B
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Venda de ingressos e pacotes para agências de turismo de todo o Brasil.
                </p>
              </div>

              {/* Action Buttons: Date Range & Nova Agência */}
              <div className="flex items-center gap-2.5 relative">
                <button
                  onClick={() => setIsDatePickerOpen(true)}
                  className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Alterar período de análise"
                >
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{selectedDateRange}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                <div className="relative inline-flex rounded-xl shadow-xs">
                  <button
                    onClick={() => setIsNewAgencyModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-l-xl text-xs font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nova Agência</span>
                  </button>
                  <button
                    onClick={() => setIsAgencyDropdownOpen(!isAgencyDropdownOpen)}
                    className="px-2 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-r-xl border-l border-blue-500 transition-colors"
                    title="Mais opções de credenciamento"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {isAgencyDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100">
                      <button
                        onClick={() => {
                          setIsAgencyDropdownOpen(false);
                          setIsNewAgencyModalOpen(true);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-600" />
                        <span>Cadastrar Agência</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsAgencyDropdownOpen(false);
                          showToast("Importador em lote iniciado: Selecione a planilha de agências.");
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Importar Lote (Planilha CSV)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Horizontal Sub-tabs (Visão Geral, Agências, Tarifário B2B, Reservas, etc.) */}
            <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto pb-px">
              {operatorTabs.map((tab) => {
                const isActive = operatorSubTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setOperatorSubTab(tab.id)}
                    className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                      isActive
                        ? 'border-blue-600 text-blue-600 font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Views */}
            {(operatorSubTab === 'dashboard' || operatorSubTab === 'visao-geral') && (
              <OverviewTab
                kpis={kpis}
                agencies={agencies}
                onSelectAgency={setSelectedAgencyForDetail}
                onOpenPortalLink={(agency) => {
                  setCurrentView('agency');
                  showToast(`Conectado como "${agency.name}" no Portal B2B.`);
                }}
                onNavigateTab={setOperatorSubTab}
              />
            )}

            {operatorSubTab === 'agencias' && (
              <AgencyTable
                agencies={agencies}
                onSelectAgency={setSelectedAgencyForDetail}
                onOpenPortalLink={(agency) => {
                  setCurrentView('agency');
                  showToast(`Conectado como "${agency.name}" no Portal B2B.`);
                }}
              />
            )}

            {(operatorSubTab === 'condicoes-comerciais' || operatorSubTab === 'contratos' || operatorSubTab === 'tarifario') && (
              <ContractsTab />
            )}

            {(operatorSubTab === 'produtos-pacotes' || operatorSubTab === 'ingressos') && (
              <ProductsPackagesTab />
            )}

            {(operatorSubTab === 'reservas-grupos' || operatorSubTab === 'grupos' || operatorSubTab === 'reservas') && (
              <GroupsManifestTab />
            )}

            {(operatorSubTab === 'vendas' || operatorSubTab === 'bilheteria') && (
              <SalesTab />
            )}

            {(operatorSubTab === 'acessos' || operatorSubTab === 'vouchers') && (
              <AccessTab />
            )}

            {(operatorSubTab === 'marketing' || operatorSubTab === 'divulgacao') && (
              <MarketingHubTab />
            )}

            {(operatorSubTab === 'financeiro' || operatorSubTab === 'comissoes') && (
              <FinancialTab kpis={kpis} />
            )}

            {operatorSubTab === 'relatorios' && (
              <ReportsTab />
            )}

            {(operatorSubTab === 'integracoes' || operatorSubTab === 'configuracoes') && (
              <IntegrationsTab />
            )}

          </main>

        </div>
      )}

      {/* 3. AGENCY VIEW: Portal da Agência Parceira (Screenshot 11_30_25) */}
      {currentView === 'agency' && (
        <AgencyPortal
          onOpenVoucher={(booking) => setSelectedBookingForVoucher(booking)}
        />
      )}

      {/* 4. PROMOTER VIEW: Painel do Produtor (Screenshot 10_27_42) */}
      {currentView === 'promoter' && (
        <PromoterModule />
      )}

      {/* MODALS */}
      {isNewAgencyModalOpen && (
        <NewAgencyModal
          isOpen={isNewAgencyModalOpen}
          onClose={() => setIsNewAgencyModalOpen(false)}
          onAddAgency={handleAddAgency}
        />
      )}

      {selectedAgencyForDetail && (
        <AgencyDetailModal
          agency={selectedAgencyForDetail}
          isOpen={!!selectedAgencyForDetail}
          onClose={() => setSelectedAgencyForDetail(null)}
          onUpdateQuota={handleUpdateQuota}
          onOpenPortal={(agency) => {
            setSelectedAgencyForDetail(null);
            setCurrentView('agency');
            showToast(`Acesso concedido como ${agency.name}.`);
          }}
        />
      )}

      {selectedBookingForVoucher && (
        <VoucherModal
          booking={selectedBookingForVoucher}
          isOpen={!!selectedBookingForVoucher}
          onClose={() => setSelectedBookingForVoucher(null)}
          onSimulateCheckin={handleSimulateCheckin}
        />
      )}

      {/* Date Range Picker Modal */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Selecionar Período de Análise</h3>
              </div>
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-2">
                  Atalhos Rápidos:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Setembro 2026 (Mês Atual)', range: '01/09/2026 - 30/09/2026' },
                    { label: 'Últimos 7 dias', range: '18/09/2026 - 25/09/2026' },
                    { label: 'Últimos 15 dias', range: '10/09/2026 - 25/09/2026' },
                    { label: 'Últimos 30 dias', range: '25/08/2026 - 25/09/2026' },
                    { label: 'Próximo Fim de Semana', range: '26/09/2026 - 27/09/2026' },
                    { label: 'Outubro 2026 (Primavera)', range: '01/10/2026 - 31/10/2026' },
                  ].map((preset) => (
                    <button
                      key={preset.range}
                      onClick={() => {
                        setSelectedDateRange(preset.range);
                        setIsDatePickerOpen(false);
                        showToast(`Período atualizado para ${preset.range}`);
                      }}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        selectedDateRange === preset.range
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block font-bold">{preset.label}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{preset.range}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-2">
                  Ou digite um período personalizado:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Data Início</label>
                    <input
                      type="date"
                      defaultValue="2026-09-01"
                      id="custom-date-start"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Data Fim</label>
                    <input
                      type="date"
                      defaultValue="2026-09-30"
                      id="custom-date-end"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const s = document.getElementById('custom-date-start')?.value || '2026-09-01';
                  const e = document.getElementById('custom-date-end')?.value || '2026-09-30';
                  const formatted = `${s.split('-').reverse().join('/')} - ${e.split('-').reverse().join('/')}`;
                  setSelectedDateRange(formatted);
                  setIsDatePickerOpen(false);
                  showToast(`Filtro de período aplicado: ${formatted}`);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
              >
                Aplicar Filtro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default App;
