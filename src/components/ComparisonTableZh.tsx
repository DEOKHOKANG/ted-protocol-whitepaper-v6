import React from 'react';
import PremiumTable from './PremiumTable';

interface ComparisonTableZhProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const ComparisonTableZh: React.FC<ComparisonTableZhProps> = ({
  title = "竞争比较",
  subtitle = "TED Protocol vs 传统基金 vs DeFi协议",
  className = ""
}) => {
  const columns = [
    { key: 'feature', title: '特征', align: 'left' as const, width: '25%' },
    { key: 'ted', title: 'TED Protocol', align: 'center' as const, width: '25%' },
    { key: 'traditional', title: '传统基金', align: 'center' as const, width: '25%' },
    { key: 'defi', title: 'DeFi协议', align: 'center' as const, width: '25%' }
  ];

  const data = [
    {
      feature: '最低投资额',
      ted: <span className="cell-success">100美元</span>,
      traditional: <span className="cell-danger">1,000,000美元</span>,
      defi: <span className="cell-warning">可变</span>
    },
    {
      feature: '预期收益',
      ted: <span className="cell-success">40-80% 年收益率</span>,
      traditional: <span className="cell-warning">8-20% 年收益率</span>,
      defi: <span className="cell-warning">5-20% 年收益率</span>
    },
    {
      feature: '透明度',
      ted: <span className="cell-success">完全链上</span>,
      traditional: <span className="cell-danger">有限</span>,
      defi: <span className="cell-success">完全</span>
    },
    {
      feature: '可访问性',
      ted: <span className="cell-success">全球</span>,
      traditional: <span className="cell-danger">受限</span>,
      defi: <span className="cell-success">全球</span>
    },
    {
      feature: '监管状态',
      ted: <span className="cell-success">MAS许可</span>,
      traditional: <span className="cell-success">许可</span>,
      defi: <span className="cell-danger">无监管</span>
    },
    {
      feature: '智能投资',
      ted: <span className="cell-success">✅ 高级</span>,
      traditional: <span className="cell-danger">❌ 有限</span>,
      defi: <span className="cell-danger">❌ 无</span>
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

export default ComparisonTableZh;