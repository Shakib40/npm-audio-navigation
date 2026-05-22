import React, { useState } from 'react';
import { useAudioNavigate, AudioNavigateButton, AudioNavigateStatus } from '../src/react.js';

function AudioNavigateDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dropdown: '',
    message: ''
  });

  const { lastCommand, transcript, error } = useAudioNavigate({
    onCommand: (command) => {
      console.log('Voice command executed:', command);
    },
    onError: (err) => {
      console.error('Voice recognition error:', err);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted with data: ${JSON.stringify(formData, null, 2)}`);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      dropdown: '',
      message: ''
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Audio Navigate - React Example</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Voice Control</h2>
        <AudioNavigateButton 
          onStart={() => console.log('Started listening')}
          onStop={() => console.log('Stopped listening')}
          style={{ marginRight: '10px' }}
        >
          Start Voice Control
        </AudioNavigateButton>
        
        <AudioNavigateStatus showTranscript showLastCommand />
        
        {error && (
          <div style={{ color: '#dc3545', marginTop: '10px' }}>
            Error: {error.message}
          </div>
        )}
      </div>

      <div style={{ background: '#e9ecef', padding: '20px', margin: '20px 0', borderRadius: '8px' }}>
        <h2>Try These Voice Commands:</h2>
        <ul>
          <li><strong>"go down"</strong> or <strong>"scroll down"</strong> - Scroll down the page</li>
          <li><strong>"go up"</strong> or <strong>"scroll up"</strong> - Scroll up the page</li>
          <li><strong>"click submit button"</strong> - Click the submit button</li>
          <li><strong>"fill John Doe in name field"</strong> - Fill the name field</li>
          <li><strong>"select Option 2 from dropdown"</strong> - Select from dropdown</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Interactive Form</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Name Field:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Say 'fill John Doe in name field'"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email Field:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Say 'fill john@example.com in email field'"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="dropdown" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Dropdown:
          </label>
          <select
            id="dropdown"
            name="dropdown"
            value={formData.dropdown}
            onChange={(e) => setFormData({...formData, dropdown: e.target.value})}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="Say 'fill Hello World in message field'"
            rows={4}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <button 
            id="submitBtn"
            type="submit"
            style={{ 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Submit Button
          </button>
          
          <button 
            id="resetBtn"
            type="button"
            onClick={handleReset}
            style={{ 
              background: '#6c757d', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Reset Button
          </button>
          
          <button 
            id="cancelBtn"
            type="button"
            style={{ 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '4px', 
              cursor: 'pointer'
            }}
          >
            Cancel Button
          </button>
        </div>
      </form>

      <div style={{ 
        background: '#f8f9fa', 
        border: '1px solid #dee2e6', 
        borderRadius: '4px', 
        padding: '15px', 
        margin: '20px 0',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        <h3>Command Log:</h3>
        <div>
          {lastCommand && (
            <div style={{ marginBottom: '5px' }}>
              <strong>Last Command:</strong> {lastCommand.type} - {lastCommand.action}
              {lastCommand.target && ` (target: ${lastCommand.target})`}
              {lastCommand.value && ` (value: ${lastCommand.value})`}
            </div>
          )}
          {transcript && (
            <div style={{ marginBottom: '5px' }}>
              <strong>Last Transcript:</strong> "{transcript}"
            </div>
          )}
          {!lastCommand && !transcript && (
            <div style={{ color: '#666' }}>No commands yet. Start voice control to begin!</div>
          )}
        </div>
      </div>

      {/* Generate lots of content for scrolling demo */}
      <div style={{ 
        height: '200vh', 
        background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)', 
        padding: '40px', 
        margin: '20px 0',
        borderRadius: '8px'
      }}>
        <h2>Scrolling Demo Area</h2>
        <p>Try saying "go down" or "scroll down" to navigate through this content.</p>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ margin: '50px 0' }}>
            <h3>Section {i}</h3>
            <p>This is section {i} of the scrolling demo. Use voice commands to navigate up and down the page smoothly.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AudioNavigateDemo;
