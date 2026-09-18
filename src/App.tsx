import { useState, useEffect } from 'react';
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
import { Agentation } from 'agentation';
import { AquaSolLoader } from './components/exact/AquaSolLoader';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [loaderDone, setLoaderDone] = useState(() => {
    // Force replay if URL contains ?loader or ?replay
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('loader') || params.has('replay') || params.has('station')) {
        return false;
      }
    }
    // Skip loader if already played this session
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('aquasol-loader-played')) {
      return true;
    }
    return false;
  });

  // Expose replay function globally for developer testing
  useEffect(() => {
    (window as any).replayAquaSolLoader = () => {
      sessionStorage.removeItem('aquasol-loader-played');
      setLoaderDone(false);
    };
  }, []);

  // Smooth scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Ensure Agentation feedback toolbar is always visible and never stuck hidden in sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('agentation-session-toolbar-hidden');
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <>
      {!loaderDone && (
        <AquaSolLoader
          logoSrc="/assets/aquasol-emblem-hd.png"
          onComplete={() => setLoaderDone(true)}
        />
      )}
      <div
        className={loaderDone ? 'aquasol-site-reveal visible' : 'aquasol-site-reveal'}
        style={!loaderDone ? { visibility: 'hidden' } : undefined}
      >
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
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
        <Footer onNavigate={setCurrentPage} />
        <Agentation />
      </div>
    </>
  );
}

export default App;
