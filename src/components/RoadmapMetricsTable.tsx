import React from 'react';
import PremiumTable from './PremiumTable';

interface RoadmapMetricsTableProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const RoadmapMetricsTable: React.FC<RoadmapMetricsTableProps> = ({
  title = "Growth Metrics Timeline",
  subtitle = "Target metrics for each development phase",
  className = ""
}) => {
  const columns = [
    { key: 'quarter', title: 'Quarter', align: 'center' as const, width: '15%' },
    { key: 'users', title: 'Users', align: 'center' as const, width: '15%' },
    { key: 'tvl', title: 'TVL', align: 'center' as const, width: '15%' },
    { key: 'dailyActive', title: 'Daily Active', align: 'center' as const, width: '15%' },
    { key: 'strategies', title: 'Strategies', align: 'center' as const, width: '15%' },
    { key: 'volume', title: 'Daily Volume', align: 'center' as const, width: '15%' },
    { key: 'phase', title: 'Phase', align: 'center' as const, width: '10%' }
  ];

  const data = [
    {
      quarter: 'Q4 2024',
      users: <span className="cell-success">1K</span>,
      tvl: <span className="cell-success">$10M</span>,
      dailyActive: '500',
      strategies: '3',
      volume: '$1M',
      phase: <span className="cell-highlight">Launch</span>
    },
    {
      quarter: 'Q1 2025',
      users: <span className="cell-success">10K</span>,
      tvl: <span className="cell-success">$50M</span>,
      dailyActive: '3K',
      strategies: '10',
      volume: '$5M',
      phase: <span className="cell-warning">Growth</span>
    },
    {
      quarter: 'Q2 2025',
      users: <span className="cell-warning">25K</span>,
      tvl: <span className="cell-warning">$150M</span>,
      dailyActive: '8K',
      strategies: '20',
      volume: '$15M',
      phase: <span className="cell-warning">Growth</span>
    },
    {
      quarter: 'Q3 2025',
      users: <span className="cell-warning">50K</span>,
      tvl: <span className="cell-warning">$300M</span>,
      dailyActive: '15K',
      strategies: '35',
      volume: '$30M',
      phase: <span className="cell-success">Scale</span>
    },
    {
      quarter: 'Q4 2025',
      users: <span className="cell-warning">75K</span>,
      tvl: <span className="cell-warning">$500M</span>,
      dailyActive: '25K',
      strategies: '50',
      volume: '$50M',
      phase: <span className="cell-success">Scale</span>
    },
    {
      quarter: '2026',
      users: <span className="cell-success">100K+</span>,
      tvl: <span className="cell-success">$1B+</span>,
      dailyActive: '40K+',
      strategies: '75+',
      volume: '$100M+',
      phase: <span className="cell-highlight">Dominance</span>
    }
  ];

  return (
    <PremiumTable
      title={title}
      subtitle={subtitle}
      columns={columns}
      data={data}
      variant="striped"
      size="medium"
      className={className}
    />
  );
};

export default RoadmapMetricsTable;