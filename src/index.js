/**
 * Audio Navigate - Voice command library for web applications
 * Supports React.js and Angular.js integration
 */

export class AudioNavigate {
  constructor(options = {}) {
    this.recognition = null;
    this.options = {
      language: 'en-US',
      continuous: true,
      interimResults: false,
      ...options
    };
    this.isListening = false;

    this.initializeSpeechRecognition();
  }

  initializeSpeechRecognition() {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      const error = new Error('Speech recognition not supported in this browser');
      this.options.onError?.(error);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.lang = this.options.language;
    this.recognition.continuous = this.options.continuous;
    this.recognition.interimResults = this.options.interimResults;

    this.recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.toLowerCase().trim();
      
      this.options.onResult?.(transcript);
      
      if (event.results[current].isFinal) {
        const command = this.parseCommand(transcript);
        if (command) {
          this.executeCommand(command);
          this.options.onCommand?.(command);
        }
      }
    };

    this.recognition.onerror = (event) => {
      this.options.onError?.(new Error(event.error));
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  parseCommand(transcript) {
    const scrollCommands = ['go down', 'scroll down', 'move down', 'go up', 'scroll up', 'move up'];
    const clickCommands = ['click', 'press', 'activate'];
    const fillCommands = ['fill', 'type', 'enter', 'input'];
    const selectCommands = ['select dropdown', 'choose', 'pick', 'dropdown'];

    // Check for select commands first (they are more specific)
    if (selectCommands.some(cmd => transcript.includes(cmd))) {
      const selectMatch = transcript.match(/(?:select|choose|pick)\s+(.+?)\s+(?:from|in)\s+(.+)$/);
      if (selectMatch) {
        return {
          type: 'select',
          action: 'select',
          target: selectMatch[2].trim(),
          value: selectMatch[1].trim()
        };
      }
    }

    if (fillCommands.some(cmd => transcript.includes(cmd))) {
      const fillMatch = transcript.match(/(?:fill|type|enter|input)\s+(.+?)\s+(?:in|into|to)\s+(.+)$/);
      if (fillMatch) {
        return {
          type: 'fill',
          action: 'fill',
          target: fillMatch[2].trim(),
          value: fillMatch[1].trim()
        };
      }
    }

    if (clickCommands.some(cmd => transcript.includes(cmd))) {
      const targetMatch = transcript.match(/(?:click|press|activate)\s+(.+?)(?:\s+(?:button|element|link))?$/);
      return {
        type: 'click',
        action: 'click',
        target: targetMatch ? targetMatch[1].trim() : undefined
      };
    }

    // Check scroll commands last (they are most generic)
    if (scrollCommands.some(cmd => transcript.includes(cmd))) {
      return {
        type: 'scroll',
        action: transcript.includes('up') ? 'up' : 'down',
        target: 'window'
      };
    }

    // Handle simple scroll commands
    if (transcript === 'down' || transcript === 'up') {
      return {
        type: 'scroll',
        action: transcript,
        target: 'window'
      };
    }

    return null;
  }

  executeCommand(command) {
    switch (command.type) {
      case 'scroll':
        this.executeScroll(command.action);
        break;
      case 'click':
        this.executeClick(command.target);
        break;
      case 'fill':
        this.executeFill(command.target, command.value);
        break;
      case 'select':
        this.executeSelect(command.target, command.value);
        break;
    }
  }

  executeScroll(direction) {
    const scrollAmount = window.innerHeight * 0.8;
    window.scrollBy({
      top: direction === 'up' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  executeClick(target) {
    if (!target) {
      const clickableElements = document.querySelectorAll('button, a, [role="button"], [onclick]');
      if (clickableElements.length > 0) {
        clickableElements[0].click();
      }
      return;
    }

    const elements = this.findElementsByText(target);
    if (elements.length > 0) {
      elements[0].click();
    }
  }

  executeFill(target, value) {
    if (!target || !value) return;

    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea');
    for (const input of inputs) {
      if (this.elementMatchesText(input, target)) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  }

  executeSelect(target, value) {
    if (!target || !value) return;

    const selects = document.querySelectorAll('select');
    for (const select of selects) {
      if (this.elementMatchesText(select, target)) {
        const options = select.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].text.toLowerCase().includes(value.toLowerCase())) {
            select.selectedIndex = i;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            break;
          }
        }
        break;
      }
    }
  }

  findElementsByText(text) {
    const xpath = `//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${text.toLowerCase()}')]`;
    return document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  }

  elementMatchesText(element, text) {
    const elementText = element.textContent?.toLowerCase() || '';
    const placeholder = element.placeholder?.toLowerCase() || '';
    const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
    const name = element.name?.toLowerCase() || '';
    
    return elementText.includes(text.toLowerCase()) ||
           placeholder.includes(text.toLowerCase()) ||
           ariaLabel.includes(text.toLowerCase()) ||
           name.includes(text.toLowerCase());
  }

  startListening() {
    if (this.isListening || !this.recognition) return;
    
    this.recognition.start();
    this.isListening = true;
  }

  stopListening() {
    if (!this.isListening || !this.recognition) return;
    
    this.recognition.stop();
    this.isListening = false;
  }

  isSupported() {
    return typeof window !== 'undefined' && 
           (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window));
  }

  getStatus() {
    if (!this.isSupported()) return 'unsupported';
    return this.isListening ? 'listening' : 'stopped';
  }
}
