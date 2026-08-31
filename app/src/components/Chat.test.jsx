import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Chat from './Chat';
import { useChat } from '@ai-sdk/react';

vi.mock('@ai-sdk/react', () => ({
  useChat: vi.fn(),
}));

describe('Chat Component', () => {
  let mockUseChat;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseChat = {
      messages: [],
      sendMessage: vi.fn(),
      status: 'ready',
      stop: vi.fn(),
      regenerate: vi.fn(),
      error: undefined,
    };
    
    useChat.mockReturnValue(mockUseChat);
  });

  // A. Chat rendering
  it('renders chat assistant heading and input', () => {
    render(<Chat />);
    expect(screen.getByRole('heading', { name: /FlyRank Frontend Assistant/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Message/i })).toBeInTheDocument();
  });

  // B. Chat pending/submitted state
  it('displays "Thinking..." state when status is submitted', () => {
    useChat.mockReturnValue({ ...mockUseChat, status: 'submitted' });
    render(<Chat />);
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
  });

  // C. Chat streaming state
  it('displays generating status and Stop button when streaming', () => {
    useChat.mockReturnValue({ ...mockUseChat, status: 'streaming' });
    render(<Chat />);
    expect(screen.getByText('Generating')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Stop generating response/i })).toBeInTheDocument();
  });

  // D. Chat error state
  it('displays error message, retry button, and triggers regenerate on retry', async () => {
    useChat.mockReturnValue({ ...mockUseChat, error: new Error('Failed to connect') });
    render(<Chat />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Response interrupted')).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: /Retry the failed assistant response/i });
    expect(retryButton).toBeInTheDocument();
    
    const user = userEvent.setup();
    await user.click(retryButton);
    expect(mockUseChat.regenerate).toHaveBeenCalledTimes(1);
  });

  // E. Chat message rendering
  it('renders user and assistant messages correctly', () => {
    useChat.mockReturnValue({
      ...mockUseChat,
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
        { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'Hi there' }] }
      ]
    });
    render(<Chat />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getAllByText('Assistant').length).toBeGreaterThan(0);
  });

  // F. Chat input behavior (Validated form)
  it('allows user to type and send a message, then clears input', async () => {
    render(<Chat />);
    const user = userEvent.setup();
    const input = screen.getByRole('textbox', { name: /Message/i });
    const sendButton = screen.getByRole('button', { name: 'Send' });
    
    // Validate empty form disables submission
    expect(sendButton).toBeDisabled();
    
    await user.type(input, 'Testing message');
    expect(input.value).toBe('Testing message');
    expect(sendButton).toBeEnabled();
    
    await user.click(sendButton);
    expect(mockUseChat.sendMessage).toHaveBeenCalledWith({ text: 'Testing message' });
    expect(input.value).toBe('');
  });

  // G. Suggestion behavior
  it('populates message input when clicking a suggestion', async () => {
    render(<Chat />);
    const user = userEvent.setup();
    const suggestionButton = screen.getByRole('button', { name: /Explain React useEffect/i });
    const input = screen.getByRole('textbox', { name: /Message/i });
    
    await user.click(suggestionButton);
    expect(input.value).toBe('Explain React useEffect in simple terms.');
  });
});
