import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Calendar, Users, TrendingUp, Globe, Building } from 'lucide-react';

interface TimelineItem {
  phase: string;
  period: string;
  title: string;
  description: string;
  milestones: string[];
  metrics: {
    users: string;
    tvl: string;
    volume: string;
    strategies: string;
  };
  status: 'completed' | 'in-progress' | 'upcoming';
  icon: React.ComponentType<any>;
}

interface RoadmapTimelineProps {
  title?: string;
}

const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  title = "Development Roadmap"
}) => {
  const [activePhase, setActivePhase] = useState<number>(0);

  const timelineData: TimelineItem[] = [
    {
      phase: "Phase 1",
      period: "2024 Q4",
      title: "Foundation",
      description: "Platform launch with core investment strategies and web interface",
      milestones: [
        "TRON mainnet smart contract deployment",
        "Core investment strategy activation",
        "Web interface launch",
        "Mobile app beta release"
      ],
      metrics: {
        users: "1,000+",
        tvl: "$10M",
        volume: "$1M daily",
        strategies: "3"
      },
      status: "completed",
      icon: CheckCircle
    },
    {
      phase: "Phase 2",
      period: "2025 Q1-Q2",
      title: "Growth",
      description: "Advanced features, multi-asset support, and yield optimization",
      milestones: [
        "Advanced investment strategies",
        "Multi-asset portfolio support",
        "Yield optimization algorithms",
        "Risk customization features"
      ],
      metrics: {
        users: "10,000+",
        tvl: "$100M",
        volume: "$10M daily",
        strategies: "10"
      },
      status: "in-progress",
      icon: TrendingUp
    },
    {
      phase: "Phase 3",
      period: "2025 Q3-Q4",
      title: "Scale",
      description: "Institutional features, global expansion, and compliance tools",
      milestones: [
        "White-label solutions",
        "B2B partnerships",
        "Compliance and audit tools",
        "Advanced analytics dashboard"
      ],
      metrics: {
        users: "50,000+",
        tvl: "$500M",
        volume: "$50M daily",
        strategies: "25"
      },
      status: "upcoming",
      icon: Building
    },
    {
      phase: "Phase 4",
      period: "2026",
      title: "Dominance",
      description: "Market leadership with top 5 DeFi protocol status and global presence",
      milestones: [
        "Top 5 DeFi protocol by TVL",
        "Industry partnerships",
        "Regulatory framework compliance",
        "Global market presence"
      ],
      metrics: {
        users: "100,000+",
        tvl: "$1B+",
        volume: "$100M daily",
        strategies: "50+"
      },
      status: "upcoming",
      icon: Globe
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#F59E0B';
      case 'upcoming': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'upcoming': return 'Upcoming';
      default: return 'Unknown';
    }
  };

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
        <Calendar size={24} style={{ color: 'var(--ted-royal-purple)', marginRight: '0.75rem' }} />
        <h3 style={{ margin: 0, color: 'var(--ted-royal-purple)', fontSize: '1.5rem', fontWeight: '700' }}>
          {title}
        </h3>
      </div>

      {/* Timeline Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '3rem',
        position: 'relative'
      }}>
        {/* Timeline Line */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '2rem',
          right: '2rem',
          height: '2px',
          background: 'var(--glass-border)',
          zIndex: 1
        }} />
        
        {timelineData.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activePhase;
          const isCompleted = item.status === 'completed';
          
          return (
            <motion.button
              key={index}
              onClick={() => setActivePhase(index)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                position: 'relative',
                zIndex: 2
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  background: isCompleted ? '#10B981' : (isActive ? 'var(--ted-purple-gradient)' : 'var(--glass-bg)'),
                  border: `2px solid ${isCompleted ? '#10B981' : (isActive ? 'var(--ted-royal-purple)' : 'var(--glass-border)')}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                  boxShadow: isActive ? 'var(--shadow-glow)' : 'var(--shadow-sm)'
                }}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  boxShadow: isActive ? '0 0 20px rgba(107, 70, 193, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <Icon 
                  size={20} 
                  color={isCompleted ? 'white' : (isActive ? 'white' : 'var(--premium-gray)')} 
                />
              </motion.div>
              
              <div style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: isActive ? 'var(--ted-royal-purple)' : 'var(--premium-gray)',
                textAlign: 'center'
              }}>
                {item.phase}
              </div>
              
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--premium-gray)',
                textAlign: 'center'
              }}>
                {item.period}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active Phase Details */}
      <motion.div
        key={activePhase}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid var(--glass-border)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h4 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: 'var(--ted-royal-purple)' 
              }}>
                {timelineData[activePhase].title}
              </h4>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'white',
                background: getStatusColor(timelineData[activePhase].status),
                textTransform: 'uppercase'
              }}>
                {getStatusText(timelineData[activePhase].status)}
              </span>
            </div>
            <p style={{ 
              margin: 0, 
              color: 'var(--premium-gray)', 
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              {timelineData[activePhase].description}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Milestones */}
          <div>
            <h5 style={{ 
              margin: '0 0 1rem', 
              color: 'var(--premium-dark)', 
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Key Milestones
            </h5>
            <div style={{ space: '0.75rem 0' }}>
              {timelineData[activePhase].milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(107, 70, 193, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(107, 70, 193, 0.1)'
                  }}
                >
                  {timelineData[activePhase].status === 'completed' ? (
                    <CheckCircle size={16} style={{ color: '#10B981', marginTop: '2px', flexShrink: 0 }} />
                  ) : (
                    <Circle size={16} style={{ color: 'var(--premium-gray)', marginTop: '2px', flexShrink: 0 }} />
                  )}
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--premium-dark)',
                    lineHeight: '1.4'
                  }}>
                    {milestone}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div>
            <h5 style={{ 
              margin: '0 0 1rem', 
              color: 'var(--premium-dark)', 
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Target Metrics
            </h5>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem' 
            }}>
              {[
                { label: 'Users', value: timelineData[activePhase].metrics.users, icon: Users },
                { label: 'TVL', value: timelineData[activePhase].metrics.tvl, icon: TrendingUp },
                { label: 'Daily Volume', value: timelineData[activePhase].metrics.volume, icon: Calendar },
                { label: 'Strategies', value: timelineData[activePhase].metrics.strategies, icon: Circle }
              ].map(({ label, value, icon: Icon }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    border: '1px solid rgba(245, 158, 11, 0.2)'
                  }}
                >
                  <Icon size={16} style={{ color: 'var(--ted-gold)', marginBottom: '0.5rem' }} />
                  <div style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '700', 
                    color: 'var(--ted-gold)',
                    marginBottom: '0.25rem'
                  }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--premium-gray)' }}>
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'rgba(107, 70, 193, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(107, 70, 193, 0.2)'
      }}>
        <div style={{ fontWeight: '700', color: 'var(--ted-royal-purple)', marginBottom: '1rem' }}>
          Development Progress
        </div>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              height: '8px',
              background: 'rgba(107, 70, 193, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '37.5%' }} // Phase 1 complete + Phase 2 in progress
                transition={{ duration: 2, ease: "easeOut" }}
                style={{
                  height: '100%',
                  background: 'var(--ted-purple-gradient)',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
          <div style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--ted-royal-purple)'
          }}>
            37.5% Complete
          </div>
        </div>
        <div style={{
          marginTop: '0.75rem',
          fontSize: '0.8rem',
          color: 'var(--premium-gray)'
        }}>
          Phase 1 completed • Phase 2 in progress • Phase 3 & 4 upcoming
        </div>
      </div>
    </motion.div>
  );
};

export default RoadmapTimeline;