import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MotionSendButton from './MotionSendButton';

describe('MotionSendButton', () => {

  it('renders the idle state initially', () => {
    render(<MotionSendButton />);
    const button = screen.getByRole('button', { name: /Send message/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('clicking starts loading state and disables the button', async () => {
    const user = userEvent.setup();
    render(<MotionSendButton />);
    
    const button = screen.getByRole('button', { name: /Send message/i });
    
    await user.click(button);
    
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('prevents duplicate activation when loading', async () => {
    const user = userEvent.setup();
    const onStateChange = vi.fn();
    render(<MotionSendButton onStateChange={onStateChange} />);
    
    const button = screen.getByRole('button', { name: /Send message/i });
    
    await user.click(button); // Trigger loading
    
    // Attempt double click while disabled
    await user.click(button);
    
    // Only the first click triggered the loading state transition
    expect(onStateChange).toHaveBeenCalledWith('loading');
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  it('can be forced into success state', () => {
    const { rerender } = render(<MotionSendButton forceState={null} />);
    
    rerender(<MotionSendButton forceState="success" />);
    
    expect(screen.getByText('Sent!')).toBeInTheDocument();
  });

  it('can be forced into error state', () => {
    const { rerender } = render(<MotionSendButton forceState={null} />);
    
    rerender(<MotionSendButton forceState="error" />);
    
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
});
