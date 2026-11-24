import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { UnitDetailPage } from './components/UnitDetailPage';
import { PdfModal } from './components/PdfModal';
import { CustomCursor } from './components/CustomCursor';
import { getActiveUnitById } from './data/bacData';
import { Language, Theme, ExerciseStatus } from './types/bac';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('bac_archive_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('bac_archive_lang');
    if (saved === 'fr' || saved === 'ar') return saved;
    return 'ar';
  });

  // Active Unit navigation state: null = Page 1 (Home), string = Page 2 (Unit Detail)
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);

  // Bookmarks & Status in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bac_archive_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [exerciseStatuses, setExerciseStatuses] = useState<Record<string, ExerciseStatus>>(() => {
    try {
      const saved = localStorage.getItem('bac_archive_statuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // PDF modal state
  const [pdfModalState, setPdfModalState] = useState<{
    isOpen: boolean;
    url: string;
    page: number;
    subjectPage?: number;
    solutionPage?: number;
    title: string;
  }>({
    isOpen: false,
    url: '',
    page: 1,
    title: '',
  });

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bac_archive_theme', theme);
  }, [theme]);

  // Apply language direction to document
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('bac_archive_lang', language);
  }, [language]);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('bac_archive_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Persist statuses
  useEffect(() => {
    localStorage.setItem('bac_archive_statuses', JSON.stringify(exerciseStatuses));
  }, [exerciseStatuses]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const changeStatus = (id: string, status: ExerciseStatus) => {
    setExerciseStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenPdf = (
    url: string,
    page: number,
    title: string,
    subjectPage?: number,
    solutionPage?: number
  ) => {
    setPdfModalState({
      isOpen: true,
      url,
      page,
      subjectPage,
      solutionPage,
      title,
    });
  };

  const handleClosePdf = () => {
    setPdfModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const currentUnit = activeUnitId ? getActiveUnitById(activeUnitId) : undefined;
  const isAr = language === 'ar';

  return (
    <div className="min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      {/* Custom color-inverting cursor */}
      <CustomCursor />

      {/* Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        onGoHome={() => setActiveUnitId(null)}
        activeUnitBadge={currentUnit?.badge}
        activeUnitName={
          currentUnit ? (isAr ? currentUnit.nameAr : currentUnit.nameFr) : undefined
        }
      />

      {/* Main Content: Page 1 (Home) or Page 2 (Unit Detail) */}
      <main className="flex-1 flex flex-col">
        {!activeUnitId || !currentUnit ? (
          <HomePage language={language} onSelectUnit={(unitId) => setActiveUnitId(unitId)} />
        ) : (
          <UnitDetailPage
            unit={currentUnit}
            language={language}
            onBack={() => setActiveUnitId(null)}
            onOpenPdf={handleOpenPdf}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            exerciseStatuses={exerciseStatuses}
            onChangeStatus={changeStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[11px]">
            {isAr
              ? 'أرشيف مواضيع البكالوريا الرسمية • وزارة التربية الوطنية الجزائرية'
              : 'Archive officielle des épreuves du Baccalauréat • Ministère de l\'Éducation'}
          </p>
          <p className="font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
            3M • 2008 – 2026
          </p>
        </div>
      </footer>

      {/* Embedded PDF Modal */}
      <PdfModal
        isOpen={pdfModalState.isOpen}
        onClose={handleClosePdf}
        pdfUrl={pdfModalState.url}
        initialPage={pdfModalState.page}
        subjectPage={pdfModalState.subjectPage}
        solutionPage={pdfModalState.solutionPage}
        title={pdfModalState.title}
        language={language}
      />
    </div>
  );
};
export default App;
