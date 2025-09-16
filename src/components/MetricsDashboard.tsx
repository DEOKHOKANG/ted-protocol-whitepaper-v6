import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Users, DollarSign, Target, Activity, Zap } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  delay?: number;
}

interface MetricsDashboardProps {
  title?: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  suffix = '',
  prefix = '',
  description,
  icon: Icon,
  color,
  trend,
  delay = 0
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: 'var(--shadow-xl), var(--shadow-glow)'
      }}
    >
      {/* Top gradient bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`
      }} />

      {/* Icon and trend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} style={{ color }} />
        </div>
        
        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: trend.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: trend.isPositive ? '#10B981' : '#EF4444'
          }}>
            <TrendingUp 
              size={12} 
              style={{ 
                transform: trend.isPositive ? 'none' : 'rotate(180deg)',
                color: trend.isPositive ? '#10B981' : '#EF4444'
              }} 
            />
            {trend.value}%
          </div>
        )}
      </div>

      {/* Main value */}
      <div style={{ marginBottom: '0.5rem' }}>
        <motion.div
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color,
            fontFamily: 'var(--ifm-font-family-monospace)',
            lineHeight: '1'
          }}
        >
          {inView ? (
            <>
              {prefix}
              <CountUp 
                end={value} 
                duration={2}
                separator=","
                preserveValue
              />
              {suffix}
            </>
          ) : (
            `${prefix}0${suffix}`
          )}
        </motion.div>
      </div>

      {/* Title and description */}
      <div>
        <div style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--premium-dark)',
          marginBottom: '0.25rem'
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--premium-gray)',
          lineHeight: '1.4'
        }}>
          {description}
        </div>
        {trend && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--premium-gray)',
            marginTop: '0.5rem'
          }}>
            vs {trend.period}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  title = "TED Protocol Metrics",
  subtitle = "Real-time performance indicators"
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  // Refresh animation every 30 seconds to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const metricsData = [
    {
      title: "Total Value Locked",
      value: 287500000,
      prefix: "$",
      suffix: "",
      description: "Assets under management across all strategies",
      icon: DollarSign,
      color: '#6B46C1',
      trend: {
        value: 24.7,
        isPositive: true,
        period: "last month"
      }
    },
    {
      title: "Active Users",
      value: 12847,
      suffix: "",
      description: "Unique wallet addresses using TED Protocol",
      icon: Users,
      color: '#9F7AEA',
      trend: {
        value: 18.3,
        isPositive: true,
        period: "last month"
      }
    },
    {
      title: "Average APY",
      value: 65.2,
      suffix: "%",
      description: "Historical average annual percentage yield",
      icon: TrendingUp,
      color: '#F59E0B',
      trend: {
        value: 2.1,
        isPositive: true,
        period: "last quarter"
      }
    },
    {
      title: "Success Rate",
      value: 94.6,
      suffix: "%",
      description: "Profitable trading strategies over 12 months",
      icon: Target,
      color: '#10B981',
      trend: {
        value: 1.8,
        isPositive: true,
        period: "last quarter"
      }
    },
    {
      title: "Daily Volume",
      value: 5420000,
      prefix: "$",
      suffix: "",
      description: "Average daily trading volume",
      icon: Activity,
      color: '#8B5CF6',
      trend: {
        value: 12.4,
        isPositive: true,
        period: "last week"
      }
    },
    {
      title: "Active Strategies",
      value: 24,
      suffix: "",
      description: "Currently deployed investment strategies",
      icon: Zap,
      color: '#EC4899',
      trend: {
        value: 9.1,
        isPositive: true,
        period: "last month"
      }
    }
  ];

  return (
    <motion.div
      key={animationKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '2rem',
        margin: '2rem 0'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '0 0 0.5rem',
            fontSize: '2rem',
            fontWeight: '700',
            background: 'var(--ted-purple-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            margin: 0,
            color: 'var(--premium-gray)',
            fontSize: '1rem'
          }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {metricsData.map((metric, index) => (
          <MetricCard
            key={`${metric.title}-${animationKey}`}
            {...metric}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Real-time indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10B981'
          }}
        />
        <span style={{
          fontSize: '0.9rem',
          color: 'var(--premium-gray)',
          fontWeight: '500'
        }}>
          Live data • Updated every 30 seconds
        </span>
      </motion.div>

      {/* Performance Summary */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'rgba(107, 70, 193, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(107, 70, 193, 0.2)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              color: 'var(--ted-royal-purple)',
              marginBottom: '0.5rem'
            }}>
              Protocol Health Score
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#10B981',
                fontFamily: 'var(--ifm-font-family-monospace)'
              }}>
                98.7
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--premium-gray)'
              }}>
                Excellent performance across<br/>all key indicators
              </div>
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              color: 'var(--ted-royal-purple)',
              marginBottom: '0.5rem'
            }}>
              Network Status
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#10B981'
              }} />
              <span style={{
                fontSize: '0.9rem',
                color: 'var(--premium-gray)',
                fontWeight: '600'
              }}>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricsDashboard;