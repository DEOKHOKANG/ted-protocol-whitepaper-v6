import React from 'react';
import PremiumTable from './PremiumTable';

interface TokenDistributionTableProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const TokenDistributionTable: React.FC<TokenDistributionTableProps> = ({
  title = "Token Distribution Strategy",
  subtitle = "Fair and transparent allocation of TEDP tokens",
  className = ""
}) => {
  const columns = [
    { key: 'category', title: 'Category', align: 'left' as const, width: '25%' },
    { key: 'allocation', title: 'Allocation', align: 'center' as const, width: '15%' },
    { key: 'tokens', title: 'Tokens', align: 'center' as const, width: '20%' },
    { key: 'vesting', title: 'Vesting', align: 'center' as const, width: '20%' },
    { key: 'purpose', title: 'Purpose', align: 'left' as const, width: '20%' }
  ];

  const data = [
    {
      category: 'Public Sale',
      allocation: <span className="cell-highlight">15%</span>,
      tokens: '150,000,000',
      vesting: <span className="cell-success">Immediate</span>,
      purpose: 'Fair distribution'
    },
    {
      category: 'DEX Liquidity',
      allocation: <span className="cell-highlight">10%</span>,
      tokens: '100,000,000',
      vesting: <span className="cell-success">Immediate</span>,
      purpose: 'Price stability'
    },
    {
      category: 'Team & Advisors',
      allocation: <span className="cell-warning">20%</span>,
      tokens: '200,000,000',
      vesting: <span className="cell-warning">24 months, 6-month cliff</span>,
      purpose: 'Long-term alignment'
    },
    {
      category: 'Ecosystem Fund',
      allocation: <span className="cell-warning">20%</span>,
      tokens: '200,000,000',
      vesting: <span className="cell-warning">36 months linear</span>,
      purpose: 'Development grants'
    },
    {
      category: 'Staking Rewards',
      allocation: <span className="cell-highlight">15%</span>,
      tokens: '150,000,000',
      vesting: <span className="cell-warning">48 months distribution</span>,
      purpose: 'Network security'
    },
    {
      category: 'Treasury Reserve',
      allocation: <span className="cell-highlight">10%</span>,
      tokens: '100,000,000',
      vesting: 'DAO controlled',
      purpose: 'Emergency fund'
    },
    {
      category: 'Community Rewards',
      allocation: <span className="cell-highlight">10%</span>,
      tokens: '100,000,000',
      vesting: 'Performance-based',
      purpose: 'User incentives'
    }
  ];

  return (
    <PremiumTable
      title={title}
      subtitle={subtitle}
      columns={columns}
      data={data}
      variant="bordered"
      size="medium"
      className={className}
    />
  );
};

export default TokenDistributionTable;