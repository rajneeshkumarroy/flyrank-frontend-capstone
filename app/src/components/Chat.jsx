import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

function getMessageText(message) {
  return message.parts
    ?.filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('') || '';
}

export default function Chat() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const {
    messages,
    sendMessage,
    status,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const isStreaming = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages, isNearBottom]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsNearBottom(distanceFromBottom < 100);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = input.trim();

    if (!text || isStreaming) return;

    sendMessage({ text });
    setInput('');
    setIsNearBottom(true);
  };

  return (
    <section className="chat-section">
      <div className="chat-header">
        <div>
          <p className="eyebrow">AI ASSISTANT</p>
          <h2>FlyRank Frontend Assistant</h2>
          <p>
            Ask about React, frontend development, accessibility,
            AI engineering, or your internship assignments.
          </p>
        </div>

        <div
          className={`status-indicator ${
            isStreaming ? 'active' : ''
          }`}
          aria-live="polite"
        >
          <span />
          {isStreaming ? 'Generating' : 'Ready'}
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="chat-messages"
        onScroll={handleScroll}
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 && (
          <div className="chat-empty">
            <h3>How can I help?</h3>
            <p>
              Try asking:
              <br />
              "Explain React useEffect in simple terms."
            </p>
          </div>
        )}

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
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>

              <div className="message-content">
                {text}
              </div>
            </div>
          );
        })}

        {status === 'submitted' && (
          <div className="chat-message assistant-message">
            <div className="message-role">Assistant</div>

            <div className="thinking-indicator" aria-label="Thinking">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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
        >
          ↓ Jump to latest
        </button>
      )}

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>

        <textarea
          id="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask something..."
          rows={1}
          disabled={isStreaming}
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
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim()}
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
