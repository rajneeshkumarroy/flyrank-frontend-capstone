import React, { useRef, useState } from 'react';

const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function MotionDemo() {
  const [state, setState] = useState(STATES.IDLE);
  const requestRef = useRef(0);

  const runDemo = async (forcedResult = null) => {
    if (state === STATES.LOADING) return;

    const requestId = ++requestRef.current;

    setState(STATES.LOADING);

    await wait(900);

    if (requestId !== requestRef.current) return;

    const result =
      forcedResult ||
      (Math.random() < 0.2
        ? STATES.ERROR
        : STATES.SUCCESS);

    setState(result);

    await wait(1400);

    if (requestId === requestRef.current) {
      setState(STATES.IDLE);
    }
  };

  const getButtonContent = () => {
    switch (state) {
      case STATES.LOADING:
        return (
          <span className="motion-button-content">
            <span className="motion-button-spinner" />
            Sending...
          </span>
        );

      case STATES.SUCCESS:
        return (
          <span className="motion-button-content">
            <span className="motion-button-icon success-icon">
              ✓
            </span>
            Sent
          </span>
        );

      case STATES.ERROR:
        return (
          <span className="motion-button-content">
            <span className="motion-button-icon error-icon">
              !
            </span>
            Retry
          </span>
        );

      default:
        return (
          <span className="motion-button-content">
            Send message
          </span>
        );
    }
  };

  return (
    <section className="motion-demo-page">
      <div className="motion-demo-container">

        {/* HEADER */}
        <header className="motion-demo-header">
          <p className="motion-eyebrow">
            FE-AA1 · MICRO-INTERACTIONS
          </p>

          <h1>Buttons with a Brain</h1>

          <p className="motion-demo-description">
            A state-aware Send button designed to communicate
            idle, loading, success, and error states through
            intentional motion.
          </p>
        </header>

        {/* MAIN DEMO */}
        <section className="motion-demo-card">

          <div className="motion-demo-card-header">
            <div>
              <p className="motion-card-label">
                INTERACTIVE DEMO
              </p>

              <h2>Send message</h2>
            </div>

            <div
              className={`motion-state-badge state-${state}`}
              aria-live="polite"
            >
              <span />
              {state}
            </div>
          </div>

          <div className="motion-button-stage">

            <button
              type="button"
              className={`motion-send-button motion-state-${state}`}
              onClick={() => runDemo()}
              disabled={state === STATES.LOADING}
              aria-label={`Send message. Current state: ${state}`}
            >
              {getButtonContent()}
            </button>

          </div>

          {/* FORCE STATES */}
          <div className="motion-controls">
            <p className="motion-controls-label">
              Test states
            </p>

            <div className="motion-control-buttons">

              <button
                type="button"
                className="motion-control-button"
                onClick={() => runDemo(STATES.SUCCESS)}
                disabled={state === STATES.LOADING}
              >
                Force success
              </button>

              <button
                type="button"
                className="motion-control-button danger"
                onClick={() => runDemo(STATES.ERROR)}
                disabled={state === STATES.LOADING}
              >
                Force error
              </button>

              <button
                type="button"
                className="motion-control-button"
                onClick={() => {
                  requestRef.current++;
                  setState(STATES.IDLE);
                }}
              >
                Reset
              </button>

            </div>

            <p className="motion-demo-hint">
              Click Send for a simulated request with a 20%
              failure rate, or force either outcome for testing.
            </p>
          </div>

        </section>

        {/* STATE SYSTEM */}
        <section className="motion-states-section">

          <div className="motion-section-heading">
            <p className="motion-eyebrow">
              STATE SYSTEM
            </p>

            <h2>
              Every state communicates something
            </h2>
          </div>

          <div className="motion-state-grid">

            <article className="motion-state-card">
              <span className="state-number">01</span>
              <h3>Idle</h3>
              <p>
                The button is ready and invites the user
                to send a message.
              </p>
            </article>

            <article className="motion-state-card">
              <span className="state-number">02</span>
              <h3>Hover / Focus</h3>
              <p>
                Elevation and focus styling provide immediate
                interaction feedback.
              </p>
            </article>

            <article className="motion-state-card">
              <span className="state-number">03</span>
              <h3>Loading</h3>
              <p>
                The spinner and Sending label communicate
                that the request is being processed.
              </p>
            </article>

            <article className="motion-state-card">
              <span className="state-number">04</span>
              <h3>Success</h3>
              <p>
                A checkmark and short pop animation confirm
                that the message was sent.
              </p>
            </article>

            <article className="motion-state-card">
              <span className="state-number">05</span>
              <h3>Error</h3>
              <p>
                A shake and retry label communicate failure
                without requiring another message.
              </p>
            </article>

            <article className="motion-state-card">
              <span className="state-number">06</span>
              <h3>Disabled</h3>
              <p>
                Loading prevents duplicate submissions and
                protects the interaction from spam clicks.
              </p>
            </article>

          </div>
        </section>

        {/* MOTION NOTES */}
        <section className="motion-notes">

          <div>
            <p className="motion-eyebrow">
              DESIGN NOTES
            </p>

            <h2>
              Motion with intent.
            </h2>
          </div>

          <div className="motion-notes-content">

            <p>
              <strong>180–220ms</strong> transitions are used
              for hover, focus, and state changes because they
              feel responsive without becoming distracting.
            </p>

            <p>
              <strong>ease-out</strong> is used for entering
              and interactive motion so elements settle quickly.
              The active press uses a shorter <strong>80ms</strong>
              transition to make the interaction feel immediate.
            </p>

            <p>
              Animations rely on <strong>transform</strong> and
              <strong> opacity</strong> rather than layout-changing
              properties. Reduced-motion users receive the same
              state feedback without unnecessary animation.
            </p>

          </div>
        </section>

      </div>
    </section>
  );
}