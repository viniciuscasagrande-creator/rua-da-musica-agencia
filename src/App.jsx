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

  // Fetch initial agencies from PDT API
  useEffect(() => {
    fetch('/api/b2b/agencies')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setAgencies(res.data);
        }
      })
      .catch(err => console.warn('[PDT] Could not fetch agencies, using mock data:', err));
  }, []);

  // Modals State
  const [isNewAgencyModalOpen, setIsNewAgencyModalOpen] = useState(false);
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
      showToast("Limite de cota atualizado e sincronizado no PDT!");
    } catch (err) {
      console.warn('[PDT] Failed to sync quota with API:', err);
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
          <span className="font-semibold text-slate-200">Ambiente PDT DiskIngressos:</span>
          <span className="text-slate-400 hidden sm:inline">Arquitetura Integrada Node.js / PostgreSQL / Redis</span>
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
              <div className="flex items-center gap-2.5">
                <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-xs hover:border-slate-300 cursor-pointer">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>01/09/2026 - 30/09/2026</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </div>

                <div className="relative inline-flex rounded-xl shadow-xs">
                  <button
                    onClick={() => setIsNewAgencyModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-l-xl text-xs font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nova Agência</span>
                  </button>
                  <button
                    onClick={() => setIsNewAgencyModalOpen(true)}
                    className="px-2 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-r-xl border-l border-blue-500 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
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
