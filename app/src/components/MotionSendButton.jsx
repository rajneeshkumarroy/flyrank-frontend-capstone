import React, { useEffect, useRef, useState } from 'react';

const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default function MotionSendButton({
  forceState = null,
  onStateChange,
}) {
  const [state, setState] = useState(STATES.IDLE);
  const timeoutRef = useRef(null);

  // --------------------------------------------------
  // Sync externally forced states
  // --------------------------------------------------

  useEffect(() => {
    if (forceState === 'success') {
      runSuccess();
    }

    if (forceState === 'error') {
      runError();
    }
  }, [forceState]);

  // --------------------------------------------------
  // Cleanup timers
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // --------------------------------------------------
  // Update state
  // --------------------------------------------------

  const updateState = (nextState) => {
    setState(nextState);
    onStateChange?.(nextState);
  };

  // --------------------------------------------------
  // Fake async request
  // --------------------------------------------------

  const handleSend = () => {
    // Prevent spam clicking while processing
    if (state === STATES.LOADING) {
      return;
    }

    updateState(STATES.LOADING);

    const delay = 900 + Math.random() * 1200;

    timeoutRef.current = setTimeout(() => {
      const failed = Math.random() < 0.2;

      if (failed) {
        runError();
      } else {
        runSuccess();
      }
    }, delay);
  };

  // --------------------------------------------------
  // Success state
  // --------------------------------------------------

  const runSuccess = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    updateState(STATES.SUCCESS);

    timeoutRef.current = setTimeout(() => {
      updateState(STATES.IDLE);
    }, 1400);
  };

  // --------------------------------------------------
  // Error state
  // --------------------------------------------------

  const runError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    updateState(STATES.ERROR);

    timeoutRef.current = setTimeout(() => {
      updateState(STATES.IDLE);
    }, 1600);
  };

  // --------------------------------------------------
  // Render content based on state
  // --------------------------------------------------

  const renderContent = () => {
    switch (state) {
      case STATES.LOADING:
        return (
          <>
            <span className="motion-button-spinner" aria-hidden="true" />
            <span>Sending...</span>
          </>
        );

      case STATES.SUCCESS:
        return (
          <>
            <span className="motion-button-icon success-icon">
              ✓
            </span>
            <span>Sent!</span>
          </>
        );

      case STATES.ERROR:
        return (
          <>
            <span className="motion-button-icon error-icon">
              !
            </span>
            <span>Retry</span>
          </>
        );

      default:
        return (
          <>
            <span className="motion-button-icon send-icon">
              ↑
            </span>
            <span>Send Message</span>
          </>
        );
    }
  };

  return (
    <button
      type="button"
      className={`motion-send-button motion-state-${state}`}
      onClick={state === STATES.ERROR ? handleSend : handleSend}
      disabled={state === STATES.LOADING}
      aria-label={
        state === STATES.LOADING
          ? 'Sending message'
          : state === STATES.SUCCESS
            ? 'Message sent successfully'
            : state === STATES.ERROR
              ? 'Sending failed. Retry'
              : 'Send message'
      }
    >
      <span className="motion-button-content">
        {renderContent()}
      </span>
    </button>
  );
}