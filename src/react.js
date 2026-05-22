/**
 * React integration for Audio Navigate
 * Provides hooks and components for React applications
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { AudioNavigate } from './index.js';

export function useAudioNavigate(options = {}) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const audioNavigateRef = useRef(null);

  useEffect(() => {
    audioNavigateRef.current = new AudioNavigate({
      ...options,
      onCommand: (command) => {
        setLastCommand(command);
        options.onCommand?.(command);
      },
      onResult: (result) => {
        setTranscript(result);
        options.onResult?.(result);
      },
      onError: (err) => {
        setError(err);
        options.onError?.(err);
      }
    });

    return () => {
      if (audioNavigateRef.current) {
        audioNavigateRef.current.stopListening();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (audioNavigateRef.current) {
      audioNavigateRef.current.startListening();
      setIsListening(true);
      setError(null);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (audioNavigateRef.current) {
      audioNavigateRef.current.stopListening();
      setIsListening(false);
    }
  }, []);

  const isSupported = audioNavigateRef.current?.isSupported() ?? false;
  const status = audioNavigateRef.current?.getStatus() ?? 'unsupported';

  return {
    isListening,
    isSupported,
    status,
    lastCommand,
    transcript,
    startListening,
    stopListening,
    error
  };
}

export function AudioNavigateButton({ 
  children, 
  onStart, 
  onStop, 
  className = '',
  options = {} 
}) {
  const { isListening, isSupported, startListening, stopListening } = useAudioNavigate(options);

  const handleClick = () => {
    if (isListening) {
      stopListening();
      onStop?.();
    } else {
      startListening();
      onStart?.();
    }
  };

  if (!isSupported) {
    return (
      <button className={className} disabled>
        {children} (Not Supported)
      </button>
    );
  }

  return (
    <button 
      className={className}
      onClick={handleClick}
      aria-label={`Audio navigation ${isListening ? 'on' : 'off'}`}
    >
      {children} {isListening ? '🔴' : '⚪'}
    </button>
  );
}

export function AudioNavigateStatus({ 
  className = '', 
  showTranscript = true,
  showLastCommand = true 
}) {
  const { status, transcript, lastCommand, error } = useAudioNavigate();

  return (
    <div className={`audio-navigate-status ${className}`}>
      <div>Status: {status}</div>
      {error && <div className="error">Error: {error.message}</div>}
      {showTranscript && transcript && <div>Last transcript: "{transcript}"</div>}
      {showLastCommand && lastCommand && (
        <div>Last command: {lastCommand.type} - {lastCommand.action}</div>
      )}
    </div>
  );
}
