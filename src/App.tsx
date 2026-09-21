import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Navbar } from './components/exact/Navbar';
import { Footer } from './components/exact/Footer';
import { LandingPage } from './pages/LandingPage';
import { TeaserOne } from './pages/TeaserOne';
import { TeaserTwo } from './pages/TeaserTwo';
import { StyleGuide } from './pages/StyleGuide';
import { LicensingPage } from './pages/LicensingPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { TemplateGuidePage } from './pages/TemplateGuidePage';
import { ChangeLogPage } from './pages/ChangeLogPage';
import { PasswordPage } from './pages/PasswordPage';
// Dev-only feedback toolbar. `import.meta.env.DEV` is statically replaced at build time,
// so the dynamic import below is dead-code-eliminated and `agentation` never reaches production.
const Agentation = import.meta.env.DEV
  ? lazy(() => import('agentation').then((m) => ({ default: m.Agentation })))
  : null;
// three.js is ~600 kB and the loader plays at most once per session, so it must not sit
// in the main chunk. Returning visitors (sessionStorage) now never download it at all.
const AquaSolLoader = lazy(() =>
  import('./components/exact/AquaSolLoader/AquaSolLoader').then((m) => ({ default: m.AquaSolLoader })),
);

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [loaderDone, setLoaderDone] = useState(() => {
    // Force replay if URL contains ?loader or ?replay
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (
        params.has('loader') ||
        params.has('replay') ||
        params.has('station') ||
        params.has('hold') ||
        params.has('p') ||
        params.has('vortex')
      ) {
        return false;
      }
    }
    // Skip loader if already played this session
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('aquasol-loader-played')) {
      return true;
    }
    return false;
  });

  const [siteRevealing, setSiteRevealing] = useState(loaderDone);

  // Expose replay function globally for developer testing
  useEffect(() => {
    (window as any).replayAquaSolLoader = () => {
      sessionStorage.removeItem('aquasol-loader-played');
      setSiteRevealing(false);
      setLoaderDone(false);
    };
  }, []);

  // Smooth scroll to top on page transition
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, [currentPage]);

  // Ensure the dev feedback toolbar is never stuck hidden in sessionStorage. Dev only.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    try {
      sessionStorage.removeItem('agentation-session-toolbar-hidden');
    } catch {
      // ignore
    }
  }, []);

  const handleRelease = useCallback(() => {
    setSiteRevealing(true);
  }, []);

  const handleComplete = useCallback(() => {
    setSiteRevealing(true);
    setLoaderDone(true);
  }, []);

  return (
    <>
      {!loaderDone && (
        <Suspense fallback={null}>
          <AquaSolLoader
            onRelease={handleRelease}
            onComplete={handleComplete}
          />
        </Suspense>
      )}
      <div
        className={siteRevealing || loaderDone ? 'aquasol-site-reveal visible' : 'aquasol-site-reveal'}
        style={!siteRevealing && !loaderDone ? { visibility: 'hidden' } : undefined}
      >
        <a href="#main" className="skip-link">Skip to main content</a>
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main id="main" tabIndex={-1}>
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'teaser-1' && <TeaserOne />}
        {currentPage === 'teaser-2' && <TeaserTwo />}
        {currentPage === 'style-guide' && <StyleGuide />}
        {currentPage === 'licensing' && <LicensingPage />}
        {currentPage === 'template-guide' && <TemplateGuidePage />}
        {currentPage === 'change-log' && <ChangeLogPage />}
        {currentPage === 'password' && <PasswordPage />}
        {currentPage === 'not-found' && (
          <NotFoundPage onGoHome={() => setCurrentPage('landing')} />
        )}
        </main>
        <Footer onNavigate={setCurrentPage} />
        {Agentation && (
          <Suspense fallback={null}>
            <Agentation />
          </Suspense>
        )}
      </div>
    </>
  );
}

export default App;
