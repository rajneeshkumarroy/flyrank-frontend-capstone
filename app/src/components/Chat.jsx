import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

function getMessageText(message) {
  return (
    message.parts
      ?.filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('') || ''
  );
}

export default function Chat() {
  const [input, setInput] = useState('');

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [isNearBottom, setIsNearBottom] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  // ==================================================
  // FE-08 SABOTAGE TEST MODE
  // ==================================================
  //
  // null         = normal application
  // 'error'      = simulate API/server error
  // 'rate-limit' = simulate 429 rate limit
  // 'mid-stream' = simulate interrupted AI stream
  //
  // IMPORTANT:
  // Keep this as null for the final submission.
  // ==================================================

  const TEST_MODE = null;

  const {
    messages,
    sendMessage,
    status,
    stop,
    regenerate,
    error,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',

      // Send sabotage mode to the API during FE-08 testing.
      body: TEST_MODE
        ? {
            testMode: TEST_MODE,
          }
        : undefined,
    }),
  });

  const isStreaming =
    status === 'submitted' || status === 'streaming';

  // ==================================================
  // AUTO-SCROLL
  // ==================================================
  //
  // Automatically scroll while the user is already
  // near the bottom of the conversation.
  // ==================================================

  useEffect(() => {
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages, isNearBottom]);

  // ==================================================
  // SCROLL DETECTION
  // ==================================================

  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsNearBottom(distanceFromBottom < 100);
  };

  // ==================================================
  // SEND MESSAGE
  // ==================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = input.trim();

    // Prevent empty messages and duplicate requests.
    if (!text || isStreaming || isRetrying) {
      return;
    }

    sendMessage({ text });

    setInput('');
    setIsNearBottom(true);
  };

  // ==================================================
  // RETRY FAILED RESPONSE
  // ==================================================

  const handleRetry = async () => {
    // Prevent multiple retry requests.
    if (isStreaming || isRetrying) {
      return;
    }

    setIsRetrying(true);

    try {
      await regenerate();
    } catch (retryError) {
      console.error('Retry failed:', retryError);
    } finally {
      setIsRetrying(false);
    }
  };

  // ==================================================
  // EMPTY-STATE SUGGESTION
  // ==================================================

  const handleSuggestion = (question) => {
    setInput(question);

    // Move focus back to the input after selecting
    // a suggestion.
    requestAnimationFrame(() => {
      document.getElementById('chat-input')?.focus();
    });
  };

  return (
    <section
      className="chat-section"
      aria-label="FlyRank Frontend AI Assistant"
    >
      {/* ================= HEADER ================= */}

      <div className="chat-header">
        <div>
          <p className="eyebrow">AI ASSISTANT</p>

          <h2>FlyRank Frontend Assistant</h2>

          <p>
            Ask about React, frontend development,
            accessibility, AI engineering, or your
            internship assignments.
          </p>
        </div>

        <div
          className={`status-indicator ${
            isStreaming || isRetrying ? 'active' : ''
          }`}
          aria-live="polite"
        >
          <span />

          {isRetrying
            ? 'Retrying'
            : isStreaming
              ? 'Generating'
              : 'Ready'}
        </div>
      </div>

      {/* ================= MESSAGES ================= */}

      <div
        ref={messagesContainerRef}
        className="chat-messages"
        onScroll={handleScroll}
        aria-live="polite"
        aria-label="Conversation"
      >
        {/* ================= EMPTY STATE ================= */}

        {messages.length === 0 && !error && (
          <div className="chat-empty">
            <div
              className="empty-icon"
              aria-hidden="true"
            >
              ✦
            </div>

            <h3>How can I help?</h3>

            <p>
              Ask me anything about frontend development,
              React, accessibility, or your FlyRank
              internship assignments.
            </p>

            <div className="suggestion-list">
              <button
                type="button"
                className="suggestion-button"
                onClick={() =>
                  handleSuggestion(
                    'Explain React useEffect in simple terms.'
                  )
                }
              >
                Explain React useEffect
              </button>

              <button
                type="button"
                className="suggestion-button"
                onClick={() =>
                  handleSuggestion(
                    'How should I handle API errors in React?'
                  )
                }
              >
                Handle API errors in React
              </button>

              <button
                type="button"
                className="suggestion-button"
                onClick={() =>
                  handleSuggestion(
                    'Explain accessibility best practices for forms.'
                  )
                }
              >
                Accessibility best practices
              </button>
            </div>
          </div>
        )}

        {/* ================= CONVERSATION ================= */}

        {messages.map((message) => {
          const text = getMessageText(message);

          return (
            <div
              key={message.id}
              className={`chat-message ${
                message.role === 'user'
                  ? 'user-message'
                  : 'assistant-message'
              }`}
            >
              <div className="message-role">
                {message.role === 'user'
                  ? 'You'
                  : 'Assistant'}
              </div>

              <div className="message-content">
                {text || (
                  <span className="empty-response">
                    No response content was received.
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* ================= LOADING STATE ================= */}

        {status === 'submitted' && (
          <div
            className="chat-message assistant-message"
            aria-label="Assistant is thinking"
            aria-live="polite"
          >
            <div className="message-role">
              Assistant
            </div>

            <div className="thinking-state">
              <div className="thinking-indicator">
                <span />
                <span />
                <span />
              </div>

              <span className="thinking-text">
                Thinking...
              </span>
            </div>
          </div>
        )}

        {/* ================= ERROR STATE ================= */}

        {error && (
          <div
            className="chat-error"
            role="alert"
            aria-live="assertive"
          >
            <div
              className="error-icon"
              aria-hidden="true"
            >
              !
            </div>

            <div className="error-content">
              <div className="message-role">
                Assistant
              </div>

              <h3>Response interrupted</h3>

              <p>
                The assistant couldn't finish responding
                to your last message. Your conversation
                is still safe.
              </p>

              <button
                type="button"
                className="retry-button"
                onClick={handleRetry}
                disabled={isStreaming || isRetrying}
                aria-label="Retry the failed assistant response"
              >
                {isRetrying
                  ? 'Retrying...'
                  : 'Retry response'}
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ================= JUMP TO LATEST ================= */}

      {!isNearBottom && (
        <button
          type="button"
          className="jump-button"
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({
              behavior: 'smooth',
            });

            setIsNearBottom(true);
          }}
          aria-label="Jump to latest message"
        >
          ↓ Jump to latest
        </button>
      )}

      {/* ================= INPUT ================= */}

      <form
        className="chat-input-form"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="chat-input"
          className="sr-only"
        >
          Message
        </label>

        <textarea
          id="chat-input"
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          placeholder="Ask something..."
          rows={1}
          disabled={isStreaming || isRetrying}
          aria-label="Message"
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey
            ) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
        />

        {isStreaming ? (
          <button
            type="button"
            className="stop-button"
            onClick={stop}
            aria-label="Stop generating response"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="send-button"
            disabled={
              !input.trim() ||
              isRetrying
            }
          >
            Send
          </button>
        )}
      </form>

      <p className="chat-hint">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </section>
  );
}