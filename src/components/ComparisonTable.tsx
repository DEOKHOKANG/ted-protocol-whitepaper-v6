import React from 'react';
import PremiumTable from './PremiumTable';

interface ComparisonTableProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  title = "Competitive Comparison",
  subtitle = "TED Protocol vs Traditional Funds vs DeFi Protocols",
  className = ""
}) => {
  const columns = [
    { key: 'feature', title: 'Feature', align: 'left' as const, width: '25%' },
    { key: 'ted', title: 'TED Protocol', align: 'center' as const, width: '25%' },
    { key: 'traditional', title: 'Traditional Funds', align: 'center' as const, width: '25%' },
    { key: 'defi', title: 'DeFi Protocols', align: 'center' as const, width: '25%' }
  ];

  const data = [
    {
      feature: 'Minimum Investment',
      ted: <span className="cell-success">$100</span>,
      traditional: <span className="cell-danger">$1,000,000</span>,
      defi: <span className="cell-warning">Variable</span>
    },
    {
      feature: 'Historical Returns*',
      ted: <span className="cell-success">40-80% APY**</span>,
      traditional: <span className="cell-warning">8-20% annually</span>,
      defi: <span className="cell-warning">5-20% APY</span>
    },
    {
      feature: 'Transparency',
      ted: <span className="cell-success">Full on-chain</span>,
      traditional: <span className="cell-danger">Limited</span>,
      defi: <span className="cell-success">Full</span>
    },
    {
      feature: 'Accessibility',
      ted: <span className="cell-success">Global</span>,
      traditional: <span className="cell-danger">Restricted</span>,
      defi: <span className="cell-success">Global</span>
    },
    {
      feature: 'Regulatory Status',
      ted: <span className="cell-success">MAS Licensed</span>,
      traditional: <span className="cell-success">Licensed</span>,
      defi: <span className="cell-danger">Unregulated</span>
    },
    {
      feature: 'Smart Investing',
      ted: <span className="cell-success">✅ Advanced</span>,
      traditional: <span className="cell-danger">❌ Limited</span>,
      defi: <span className="cell-danger">❌ None</span>
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

export default ComparisonTable;