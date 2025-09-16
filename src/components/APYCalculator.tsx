import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';

interface APYCalculatorProps {
  title?: string;
  description?: string;
}

const APYCalculator: React.FC<APYCalculatorProps> = ({
  title = "APY Calculator",
  description = "Calculate your potential returns with TED Protocol"
}) => {
  const [investment, setInvestment] = useState(1000);
  const [period, setPeriod] = useState(12);
  const [apy, setApy] = useState(65.2);

  const calculateReturns = () => {
    const monthlyRate = apy / 100 / 12;
    const compoundReturns = investment * Math.pow(1 + monthlyRate, period);
    return {
      final: compoundReturns,
      profit: compoundReturns - investment,
      monthly: (compoundReturns - investment) / period
    };
  };

  const results = calculateReturns();

  return (
    <motion.div 
      className="apy-calculator"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '2rem',
        margin: '2rem 0',
        backdropFilter: 'blur(10px)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Calculator size={24} style={{ color: 'var(--ted-royal-purple)', marginRight: '0.75rem' }} />
        <h3 style={{ margin: 0, color: 'var(--ted-royal-purple)', fontSize: '1.5rem', fontWeight: '700' }}>
          {title}
        </h3>
      </div>
      
      <p style={{ color: 'var(--premium-gray)', marginBottom: '2rem' }}>
        {description}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        {/* Input Section */}
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem' }}>
          <h4 style={{ color: 'var(--premium-dark)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Investment Parameters
          </h4>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--premium-gray)' }}>
              Initial Investment ($)
            </label>
            <input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              min="100"
              max="1000000"
              step="100"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ifm-color-content)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--premium-gray)' }}>
              Time Period (months)
            </label>
            <input
              type="number"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              min="1"
              max="60"
              step="1"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ifm-color-content)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--premium-gray)' }}>
              Expected APY (%)
            </label>
            <input
              type="number"
              value={apy}
              onChange={(e) => setApy(Number(e.target.value))}
              min="0"
              max="200"
              step="0.1"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ifm-color-content)',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {/* Results Section */}
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem' }}>
          <h4 style={{ color: 'var(--premium-dark)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Projected Returns
          </h4>

          <motion.div 
            className="result-card"
            style={{
              background: 'var(--ted-purple-gradient)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1rem',
              color: 'white'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <TrendingUp size={20} style={{ marginRight: '0.5rem' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Total Value</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', fontFamily: 'var(--ifm-font-family-monospace)' }}>
              ${results.final.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{
              background: 'rgba(107, 70, 193, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <DollarSign size={16} style={{ color: 'var(--ted-royal-purple)', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ted-royal-purple)' }}>
                ${results.profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--premium-gray)' }}>Total Profit</div>
            </div>

            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <TrendingUp size={16} style={{ color: 'var(--ted-gold)', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ted-gold)' }}>
                ${results.monthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--premium-gray)' }}>Monthly Avg</div>
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(245, 158, 11, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--premium-gray)', marginBottom: '0.5rem' }}>
              Return on Investment (ROI)
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--ted-gold)' }}>
              {((results.profit / investment) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: 'rgba(255, 193, 7, 0.1)',
        border: '1px solid rgba(255, 193, 7, 0.3)',
        borderRadius: '8px',
        fontSize: '0.8rem',
        color: '#856404',
        textAlign: 'left',
        lineHeight: '1.5'
      }}>
        <strong>⚠️ Important Risk Disclosure:</strong><br/>
        • The APY ranges shown (40-80%) represent historical performance of select lead traders in the TED Protocol Foundation's strategy pool during optimal market conditions.<br/>
        • Individual investor returns may differ significantly and can be negative.<br/>
        • Past performance, including backtested results, does not guarantee or predict future returns.<br/>
        • This calculator is for educational purposes only and should not be considered investment advice.<br/>
        • Investment in crypto assets involves substantial risk of loss. Only invest what you can afford to lose.
      </div>
    </motion.div>
  );
};

export default APYCalculator;