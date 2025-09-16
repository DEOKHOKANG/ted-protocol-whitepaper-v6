import React from 'react';
import PremiumTable from './PremiumTable';

interface ComparisonTableKoProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const ComparisonTableKo: React.FC<ComparisonTableKoProps> = ({
  title = "경쟁 비교",
  subtitle = "TED Protocol vs 전통적 펀드 vs DeFi 프로토콜",
  className = ""
}) => {
  const columns = [
    { key: 'feature', title: '특징', align: 'left' as const, width: '25%' },
    { key: 'ted', title: 'TED Protocol', align: 'center' as const, width: '25%' },
    { key: 'traditional', title: '전통적 펀드', align: 'center' as const, width: '25%' },
    { key: 'defi', title: 'DeFi 프로토콜', align: 'center' as const, width: '25%' }
  ];

  const data = [
    {
      feature: '최소 투자금액',
      ted: <span className="cell-success">100달러</span>,
      traditional: <span className="cell-danger">1,000,000달러</span>,
      defi: <span className="cell-warning">가변</span>
    },
    {
      feature: '과거 수익률*',
      ted: <span className="cell-success">40-80% 연수익률**</span>,
      traditional: <span className="cell-warning">8-20% 연수익률</span>,
      defi: <span className="cell-warning">5-20% 연수익률</span>
    },
    {
      feature: '투명성',
      ted: <span className="cell-success">완전한 온체인</span>,
      traditional: <span className="cell-danger">제한적</span>,
      defi: <span className="cell-success">완전</span>
    },
    {
      feature: '접근성',
      ted: <span className="cell-success">글로벌</span>,
      traditional: <span className="cell-danger">제한됨</span>,
      defi: <span className="cell-success">글로벌</span>
    },
    {
      feature: '규제 상태',
      ted: <span className="cell-success">MAS 라이선스</span>,
      traditional: <span className="cell-success">라이선스</span>,
      defi: <span className="cell-danger">무규제</span>
    },
    {
      feature: '스마트 투자',
      ted: <span className="cell-success">✅ 고급</span>,
      traditional: <span className="cell-danger">❌ 제한적</span>,
      defi: <span className="cell-danger">❌ 없음</span>
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

export default ComparisonTableKo;