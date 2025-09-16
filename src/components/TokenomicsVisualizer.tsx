import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Coins, Users, Lock, TrendingUp } from 'lucide-react';

interface TokenomicsVisualizerProps {
  title?: string;
}

const TokenomicsVisualizer: React.FC<TokenomicsVisualizerProps> = ({
  title = "TEDP Token Distribution"
}) => {
  const [activeView, setActiveView] = useState<'distribution' | 'vesting' | 'utility'>('distribution');

  const distributionData = [
    { name: 'Public Sale', value: 40, amount: 400000000, color: '#6B46C1' },
    { name: 'Ecosystem', value: 25, amount: 250000000, color: '#9F7AEA' },
    { name: 'Team & Advisors', value: 15, amount: 150000000, color: '#B794F4' },
    { name: 'Marketing', value: 10, amount: 100000000, color: '#F59E0B' },
    { name: 'Liquidity', value: 10, amount: 100000000, color: '#FCD34D' }
  ];

  const vestingData = [
    { name: 'Month 0', publicSale: 40, ecosystem: 5, team: 0, marketing: 2.5, liquidity: 10 },
    { name: 'Month 6', publicSale: 40, ecosystem: 10, team: 0, marketing: 5, liquidity: 10 },
    { name: 'Month 12', publicSale: 40, ecosystem: 15, team: 0, marketing: 7.5, liquidity: 10 },
    { name: 'Month 18', publicSale: 40, ecosystem: 20, team: 3, marketing: 10, liquidity: 10 },
    { name: 'Month 24', publicSale: 40, ecosystem: 25, team: 7.5, marketing: 10, liquidity: 10 },
    { name: 'Month 36', publicSale: 40, ecosystem: 25, team: 15, marketing: 10, liquidity: 10 }
  ];

  const utilityData = [
    { name: 'Governance Voting', value: 95, description: 'Protocol parameter decisions' },
    { name: 'Staking Rewards', value: 88, description: '12-18% APY for stakers' },
    { name: 'Fee Discounts', value: 75, description: 'Up to 75% trading fee reduction' },
    { name: 'Access Rights', value: 65, description: 'Premium features access' },
    { name: 'Liquidity Mining', value: 45, description: 'Additional rewards for LPs' }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            {data.name}
          </p>
          <p style={{ margin: '0.25rem 0', color: 'var(--ted-royal-purple)', fontWeight: '500' }}>
            {data.value}% ({data.amount?.toLocaleString()} TEDP)
          </p>
        </div>
      );
    }
    return null;
  };

  const ViewSelector = () => (
    <div style={{ 
      display: 'flex', 
      gap: '0.5rem', 
      marginBottom: '2rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '0.5rem'
    }}>
      {[
        { key: 'distribution' as const, label: 'Distribution', icon: Coins },
        { key: 'vesting' as const, label: 'Vesting', icon: Lock },
        { key: 'utility' as const, label: 'Utility', icon: TrendingUp }
      ].map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveView(key)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: 'none',
            background: activeView === key ? 'var(--ted-purple-gradient)' : 'transparent',
            color: activeView === key ? 'white' : 'var(--premium-gray)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );

  const DistributionView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
      <div style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={160}
              paddingAngle={2}
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ space: '1rem 0' }}>
        {distributionData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              marginBottom: '0.75rem',
              border: `1px solid ${item.color}20`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div 
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  background: item.color, 
                  borderRadius: '4px' 
                }} 
              />
              <span style={{ fontWeight: '600', color: 'var(--premium-dark)' }}>
                {item.name}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', color: item.color }}>
                {item.value}%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--premium-gray)' }}>
                {(item.amount / 1000000).toFixed(0)}M TEDP
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const VestingView = () => (
    <div>
      <div style={{ height: '400px', marginBottom: '2rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vestingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
            <XAxis dataKey="name" stroke="#8892B0" fontSize={12} />
            <YAxis stroke="#8892B0" fontSize={12} label={{ value: 'Tokens (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="publicSale" stackId="a" fill="#6B46C1" name="Public Sale" />
            <Bar dataKey="ecosystem" stackId="a" fill="#9F7AEA" name="Ecosystem" />
            <Bar dataKey="team" stackId="a" fill="#B794F4" name="Team & Advisors" />
            <Bar dataKey="marketing" stackId="a" fill="#F59E0B" name="Marketing" />
            <Bar dataKey="liquidity" stackId="a" fill="#FCD34D" name="Liquidity" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem' 
      }}>
        <div style={{
          background: 'rgba(107, 70, 193, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(107, 70, 193, 0.2)'
        }}>
          <Lock size={20} style={{ color: 'var(--ted-royal-purple)', marginBottom: '0.75rem' }} />
          <div style={{ fontWeight: '700', color: 'var(--ted-royal-purple)', marginBottom: '0.5rem' }}>
            Team Tokens
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--premium-gray)' }}>
            2-year lockup with 3-year linear vesting
          </div>
        </div>

        <div style={{
          background: 'rgba(159, 122, 234, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(159, 122, 234, 0.2)'
        }}>
          <Users size={20} style={{ color: 'var(--ted-light-purple)', marginBottom: '0.75rem' }} />
          <div style={{ fontWeight: '700', color: 'var(--ted-light-purple)', marginBottom: '0.5rem' }}>
            Advisors
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--premium-gray)' }}>
            1-year lockup with 2-year linear vesting
          </div>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <Coins size={20} style={{ color: 'var(--ted-gold)', marginBottom: '0.75rem' }} />
          <div style={{ fontWeight: '700', color: 'var(--ted-gold)', marginBottom: '0.5rem' }}>
            Ecosystem
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--premium-gray)' }}>
            Quarterly smart releases for development
          </div>
        </div>
      </div>
    </div>
  );

  const UtilityView = () => (
    <div style={{ space: '1.5rem 0' }}>
      {utilityData.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem',
            border: '1px solid var(--glass-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--premium-dark)', marginBottom: '0.25rem' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--premium-gray)' }}>
                {item.description}
              </div>
            </div>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: 'var(--ted-royal-purple)',
              fontFamily: 'var(--ifm-font-family-monospace)'
            }}>
              {item.value}%
            </div>
          </div>
          
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: 'rgba(107, 70, 193, 0.1)', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ delay: index * 0.2, duration: 1, ease: "easeOut" }}
              style={{
                height: '100%',
                background: 'var(--ted-purple-gradient)',
                borderRadius: '3px'
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

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
        <Coins size={24} style={{ color: 'var(--ted-royal-purple)', marginRight: '0.75rem' }} />
        <h3 style={{ margin: 0, color: 'var(--ted-royal-purple)', fontSize: '1.5rem', fontWeight: '700' }}>
          {title}
        </h3>
      </div>

      <ViewSelector />

      {activeView === 'distribution' && <DistributionView />}
      {activeView === 'vesting' && <VestingView />}
      {activeView === 'utility' && <UtilityView />}

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'rgba(107, 70, 193, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(107, 70, 193, 0.2)'
      }}>
        <div style={{ fontWeight: '700', color: 'var(--ted-royal-purple)', marginBottom: '1rem' }}>
          Key Tokenomics Highlights
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          fontSize: '0.9rem',
          color: 'var(--premium-gray)'
        }}>
          <div>• Total Supply: 1,000,000,000 TEDP</div>
          <div>• No inflation mechanism</div>
          <div>• Quarterly burn from profits</div>
          <div>• Fair launch (no VC allocation)</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TokenomicsVisualizer;