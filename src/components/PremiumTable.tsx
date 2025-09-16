import React from 'react';
import './PremiumTable.css';

interface TableColumn {
  key: string;
  title: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface TableRow {
  [key: string]: string | number | React.ReactNode;
}

interface PremiumTableProps {
  title?: string;
  subtitle?: string;
  columns: TableColumn[];
  data: TableRow[];
  className?: string;
  variant?: 'default' | 'striped' | 'bordered' | 'minimal';
  size?: 'small' | 'medium' | 'large';
}

const PremiumTable: React.FC<PremiumTableProps> = ({
  title,
  subtitle,
  columns,
  data,
  className = '',
  variant = 'default',
  size = 'medium',
}) => {
  const tableClasses = [
    'premium-table',
    `premium-table--${variant}`,
    `premium-table--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="premium-table-container">
      {(title || subtitle) && (
        <div className="premium-table-header">
          {title && <h3 className="premium-table-title">{title}</h3>}
          {subtitle && <p className="premium-table-subtitle">{subtitle}</p>}
        </div>
      )}
      
      <div className="premium-table-wrapper">
        <table className={tableClasses}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    textAlign: column.align || 'left',
                    width: column.width
                  }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{ textAlign: column.align || 'left' }}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PremiumTable;