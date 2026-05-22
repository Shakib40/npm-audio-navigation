/**
 * Tests for Audio Navigate library
 */

import { AudioNavigate } from '../src/index.js';

// Mock window.SpeechRecognition for testing
const mockSpeechRecognition = jest.fn();
const mockRecognitionInstance = {
  lang: '',
  continuous: false,
  interimResults: false,
  onresult: null,
  onerror: null,
  onend: null,
  start: jest.fn(),
  stop: jest.fn()
};

mockSpeechRecognition.mockImplementation(() => mockRecognitionInstance);

// Mock window object
global.window = {
  SpeechRecognition: mockSpeechRecognition,
  webkitSpeechRecognition: mockSpeechRecognition,
  innerHeight: 800
};

// Mock document methods
global.document = {
  querySelectorAll: jest.fn(),
  evaluate: jest.fn()
};

global.XPathResult = {
  ORDERED_NODE_SNAPSHOT_TYPE: 7
};

global.Event = jest.fn();

describe('AudioNavigate', () => {
  let audioNavigate;

  beforeEach(() => {
    jest.clearAllMocks();
    audioNavigate = new AudioNavigate();
  });

  describe('Constructor', () => {
    test('should initialize with default options', () => {
      expect(audioNavigate.options.language).toBe('en-US');
      expect(audioNavigate.options.continuous).toBe(true);
      expect(audioNavigate.options.interimResults).toBe(false);
    });

    test('should accept custom options', () => {
      const customOptions = {
        language: 'es-ES',
        continuous: false,
        interimResults: true
      };
      const customAudioNavigate = new AudioNavigate(customOptions);
      
      expect(customAudioNavigate.options.language).toBe('es-ES');
      expect(customAudioNavigate.options.continuous).toBe(false);
      expect(customAudioNavigate.options.interimResults).toBe(true);
    });
  });

  describe('Speech Recognition Support', () => {
    test('should return true when SpeechRecognition is supported', () => {
      expect(audioNavigate.isSupported()).toBe(true);
    });

    test('should return false when SpeechRecognition is not supported', () => {
      global.window = {};
      const unsupportedAudioNavigate = new AudioNavigate();
      expect(unsupportedAudioNavigate.isSupported()).toBe(false);
    });

    test('should return unsupported status when not supported', () => {
      global.window = {};
      const unsupportedAudioNavigate = new AudioNavigate();
      expect(unsupportedAudioNavigate.getStatus()).toBe('unsupported');
    });
  });

  describe('Command Parsing', () => {
    test('should parse scroll down commands', () => {
      const commands = ['go down', 'scroll down', 'move down', 'down'];
      
      commands.forEach(command => {
        const result = audioNavigate.parseCommand(command);
        expect(result).toEqual({
          type: 'scroll',
          action: 'down',
          target: 'window'
        });
      });
    });

    test('should parse scroll up commands', () => {
      const commands = ['go up', 'scroll up', 'move up', 'up'];
      
      commands.forEach(command => {
        const result = audioNavigate.parseCommand(command);
        expect(result).toEqual({
          type: 'scroll',
          action: 'up',
          target: 'window'
        });
      });
    });

    test('should parse click commands', () => {
      const result = audioNavigate.parseCommand('click submit button');
      expect(result).toEqual({
        type: 'click',
        action: 'click',
        target: 'submit button'
      });
    });

    test('should parse fill commands', () => {
      const result = audioNavigate.parseCommand('fill John Doe in name field');
      expect(result).toEqual({
        type: 'fill',
        action: 'fill',
        target: 'name field',
        value: 'John Doe'
      });
    });

    test('should parse select commands', () => {
      const result = audioNavigate.parseCommand('select Option 2 from dropdown');
      expect(result).toEqual({
        type: 'select',
        action: 'select',
        target: 'dropdown',
        value: 'Option 2'
      });
    });

    test('should return null for unrecognized commands', () => {
      const result = audioNavigate.parseCommand('random text that is not a command');
      expect(result).toBeNull();
    });
  });

  describe('Listening Control', () => {
    test('should start listening when startListening is called', () => {
      audioNavigate.startListening();
      expect(mockRecognitionInstance.start).toHaveBeenCalled();
      expect(audioNavigate.isListening).toBe(true);
    });

    test('should stop listening when stopListening is called', () => {
      audioNavigate.startListening();
      audioNavigate.stopListening();
      expect(mockRecognitionInstance.stop).toHaveBeenCalled();
      expect(audioNavigate.isListening).toBe(false);
    });

    test('should not start listening if already listening', () => {
      audioNavigate.startListening();
      const callCount = mockRecognitionInstance.start.mock.calls.length;
      audioNavigate.startListening();
      expect(mockRecognitionInstance.start).toHaveBeenCalledTimes(callCount);
    });

    test('should not stop listening if not listening', () => {
      audioNavigate.stopListening();
      expect(mockRecognitionInstance.stop).not.toHaveBeenCalled();
    });
  });

  describe('Command Execution', () => {
    beforeEach(() => {
      // Mock window.scrollBy
      global.window.scrollBy = jest.fn();
      
      // Mock DOM elements
      const mockButton = { click: jest.fn() };
      const mockInput = { 
        value: '',
        dispatchEvent: jest.fn()
      };
      const mockSelect = {
        options: [
          { text: 'Option 1', value: 'option1' },
          { text: 'Option 2', value: 'option2' }
        ],
        selectedIndex: 0,
        dispatchEvent: jest.fn()
      };

      global.document.querySelectorAll = jest.fn((selector) => {
        if (selector.includes('button')) return [mockButton];
        if (selector.includes('input')) return [mockInput];
        if (selector.includes('select')) return [mockSelect];
        return [];
      });

      global.document.evaluate = jest.fn(() => ({
        snapshotLength: 1,
        snapshotItem: jest.fn(() => mockButton)
      }));
    });

    test('should execute scroll commands', () => {
      audioNavigate.executeCommand({ type: 'scroll', action: 'down' });
      expect(global.window.scrollBy).toHaveBeenCalledWith({
        top: 640, // 800 * 0.8
        behavior: 'smooth'
      });
    });

    test('should execute click commands', () => {
      audioNavigate.executeCommand({ type: 'click', action: 'click', target: 'submit' });
      const mockButton = global.document.querySelectorAll()[0];
      expect(mockButton.click).toHaveBeenCalled();
    });

    test('should execute fill commands', () => {
      audioNavigate.executeCommand({ 
        type: 'fill', 
        action: 'fill', 
        target: 'name', 
        value: 'John Doe' 
      });
      const mockInput = global.document.querySelectorAll()[0];
      expect(mockInput.value).toBe('John Doe');
      expect(mockInput.dispatchEvent).toHaveBeenCalledTimes(2); // input and change events
    });

    test('should execute select commands', () => {
      audioNavigate.executeCommand({ 
        type: 'select', 
        action: 'select', 
        target: 'dropdown', 
        value: 'Option 2' 
      });
      const mockSelect = global.document.querySelectorAll()[0];
      expect(mockSelect.selectedIndex).toBe(1);
      expect(mockSelect.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
    });
  });

  describe('Element Matching', () => {
    test('should match elements by text content', () => {
      const element = {
        textContent: 'Submit Button',
        placeholder: '',
        getAttribute: jest.fn(() => ''),
        name: ''
      };
      
      expect(audioNavigate.elementMatchesText(element, 'submit')).toBe(true);
      expect(audioNavigate.elementMatchesText(element, 'cancel')).toBe(false);
    });

    test('should match elements by placeholder', () => {
      const element = {
        textContent: '',
        placeholder: 'Enter your name',
        getAttribute: jest.fn(() => ''),
        name: ''
      };
      
      expect(audioNavigate.elementMatchesText(element, 'name')).toBe(true);
      expect(audioNavigate.elementMatchesText(element, 'email')).toBe(false);
    });

    test('should match elements by aria-label', () => {
      const element = {
        textContent: '',
        placeholder: '',
        getAttribute: jest.fn((attr) => attr === 'aria-label' ? 'Search field' : ''),
        name: ''
      };
      
      expect(audioNavigate.elementMatchesText(element, 'search')).toBe(true);
      expect(audioNavigate.elementMatchesText(element, 'filter')).toBe(false);
    });

    test('should match elements by name', () => {
      const element = {
        textContent: '',
        placeholder: '',
        getAttribute: jest.fn(() => ''),
        name: 'username'
      };
      
      expect(audioNavigate.elementMatchesText(element, 'username')).toBe(true);
      expect(audioNavigate.elementMatchesText(element, 'password')).toBe(false);
    });
  });
});
