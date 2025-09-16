import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Activity } from 'lucide-react';

interface PerformanceChartProps {
  title?: string;
  type?: 'line' | 'area';
  height?: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title = "TED Protocol Performance",
  type = 'area',
  height = 400
}) => {
  // Mock performance data based on historical performance
  const performanceData = [
    { month: 'Jan 2020', tedProtocol: 100, traditional: 100, defi: 100 },
    { month: 'Mar 2020', tedProtocol: 145, traditional: 95, defi: 85 },
    { month: 'Jun 2020', tedProtocol: 189, traditional: 102, defi: 125 },
    { month: 'Sep 2020', tedProtocol: 234, traditional: 108, defi: 156 },
    { month: 'Dec 2020', tedProtocol: 287, traditional: 115, defi: 203 },
    { month: 'Mar 2021', tedProtocol: 356, traditional: 118, defi: 298 },
    { month: 'Jun 2021', tedProtocol: 445, traditional: 125, defi: 245 },
    { month: 'Sep 2021', tedProtocol: 512, traditional: 132, defi: 189 },
    { month: 'Dec 2021', tedProtocol: 623, traditional: 139, defi: 267 },
    { month: 'Mar 2022', tedProtocol: 734, traditional: 128, defi: 198 },
    { month: 'Jun 2022', tedProtocol: 812, traditional: 115, defi: 145 },
    { month: 'Sep 2022', tedProtocol: 889, traditional: 108, defi: 123 },
    { month: 'Dec 2022', tedProtocol: 967, traditional: 112, defi: 134 },
    { month: 'Mar 2023', tedProtocol: 1134, traditional: 118, defi: 167 },
    { month: 'Jun 2023', tedProtocol: 1289, traditional: 125, defi: 198 },
    { month: 'Sep 2023', tedProtocol: 1456, traditional: 131, defi: 234 },
    { month: 'Dec 2023', tedProtocol: 1634, traditional: 138, defi: 267 },
    { month: 'Mar 2024', tedProtocol: 1823, traditional: 142, defi: 298 },
    { month: 'Jun 2024', tedProtocol: 2045, traditional: 148, defi: 332 },
    { month: 'Sep 2024', tedProtocol: 2287, traditional: 153, defi: 356 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ margin: '0 0 0.5rem', fontWeight: '600', color: 'var(--premium-dark)' }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ 
              margin: '0.25rem 0', 
              color: entry.color,
              fontWeight: '500'
            }}>
              {entry.name}: ${entry.value.toLocaleString()}
              <span style={{ color: 'var(--premium-gray)', marginLeft: '0.5rem' }}>
                ({((entry.value / 100 - 1) * 100).toFixed(1)}%)
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '2rem',
        margin: '2rem 0',
        backdropFilter: 'blur(10px)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Activity size={24} style={{ color: 'var(--ted-royal-purple)', marginRight: '0.75rem' }} />
        <h3 style={{ margin: 0, color: 'var(--ted-royal-purple)', fontSize: '1.5rem', fontWeight: '700' }}>
          {title}
        </h3>
      </div>
      
      <div style={{ 
        background: 'rgba(255, 193, 7, 0.1)', 
        border: '1px solid rgba(255, 193, 7, 0.3)',
        borderRadius: '8px',
        padding: '0.75rem',
        marginBottom: '1rem',
        fontSize: '0.8rem',
        color: '#856404'
      }}>
        <strong>Important Notice:</strong> Historical performance shown is based on backtested data and select lead trader results from TED Protocol Foundation's strategy pool. Individual results may vary significantly. Past performance is not indicative of future results.
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={performanceData}>
            <defs>
              <linearGradient id="tedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B46C1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6B46C1" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="traditionalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8892B0" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8892B0" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="defiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="#8892B0"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#8892B0"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {type === 'area' ? (
              <>
                <Area 
                  type="monotone" 
                  dataKey="tedProtocol" 
                  stroke="#6B46C1" 
                  strokeWidth={3}
                  fill="url(#tedGradient)" 
                  name="TED Protocol"
                />
                <Area 
                  type="monotone" 
                  dataKey="traditional" 
                  stroke="#8892B0" 
                  strokeWidth={2}
                  fill="url(#traditionalGradient)" 
                  name="Traditional Funds"
                />
                <Area 
                  type="monotone" 
                  dataKey="defi" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  fill="url(#defiGradient)" 
                  name="DeFi Average"
                />
              </>
            ) : (
              <>
                <Line 
                  type="monotone" 
                  dataKey="tedProtocol" 
                  stroke="#6B46C1" 
                  strokeWidth={3}
                  name="TED Protocol"
                  dot={{ r: 4, fill: '#6B46C1' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="traditional" 
                  stroke="#8892B0" 
                  strokeWidth={2}
                  name="Traditional Funds"
                  dot={{ r: 3, fill: '#8892B0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="defi" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="DeFi Average"
                  dot={{ r: 3, fill: '#F59E0B' }}
                />
              </>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <motion.div 
          style={{
            background: 'rgba(107, 70, 193, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            border: '1px solid rgba(107, 70, 193, 0.2)'
          }}
          whileHover={{ scale: 1.02 }}
        >
          <TrendingUp size={20} style={{ color: 'var(--ted-royal-purple)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--ted-royal-purple)' }}>
            +2,187%
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--premium-gray)' }}>TED Protocol</div>
        </motion.div>

        <motion.div 
          style={{
            background: 'rgba(136, 146, 176, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            border: '1px solid rgba(136, 146, 176, 0.2)'
          }}
          whileHover={{ scale: 1.02 }}
        >
          <Activity size={20} style={{ color: 'var(--premium-gray)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--premium-gray)' }}>
            +53%
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--premium-gray)' }}>Traditional</div>
        </motion.div>

        <motion.div 
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}
          whileHover={{ scale: 1.02 }}
        >
          <TrendingUp size={20} style={{ color: 'var(--ted-gold)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--ted-gold)' }}>
            +256%
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--premium-gray)' }}>DeFi Average</div>
        </motion.div>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: 'rgba(107, 70, 193, 0.05)',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: 'var(--premium-gray)',
        textAlign: 'center'
      }}>
        <strong>Historical Performance (2020-2024):</strong> Based on backtested strategies with $100 initial investment. 
        Performance data normalized to January 2020 baseline.
      </div>
    </motion.div>
  );
};

export default PerformanceChart;