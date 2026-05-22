# Testing Guide for Audio Navigate

This guide shows you how to test the Audio Navigate library to ensure it works correctly in your applications.

## 🧪 Testing Methods

### 1. Automated Tests (Node.js)

Run the built-in test suite to verify core functionality:

```bash
node test-runner.js
```

**Expected Output:**
```
🧪 Running Audio Navigate Tests...
✅ Library initialization
✅ Default options
✅ Custom options
✅ Browser support detection
✅ Status checking
✅ Command parsing - scroll down
✅ Scroll up
✅ Command parsing - click
✅ Command parsing - fill
✅ Command parsing - select
✅ Command parsing - invalid command
✅ Element matching - text content
✅ Element matching - placeholder
✅ Element matching - aria-label
✅ Element matching - name attribute
✅ Multiple scroll commands
✅ Multiple click commands

📊 Test Results: 17 passed, 0 failed
🎉 All tests passed!
```

### 2. Interactive Browser Testing

Open the test demo page in your browser:

```bash
# Open the HTML file in your preferred browser
open test-demo.html
# or
firefox test-demo.html
# or
chrome test-demo.html
```

**Browser Requirements:**
- ✅ Chrome (full support)
- ✅ Edge (full support)  
- ⚠️ Safari (limited support)
- ❌ Firefox (no support)

### 3. Manual Testing Steps

#### Step 1: Browser Compatibility Check
1. Open `test-demo.html` in Chrome or Edge
2. Verify you see "✅ Speech recognition is supported!"
3. If you see an error, try a different browser

#### Step 2: Microphone Permission
1. Click "🎤 Start Voice Control"
2. Allow microphone access when prompted
3. Verify status changes to "Listening"

#### Step 3: Voice Command Testing

**Navigation Commands:**
- Say "**go down**" → Page should scroll down
- Say "**scroll up**" → Page should scroll up
- Say "**move down**" → Page should scroll down

**Click Commands:**
- Say "**click submit**" → Submit button should be clicked
- Say "**press login**" → Login button should be clicked
- Say "**activate cancel**" → Cancel button should be clicked

**Form Fill Commands:**
- Say "**fill John in name field**" → Name field should be filled
- Say "**type test@example.com in email field**" → Email field should be filled

**Dropdown Commands:**
- Say "**choose Admin from role**" → Role dropdown should select "Admin"
- Say "**pick User from role**" → Role dropdown should select "User"

#### Step 4: Automated Browser Tests
1. Click "🧪 Run Auto Tests" button
2. Verify all tests show "PASSED" status
3. Check test summary shows "0 failed"

## 🐛 Common Issues & Solutions

### Issue: "Speech recognition not supported"
**Cause:** Using unsupported browser
**Solution:** Use Chrome or Edge browser

### Issue: Microphone permission denied
**Cause:** Browser blocked microphone access
**Solution:** 
1. Click the microphone icon in browser address bar
2. Select "Allow" for microphone access
3. Refresh the page and try again

### Issue: Commands not recognized
**Cause:** Background noise or unclear speech
**Solution:**
1. Speak clearly and at moderate pace
2. Minimize background noise
3. Use exact command phrases from the list

### Issue: Wrong command executed
**Cause:** Command parsing priority conflicts
**Solution:** The library now prioritizes specific commands over generic ones:
1. Select commands (most specific)
2. Fill commands
3. Click commands  
4. Scroll commands (most generic)

## 📋 Test Checklist

### ✅ Pre-Testing Checklist
- [ ] Using Chrome or Edge browser
- [ ] Microphone is connected and working
- [ ] No background noise
- [ ] Internet connection is stable

### ✅ Functional Testing Checklist
- [ ] Library initializes without errors
- [ ] Browser support detection works
- [ ] Microphone permission can be granted
- [ ] Voice recognition starts/stops correctly
- [ ] Scroll commands work (up/down)
- [ ] Click commands work (buttons/links)
- [ ] Fill commands work (text inputs)
- [ ] Select commands work (dropdowns)
- [ ] Invalid commands are ignored
- [ ] Error handling works correctly

### ✅ Integration Testing Checklist
- [ ] Works with React components
- [ ] Works with Angular directives
- [ ] Works with vanilla JavaScript
- [ ] Multiple instances don't conflict
- [ ] Cleanup works when stopping

## 🔧 Advanced Testing

### Custom Command Testing
Add your own test cases to `test-runner.js`:

```javascript
// Test custom command
runner.test('Custom command - your feature', () => {
    const audioNavigate = new AudioNavigate();
    const command = audioNavigate.parseCommand('your custom command');
    // Add your assertions here
    return command !== null;
});
```

### Performance Testing
Test with large forms and many elements:

```javascript
// Create test form with many elements
function createLargeForm() {
    const form = document.createElement('form');
    for (let i = 0; i < 100; i++) {
        const input = document.createElement('input');
        input.name = `field${i}`;
        input.placeholder = `Field ${i}`;
        form.appendChild(input);
    }
    document.body.appendChild(form);
}
```

### Error Handling Testing
Test error scenarios:

```javascript
// Test with invalid speech recognition
global.window.SpeechRecognition = null;
const audioNavigate = new AudioNavigate();
console.log('Should handle missing SpeechRecognition:', !audioNavigate.isSupported());
```

## 📊 Test Results Interpretation

### Success Indicators
- ✅ All automated tests pass
- ✅ Voice commands execute correctly
- ✅ No JavaScript errors in console
- ✅ Status updates work properly
- ✅ Form interactions work as expected

### Failure Indicators
- ❌ Tests fail in `test-runner.js`
- ❌ Voice commands not recognized
- ❌ Microphone permission errors
- ❌ Console JavaScript errors
- ❌ Elements not found or not interactable

## 🚀 Continuous Testing

For development, run tests frequently:

```bash
# Run automated tests
node test-runner.js

# Open browser test
open test-demo.html

# Test voice commands manually
# 1. Start voice control
# 2. Test each command type
# 3. Verify results
```

## 📞 Getting Help

If tests fail:
1. Check browser compatibility
2. Verify microphone permissions
3. Review console for JavaScript errors
4. Check this testing guide for solutions
5. Create an issue with detailed error information

Remember: Voice recognition works best in quiet environments with clear speech!
