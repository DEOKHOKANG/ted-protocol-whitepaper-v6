import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'TED Protocol Whitepaper v2',
  tagline: 'Mobile Optimized Version - Institutional Returns. Retail Access. DeFi Transparency.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://whitepaper.tedprotocol.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tedprotocol', // Usually your GitHub org/user name.
  projectName: 'whitepaper', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'zh-CN', 'ja'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'TED Protocol',
      logo: {
        alt: 'TED Protocol Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://github.com/tedprotocol/whitepaper',
          label: 'GitHub',
          position: 'right',
          className: 'github-link',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
      hideOnScroll: false,
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Whitepaper',
          items: [
            {
              label: 'Executive Summary',
              to: '/',
            },
            {
              label: 'Tokenomics',
              to: '/tokenomics',
            },
            {
              label: 'Technology',
              to: '/technology',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/tedprotocol',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/tedprotocol',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/tedprotocol',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/protocolted/TEDP',
            },
            {
              label: 'Website',
              href: 'https://tedprotocol.com/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TED Protocol Foundation. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  
  scripts: [
    {
      src: '/mobile-fix.js',
      async: false,
    },
    {
      src: '/force-50-sidebar.js',
      async: false,
    },
  ],
  
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: '/extreme-mobile-fix.css',
      },
    },
    {
      tagName: 'style',
      attributes: {
        type: 'text/css',
      },
      innerHTML: `
        @media screen and (max-width: 996px) {
          .navbar__title, .navbar__brand b { 
            display: none !important; 
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
          }
          .navbar-sidebar { 
            width: 50% !important; 
            max-width: 220px !important;
            min-width: 180px !important;
            flex-basis: 50% !important;
            background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%) !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            border-radius: 0 16px 16px 0 !important;
            box-shadow: 4px 0 32px rgba(0,0,0,0.12), 2px 0 16px rgba(107,70,193,0.08) !important;
          }
          .navbar-sidebar__close {
            all: unset !important;
            position: absolute !important;
            top: 1rem !important;
            right: 1rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 70px !important;
            height: 36px !important;
            background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%) !important;
            border-radius: 8px !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 12px !important;
            letter-spacing: 1px !important;
            text-transform: uppercase !important;
            margin: 0 !important;
            z-index: 10000 !important;
            box-shadow: 0 4px 12px rgba(107,70,193,0.4), 0 2px 6px rgba(139,92,246,0.3) !important;
          }
          .navbar-sidebar__close::after {
            content: "✕ CLOSE" !important;
            color: white !important;
            font-size: 12px !important;
            font-weight: 700 !important;
            letter-spacing: 1px !important;
          }
          .navbar-sidebar__close svg,
          .navbar-sidebar__close > * {
            display: none !important;
          }
          [href*="github"] {
            display: none !important;
          }
        }
        
        /* 🚀 MOBILE MENU OPTIMIZATION - Clean Header & Language Fix */
        @media screen and (max-width: 996px) {
          /* 헤더에서 불필요한 텍스트 완전 제거 */
          .navbar__title, 
          .navbar__brand b, 
          .navbar__brand span:not(.navbar__logo),
          .navbar__item[href*="whitepaper"] {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
          }
          
          /* 언어 버튼과 햄버거 메뉴 간격 최적화 */
          .navbar__items--right {
            gap: 12px;
            align-items: center;
          }
          
          /* 언어 드롭다운 버튼 크기 최적화 */
          .navbar__link {
            padding: 8px 12px !important;
            min-height: 32px;
            display: flex;
            align-items: center;
            font-size: 14px;
          }
          
          /* 모바일 햄버거 메뉴 컨테이너 */
          .mobile-menu-container {
            display: flex !important;
            align-items: center;
          }
          
          /* 기존 Docusaurus 사이드바 완전 숨김 */
          .navbar-sidebar,
          .navbar__toggle,
          .navbar-sidebar__backdrop {
            display: none !important;
          }
          
          /* 네비게이션 바 높이 최적화 */
          .navbar {
            min-height: 56px;
            padding: 0 16px;
          }
          
          /* 로고 크기 최적화 */
          .navbar__logo {
            height: 28px;
            width: auto;
          }
          
          /* 브랜드 섹션 최적화 */
          .navbar__brand {
            margin-right: auto;
            font-size: 16px;
            font-weight: 600;
          }
        }
        
        /* 데스크톱에서 햄버거 메뉴 숨김 */
        @media screen and (min-width: 997px) {
          .mobile-menu-container {
            display: none !important;
          }
        }
        
        /* 햄버거 메뉴 전역 스타일 최적화 */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999;
          pointer-events: none;
        }
        
        .mobile-menu-overlay.active {
          pointer-events: all;
        }
        
        /* NUCLEAR OPTION: ULTRA-HIGH SPECIFICITY 50% SIDEBAR */
        @media screen and (max-width: 996px) {
          html body div.navbar-sidebar,
          html body aside.navbar-sidebar,
          html body .navbar-sidebar[style*="width"],
          html body .navbar-sidebar[class*="show"],
          html body .navbar-sidebar[style] {
            width: 50% !important;
            max-width: 220px !important;
            min-width: 180px !important;
            flex-basis: 50% !important;
            background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%) !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            border-radius: 0 16px 16px 0 !important;
            box-shadow: 4px 0 32px rgba(0,0,0,0.12), 2px 0 16px rgba(107,70,193,0.08) !important;
            transform: translateX(0) !important;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
          }
          
          html body .navbar-sidebar .navbar-sidebar__close,
          html body button.navbar-sidebar__close,
          html body .navbar-sidebar__close[style] {
            all: unset !important;
            position: absolute !important;
            top: 1rem !important;
            right: 1rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 70px !important;
            height: 36px !important;
            background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%) !important;
            border-radius: 8px !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 12px !important;
            letter-spacing: 1px !important;
            z-index: 10000 !important;
            box-shadow: 0 4px 12px rgba(107,70,193,0.4), 0 2px 6px rgba(139,92,246,0.3) !important;
            cursor: pointer !important;
          }
          
          html body .navbar-sidebar__close::after {
            content: "✕ CLOSE" !important;
            display: block !important;
            color: white !important;
            font-size: 12px !important;
            font-weight: 700 !important;
          }
          
          html body .navbar-sidebar__close * {
            display: none !important;
          }
          
          html body .navbar-sidebar__backdrop {
            background: radial-gradient(circle at center, rgba(107,70,193,0.15) 0%, rgba(0,0,0,0.7) 70%) !important;
            backdrop-filter: blur(8px) saturate(120%) !important;
          }
        }
      `,
    },
    {
      tagName: 'script',
      attributes: {
        type: 'text/javascript',
      },
      innerHTML: `
        // NUCLEAR OPTION: ULTRA-AGGRESSIVE FORCE APPLY
        (function() {
          'use strict';
          
          console.log('🚀 NUCLEAR OPTION: 50% Sidebar Force Apply Started');
          
          let retryCount = 0;
          const maxRetries = 50;
          
          function nuclearApply() {
            if (window.innerWidth > 996) return false;
            
            console.log('💥 Nuclear apply attempt', ++retryCount);
            
            // 1. Ultra-aggressive title hiding
            document.querySelectorAll('.navbar__title, .navbar__brand b, .navbar__brand span:not(.navbar__logo)').forEach(el => {
              if (el && !el.classList.contains('navbar__logo')) {
                el.style.cssText = 'display: none !important; visibility: hidden !important; position: absolute !important; left: -99999px !important; width: 0 !important; height: 0 !important;';
                el.remove();
              }
            });
            
            // 2. Nuclear sidebar styling
            const sidebar = document.querySelector('.navbar-sidebar');
            if (sidebar) {
              console.log('💥 NUCLEAR SIDEBAR APPLY');
              
              // Force ALL possible width properties
              sidebar.style.cssText += 'width: 50% !important; max-width: 220px !important; min-width: 180px !important; flex-basis: 50% !important; flex: none !important;';
              sidebar.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)';
              sidebar.style.backdropFilter = 'blur(20px) saturate(180%)';
              sidebar.style.borderRadius = '0 16px 16px 0';
              sidebar.style.boxShadow = '4px 0 32px rgba(0,0,0,0.12), 2px 0 16px rgba(107,70,193,0.08)';
              sidebar.style.transform = 'translateX(0)';
              sidebar.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              
              // Force attribute override
              sidebar.setAttribute('style', sidebar.style.cssText);
              sidebar.setAttribute('data-nuclear', 'applied');
              
              const closeBtn = sidebar.querySelector('.navbar-sidebar__close');
              if (closeBtn) {
                console.log('💥 NUCLEAR CLOSE BUTTON APPLY');
                closeBtn.innerHTML = '';
                closeBtn.textContent = '✕ CLOSE';
                closeBtn.style.cssText = 'all: unset !important; position: absolute !important; top: 1rem !important; right: 1rem !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; width: 70px !important; height: 36px !important; background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%) !important; border-radius: 8px !important; color: white !important; font-weight: 700 !important; font-size: 12px !important; letter-spacing: 1px !important; z-index: 10000 !important; box-shadow: 0 4px 12px rgba(107,70,193,0.4), 0 2px 6px rgba(139,92,246,0.3) !important; cursor: pointer !important;';
                closeBtn.setAttribute('style', closeBtn.style.cssText);
              }
              
              const backdrop = document.querySelector('.navbar-sidebar__backdrop');
              if (backdrop) {
                backdrop.style.background = 'radial-gradient(circle at center, rgba(107,70,193,0.15) 0%, rgba(0,0,0,0.7) 70%)';
                backdrop.style.backdropFilter = 'blur(8px) saturate(120%)';
              }
              
              return true;
            }
            
            return false;
          }
          
          function startNuclearOption() {
            // Apply immediately
            nuclearApply();
            
            // Ultra-aggressive monitoring
            const monitor = setInterval(() => {
              if (retryCount >= maxRetries) {
                clearInterval(monitor);
                return;
              }
              nuclearApply();
            }, 100);
            
            // MutationObserver for DOM changes
            const observer = new MutationObserver((mutations) => {
              let shouldApply = false;
              mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || 
                    (mutation.type === 'attributes' && 
                     mutation.target.classList && 
                     mutation.target.classList.contains('navbar-sidebar'))) {
                  shouldApply = true;
                }
              });
              
              if (shouldApply) {
                setTimeout(nuclearApply, 50);
              }
            });
            
            observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['style', 'class']
            });
            
            // Window events
            window.addEventListener('resize', () => setTimeout(nuclearApply, 100));
            window.addEventListener('orientationchange', () => setTimeout(nuclearApply, 200));
            
            console.log('💥 NUCLEAR MONITORING ACTIVE');
          }
          
          // Start nuclear option
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startNuclearOption);
          } else {
            startNuclearOption();
          }
          
          // Backup triggers
          setTimeout(startNuclearOption, 500);
          setTimeout(nuclearApply, 1000);
          setTimeout(nuclearApply, 2000);
          setTimeout(nuclearApply, 5000);
          
        })();
        
        // Legacy fallback
        if (window.innerWidth <= 996) {
          document.addEventListener('DOMContentLoaded', function() {
            // Hide title elements
            document.querySelectorAll('.navbar__title, .navbar__brand b').forEach(el => {
              el.style.display = 'none';
              el.style.visibility = 'hidden';
            });
            
            // Monitor sidebar
            new MutationObserver(() => {
              const sidebar = document.querySelector('.navbar-sidebar');
              if (sidebar && sidebar.style.display !== 'none') {
                sidebar.style.width = '50%';
                sidebar.style.maxWidth = '220px';
                sidebar.style.minWidth = '180px';
                sidebar.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)';
                sidebar.style.backdropFilter = 'blur(20px) saturate(180%)';
                sidebar.style.borderRadius = '0 16px 16px 0';
                sidebar.style.boxShadow = '4px 0 32px rgba(0,0,0,0.12), 2px 0 16px rgba(107,70,193,0.08)';
                
                const closeBtn = sidebar.querySelector('.navbar-sidebar__close');
                if (closeBtn && !closeBtn.textContent.includes('✕ CLOSE')) {
                  closeBtn.innerHTML = '✕ CLOSE';
                  closeBtn.style.cssText = 'all: unset !important; position: absolute !important; top: 1rem !important; right: 1rem !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; width: 70px !important; height: 36px !important; background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%) !important; border-radius: 8px !important; color: white !important; font-weight: 700 !important; font-size: 12px !important; letter-spacing: 1px !important; z-index: 10000 !important; box-shadow: 0 4px 12px rgba(107,70,193,0.4), 0 2px 6px rgba(139,92,246,0.3) !important;';
                }
              }
            }).observe(document.body, { childList: true, subtree: true });
          });
        }
      `,
    },
  ],
};

export default config;
