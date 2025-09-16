import React from 'react';
import PremiumTable from './PremiumTable';

interface ComparisonTableJaProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const ComparisonTableJa: React.FC<ComparisonTableJaProps> = ({
  title = "競争比較",
  subtitle = "TED Protocol vs 従来ファンド vs DeFiプロトコル",
  className = ""
}) => {
  const columns = [
    { key: 'feature', title: '特徴', align: 'left' as const, width: '25%' },
    { key: 'ted', title: 'TED Protocol', align: 'center' as const, width: '25%' },
    { key: 'traditional', title: '従来ファンド', align: 'center' as const, width: '25%' },
    { key: 'defi', title: 'DeFiプロトコル', align: 'center' as const, width: '25%' }
  ];

  const data = [
    {
      feature: '最小投資額',
      ted: <span className="cell-success">100ドル</span>,
      traditional: <span className="cell-danger">1,000,000ドル</span>,
      defi: <span className="cell-warning">可変</span>
    },
    {
      feature: '期待収益',
      ted: <span className="cell-success">40-80% 年収益率</span>,
      traditional: <span className="cell-warning">8-20% 年収益率</span>,
      defi: <span className="cell-warning">5-20% 年収益率</span>
    },
    {
      feature: '透明性',
      ted: <span className="cell-success">完全オンチェーン</span>,
      traditional: <span className="cell-danger">限定的</span>,
      defi: <span className="cell-success">完全</span>
    },
    {
      feature: 'アクセシビリティ',
      ted: <span className="cell-success">グローバル</span>,
      traditional: <span className="cell-danger">制限あり</span>,
      defi: <span className="cell-success">グローバル</span>
    },
    {
      feature: '規制状況',
      ted: <span className="cell-success">MASライセンス</span>,
      traditional: <span className="cell-success">ライセンス</span>,
      defi: <span className="cell-danger">無規制</span>
    },
    {
      feature: 'スマート投資',
      ted: <span className="cell-success">✅ 高度</span>,
      traditional: <span className="cell-danger">❌ 限定的</span>,
      defi: <span className="cell-danger">❌ なし</span>
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

export default ComparisonTableJa;