import React from 'react';
import { Sun, Moon } from '@phosphor-icons/react';
import { Language, Theme } from '../types/bac';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  onGoHome?: () => void;
  activeUnitBadge?: string;
  activeUnitName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  onGoHome,
  activeUnitBadge,
  activeUnitName,
}) => {
  const isAr = language === 'ar';

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Breadcrumb */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={onGoHome}
            title={isAr ? 'العودة للصفحة الرئيسية' : 'Retour à l\'accueil'}
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-mono font-bold text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              3M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                  {isAr ? 'بكالوريا رياضيات' : 'Bac Mathélème'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  2008–2026
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <span>{isAr ? 'الجزائر' : 'Algérie'}</span>
                {activeUnitName && (
                  <>
                    <span>/</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                      {activeUnitBadge && <span className="font-mono text-emerald-600 dark:text-emerald-400">{activeUnitBadge}</span>}
                      <span>{activeUnitName}</span>
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Right Controls: Language & Theme Toggles */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-0.5">
              <button
                onClick={() => onLanguageChange('ar')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  isAr
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="العربية (RTL)"
                data-cursor-interactive="true"
              >
                العربية
              </button>
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all font-mono ${
                  !isAr
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Français (LTR)"
                data-cursor-interactive="true"
              >
                FR
              </button>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={onThemeToggle}
              aria-label="Toggle theme"
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
              title={
                theme === 'dark'
                  ? isAr
                    ? 'تفعيل الوضع النهاري'
                    : 'Mode clair'
                  : isAr
                  ? 'تفعيل الوضع الليلي'
                  : 'Mode sombre'
              }
              data-cursor-interactive="true"
            >
              {theme === 'dark' ? (
                <Sun size={15} weight="bold" />
              ) : (
                <Moon size={15} weight="bold" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
