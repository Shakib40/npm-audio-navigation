# Audio Navigate

A Node.js library that enables audio-based commands for React.js and Angular.js applications. Control your web application using voice commands for navigation and interaction.

## Features

- 🎤 Voice recognition using Web Speech API
- 🖱️ DOM manipulation (click, fill inputs, select dropdowns, scroll)
- ⚛️ React.js integration with custom hooks
- 🅰️ Angular.js integration with services and directives
- 📝 TypeScript support
- 🌐 Browser compatibility detection

## Installation

```bash
npm install audio-navigate
```

## Quick Start

### Basic Usage

```javascript
import { AudioNavigate } from 'audio-navigate';

const audioNavigate = new AudioNavigate({
  onCommand: (command) => {
    console.log('Command detected:', command);
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});

// Start listening for voice commands
audioNavigate.startListening();
```

### React.js Integration

```jsx
import { useAudioNavigate, AudioNavigateButton, AudioNavigateStatus } from 'audio-navigate/react';

function MyComponent() {
  const { isListening, startListening, stopListening, lastCommand } = useAudioNavigate({
    onCommand: (command) => {
      console.log('Voice command:', command);
    }
  });

  return (
    <div>
      <AudioNavigateButton onStart={startListening} onStop={stopListening}>
        Voice Control
      </AudioNavigateButton>
      <AudioNavigateStatus />
      {lastCommand && (
        <p>Last command: {lastCommand.type} - {lastCommand.action}</p>
      )}
    </div>
  );
}
```

### Angular.js Integration

```javascript
// Include the module in your app
angular.module('myApp', ['audioNavigate']);

// In your controller
angular.module('myApp').controller('MyController', ['audioNavigateService', function(audioNavigateService) {
  this.startListening = function() {
    audioNavigateService.startListening();
  };
  
  this.isSupported = audioNavigateService.isSupported();
}]);
```

```html
<!-- In your template -->
<audio-navigate-button on-start="startListening()" on-stop="stopListening()">
  Voice Control
</audio-navigate-button>

<audio-navigate-status show-transcript="true" show-last-command="true"></audio-navigate-status>
```

## Supported Voice Commands

### Navigation
- "go down" / "scroll down" / "move down" / "down" - Scroll down
- "go up" / "scroll up" / "move up" / "up" - Scroll up

### Interaction
- "click [element]" - Click on a button, link, or clickable element
- "press [element]" - Alternative to click
- "select [element]" - Alternative to click

### Form Input
- "fill [value] in [field]" - Fill an input field with text
- "type [value] in [field]" - Alternative to fill
- "enter [value] in [field]" - Alternative to fill

### Dropdown Selection
- "select [option] from [dropdown]" - Select an option from a dropdown
- "choose [option] from [dropdown]" - Alternative to select
- "pick [option] from [dropdown]" - Alternative to select

## Examples

### Voice Command Examples

```
"go down" - Scrolls the page down
"click submit button" - Clicks the submit button
"fill John Doe in name field" - Fills the name field with "John Doe"
"select Option 2 from dropdown" - Selects "Option 2" from a dropdown
```

### Advanced Configuration

```javascript
const audioNavigate = new AudioNavigate({
  language: 'en-US',
  continuous: true,
  interimResults: false,
  onCommand: (command) => {
    // Handle custom command logic
    switch(command.type) {
      case 'scroll':
        console.log(`Scrolling ${command.action}`);
        break;
      case 'click':
        console.log(`Clicking ${command.target}`);
        break;
      case 'fill':
        console.log(`Filling ${command.target} with ${command.value}`);
        break;
      case 'select':
        console.log(`Selecting ${command.value} from ${command.target}`);
        break;
    }
  },
  onResult: (transcript) => {
    console.log('Voice transcript:', transcript);
  },
  onError: (error) => {
    console.error('Speech recognition error:', error);
  }
});
```

## API Reference

### AudioNavigate Class

#### Constructor Options

```typescript
interface AudioNavigateOptions {
  language?: string;           // Default: 'en-US'
  continuous?: boolean;        // Default: true
  interimResults?: boolean;    // Default: false
  onCommand?: (command: AudioCommand) => void;
  onError?: (error: Error) => void;
  onResult?: (transcript: string) => void;
}
```

#### Methods

- `startListening()` - Start voice recognition
- `stopListening()` - Stop voice recognition
- `isSupported()` - Check if speech recognition is supported
- `getStatus()` - Get current status ('listening' | 'stopped' | 'unsupported')

### AudioCommand Interface

```typescript
interface AudioCommand {
  type: 'scroll' | 'click' | 'fill' | 'select' | 'navigate';
  action: string;
  target?: string;
  value?: string;
}
```

### React Hooks

#### useAudioNavigate

```typescript
const {
  isListening,
  isSupported,
  status,
  lastCommand,
  transcript,
  startListening,
  stopListening,
  error
} = useAudioNavigate(options);
```

#### Components

- `AudioNavigateButton` - Button to start/stop listening
- `AudioNavigateStatus` - Display current status and information

## Browser Compatibility

This library uses the Web Speech API, which is supported in:

- Chrome/Edge (full support)
- Safari (limited support)
- Firefox (no support)

For unsupported browsers, the library will gracefully degrade and provide appropriate error messages.

## Contributing

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run tests: `npm test`

## License

MIT License - see LICENSE file for details.

## Issues

Please report issues on the GitHub repository.
# npm-audio-navigation
