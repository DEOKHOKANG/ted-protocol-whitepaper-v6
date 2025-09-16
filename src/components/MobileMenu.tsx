import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './MobileMenu.module.css';

interface MenuItem {
  id: string;
  titleKey: string;
  path: string;
  icon: string;
}

// 백서 섹션 메뉴 아이템
const menuItems: MenuItem[] = [
  { id: 'executive-summary', titleKey: 'Executive Summary', path: '/', icon: '📋' },
  { id: 'introduction', titleKey: 'Introduction', path: '/introduction', icon: '🚀' },
  { id: 'problem-statement', titleKey: 'Problem Statement', path: '/problem-statement', icon: '⚠️' },
  { id: 'tokenomics', titleKey: 'Tokenomics', path: '/tokenomics', icon: '💎' },
  { id: 'technology', titleKey: 'Technology', path: '/technology', icon: '⚙️' },
  { id: 'governance', titleKey: 'Governance', path: '/governance', icon: '🏛️' },
  { id: 'roadmap', titleKey: 'Roadmap', path: '/roadmap', icon: '🗺️' },
  { id: 'risk-disclosure', titleKey: 'Risk Disclosure', path: '/risk-disclosure', icon: '⚠️' },
];

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const location = useLocation();

  useEffect(() => {
    // 현재 경로에 따라 활성 메뉴 아이템 설정
    const currentPath = location.pathname;
    const activeMenuItem = menuItems.find(item => 
      currentPath === item.path || 
      (item.path !== '/' && currentPath.includes(item.id))
    );
    setActiveItem(activeMenuItem?.id || 'executive-summary');
  }, [location.pathname]);

  useEffect(() => {
    // 메뉴가 열릴 때 body 스크롤 방지
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);
    setIsOpen(false);
    // 페이지 이동은 브라우저의 기본 링크 동작으로 처리
  };

  return (
    <>
      {/* 햄버거 메뉴 버튼 */}
      <button
        className={`${styles.hamburgerButton} ${isOpen ? styles.active : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={isOpen}
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {/* 백드롭 */}
      {isOpen && (
        <div 
          className={styles.backdrop} 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 슬라이드 메뉴 */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <div className={styles.menuHeader}>
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <img 
                src="/img/logo.svg" 
                alt="TED Protocol Logo" 
                className={styles.logo}
              />
            </div>
            <div className={styles.brandInfo}>
              <h3 className={styles.brandTitle}>TED Protocol</h3>
              <p className={styles.brandSubtitle}>
                Decentralized Investment Protocol
              </p>
            </div>
          </div>
        </div>

        <nav className={styles.menuContent}>
          <h4 className={styles.sectionTitle}>
            Documentation Sections
          </h4>
          
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.id} className={styles.menuItem}>
                <a
                  href={item.path}
                  className={`${styles.menuLink} ${
                    activeItem === item.id ? styles.active : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  <span className={styles.menuText}>
                    {item.titleKey}
                  </span>
                  {activeItem === item.id && (
                    <span className={styles.activeIndicator}>●</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.menuFooter}>
          <div className={styles.versionInfo}>
            <span className={styles.versionLabel}>
              Version
            </span>
            <span className={styles.versionNumber}>v5.0</span>
          </div>
          
          <div className={styles.socialLinks}>
            <a 
              href="https://twitter.com/tedprotocol" 
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <span>🐦</span>
            </a>
            <a 
              href="https://t.me/tedprotocol" 
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <span>📱</span>
            </a>
            <a 
              href="https://discord.gg/tedprotocol" 
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <span>💬</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;