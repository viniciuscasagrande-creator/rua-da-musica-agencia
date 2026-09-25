import React from 'react';
import { NationalExecutiveDashboard } from '../NationalExecutiveDashboard';
import { KPIStats } from '../KPIStats';
import { Charts } from '../Charts';
import { SidePriceCard } from '../SidePriceCard';
import { AgencyTable } from '../AgencyTable';

export const OverviewTab = ({ kpis, agencies, onSelectAgency, onOpenPortalLink, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* 1. National Executive Dashboard (384 Agências, R$ 428k Vendas, Ranking Estados) */}
      <NationalExecutiveDashboard onNavigateTab={onNavigateTab} />

      {/* 2. Operational KPI Cards */}
      <KPIStats kpis={kpis} />

      {/* 2. Middle Grid: Charts (col-8) + Side Price Composition (col-4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Visual Charts: Brazil Map + Evolution Dual-Line + Tourist Origin Donut */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <Charts />
          
          {/* Agency Table */}
          <AgencyTable
            agencies={agencies}
            onSelectAgency={onSelectAgency}
            onOpenPortalLink={onOpenPortalLink}
          />
        </div>

        {/* Side Panel: Parque Jaime Lerner Price Breakdown & 7-Step Pipeline */}
        <div className="xl:col-span-4">
          <SidePriceCard />
        </div>
      </div>
    </div>
  );
};
