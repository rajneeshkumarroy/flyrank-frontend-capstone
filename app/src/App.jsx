import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import Chat from './components/Chat';
import ProductStudioSkeleton from './components/ProductStudio/ProductStudioSkeleton';
import './App.css';

const ProductStudio = lazy(() => import('./components/ProductStudio/ProductStudio'));

/* ==================================================
   FE-AA1 — BUTTONS WITH A BRAIN
   ================================================== */

function MotionButton({ label = 'Send message' }) {
  const [state, setState] = useState('idle');
  const timeoutRef = useRef(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const runAction = (forcedResult = null) => {
    if (state === 'loading') return;

    clearTimer();
    setState('loading');

    const delay =
      forcedResult === 'success' || forcedResult === 'error'
        ? 900
        : 700 + Math.floor(Math.random() * 1300);

    timeoutRef.current = setTimeout(() => {
      const result =
        forcedResult ||
        (Math.random() < 0.2 ? 'error' : 'success');

      setState(result);

      timeoutRef.current = setTimeout(() => {
        setState('idle');
      }, 1800);
    }, delay);
  };

  const handleClick = () => {
    runAction();
  };

  const handleForceSuccess = () => {
    runAction('success');
  };

  const handleForceError = () => {
    runAction('error');
  };

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <span className="motion-spinner" aria-hidden="true" />
            <span>Sending...</span>
          </>
        );

      case 'success':
        return (
          <>
            <span className="motion-icon" aria-hidden="true">
              ✓
            </span>
            <span>Sent!</span>
          </>
        );

      case 'error':
        return (
          <>
            <span className="motion-icon" aria-hidden="true">
              !
            </span>
            <span>Try again</span>
          </>
        );

      default:
        return (
          <>
            <span>{label}</span>
            <span aria-hidden="true">→</span>
          </>
        );
    }
  };

  return (
    <div className="motion-demo" id="motion-demo-section">
      <div className="motion-demo-card">
        <div className="motion-demo-header">
          <div>
            <p className="eyebrow">FE-AA1 · MICRO-INTERACTION</p>

            <h2>Buttons with a Brain</h2>

            <p className="motion-description">
              A state-aware button that communicates idle,
              loading, success, and error through intentional
              motion.
            </p>
          </div>

          <div
            className={`motion-state-badge state-${state}`}
            aria-live="polite"
          >
            <span className="state-dot" />
            {state}
          </div>
        </div>

        <div className="motion-preview">
          <p className="preview-label">
            Interactive preview
          </p>

          <button
            type="button"
            className={`brain-button brain-button-${state}`}
            onClick={handleClick}
            disabled={state === 'loading'}
            aria-label={
              state === 'loading'
                ? 'Sending message'
                : state === 'success'
                  ? 'Message sent successfully'
                  : state === 'error'
                    ? 'Sending failed. Retry'
                    : 'Send message'
            }
          >
            <span className="button-content">
              {getButtonContent()}
            </span>
          </button>

          <p className="motion-help">
            Click the button to simulate a real async
            operation with a random 20% failure rate.
          </p>
        </div>

        <div className="motion-controls">
          <div>
            <p className="controls-title">
              Test specific states
            </p>

            <p className="controls-description">
              Reviewers can trigger both outcomes on demand.
            </p>
          </div>

          <div className="force-buttons">
            <button
              type="button"
              className="force-button"
              onClick={handleForceSuccess}
              disabled={state === 'loading'}
            >
              Force Success
            </button>

            <button
              type="button"
              className="force-button"
              onClick={handleForceError}
              disabled={state === 'loading'}
            >
              Force Error
            </button>
          </div>
        </div>

        <div className="state-list">
          <div
            className={`state-item ${
              state === 'idle' ? 'current' : ''
            }`}
          >
            <span className="state-number">01</span>
            <div>
              <strong>Idle</strong>
              <span>Ready for interaction</span>
            </div>
          </div>

          <div
            className={`state-item ${
              state === 'loading' ? 'current' : ''
            }`}
          >
            <span className="state-number">02</span>
            <div>
              <strong>Loading</strong>
              <span>Request is being processed</span>
            </div>
          </div>

          <div
            className={`state-item ${
              state === 'success' ? 'current' : ''
            }`}
          >
            <span className="state-number">03</span>
            <div>
              <strong>Success</strong>
              <span>Action completed successfully</span>
            </div>
          </div>

          <div
            className={`state-item ${
              state === 'error' ? 'current' : ''
            }`}
          >
            <span className="state-number">04</span>
            <div>
              <strong>Error</strong>
              <span>Action failed and can be retried</span>
            </div>
          </div>
        </div>

        <div className="motion-notes">
          <h3>Motion decisions</h3>

          <p>
            Transitions use short, intentional easing for
            responsive feedback. Transform and opacity are
            prioritized so animations remain compositor-friendly.
            Error motion is reduced automatically when the user
            prefers reduced motion.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==================================================
   APPLICATION
   ================================================== */

export default function App() {
  return (
    <main className="app">
      {/* Studio Top Navigation Header */}
      <header className="app-top-nav" aria-label="FlyRank Studio Navigation">
        <div className="nav-brand">
          <span className="brand-dot" aria-hidden="true" />
          <h1 className="brand-name">FlyRank Engineering Capstone</h1>
        </div>
        <nav className="nav-links" aria-label="Capstone Modules">
          <a href="#3d-studio" className="nav-link">
            3D Studio
          </a>
          <a href="#chat-assistant" className="nav-link">
            AI Assistant
          </a>
          <a href="#motion-demo-section" className="nav-link">
            Micro-Interactions
          </a>
        </nav>
      </header>

      {/* FE-AA2: 3D Product Studio */}
      <div id="3d-studio" className="app-module-wrapper">
        <Suspense fallback={<ProductStudioSkeleton />}>
          <ProductStudio />
        </Suspense>
      </div>

      {/* FE-AA1: Buttons with a Brain */}
      <MotionButton label="Send message" />

      {/* FE-08 / FE-09: AI Assistant */}
      <div id="chat-assistant" className="app-module-wrapper">
        <Chat />
      </div>
    </main>
  );
}