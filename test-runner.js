#!/usr/bin/env node

/**
 * Simple test runner for Audio Navigate library
 * Run with: node test-runner.js
 */

import { AudioNavigate } from './src/index.js';

// Simple test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🧪 Running Audio Navigate Tests...\n');

        // Mock window and document for Node.js testing
        global.window = {
            SpeechRecognition: class MockSpeechRecognition {
                constructor() {
                    this.lang = 'en-US';
                    this.continuous = true;
                    this.interimResults = false;
                    this.onresult = null;
                    this.onerror = null;
                    this.onend = null;
                }
                start() {}
                stop() {}
            },
            webkitSpeechRecognition: class MockSpeechRecognition {
                constructor() {
                    this.lang = 'en-US';
                    this.continuous = true;
                    this.interimResults = false;
                    this.onresult = null;
                    this.onerror = null;
                    this.onend = null;
                }
                start() {}
                stop() {}
            },
            innerHeight: 800,
            scrollBy: () => {}
        };

        global.document = {
            querySelectorAll: () => [],
            evaluate: () => ({ snapshotLength: 0, snapshotItem: () => null })
        };

        global.XPathResult = {
            ORDERED_NODE_SNAPSHOT_TYPE: 7
        };

        global.Event = class Event {};

        // Run all tests
        for (const test of this.tests) {
            try {
                const result = await test.testFn();
                if (result) {
                    console.log(`✅ ${test.name}`);
                    this.passed++;
                } else {
                    console.log(`❌ ${test.name}`);
                    this.failed++;
                }
            } catch (error) {
                console.log(`❌ ${test.name} - Error: ${error.message}`);
                this.failed++;
            }
        }

        // Summary
        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        
        if (this.failed === 0) {
            console.log('🎉 All tests passed!');
            process.exit(0);
        } else {
            console.log('💥 Some tests failed!');
            process.exit(1);
        }
    }
}

// Create test runner
const runner = new TestRunner();

// Test: Library initialization
runner.test('Library initialization', () => {
    const audioNavigate = new AudioNavigate();
    return audioNavigate instanceof AudioNavigate;
});

// Test: Default options
runner.test('Default options', () => {
    const audioNavigate = new AudioNavigate();
    return audioNavigate.options.language === 'en-US' &&
           audioNavigate.options.continuous === true &&
           audioNavigate.options.interimResults === false;
});

// Test: Custom options
runner.test('Custom options', () => {
    const audioNavigate = new AudioNavigate({
        language: 'es-ES',
        continuous: false,
        interimResults: true
    });
    return audioNavigate.options.language === 'es-ES' &&
           audioNavigate.options.continuous === false &&
           audioNavigate.options.interimResults === true;
});

// Test: Browser support detection
runner.test('Browser support detection', () => {
    const audioNavigate = new AudioNavigate();
    return typeof audioNavigate.isSupported() === 'boolean';
});

// Test: Status checking
runner.test('Status checking', () => {
    const audioNavigate = new AudioNavigate();
    const status = audioNavigate.getStatus();
    return ['listening', 'stopped', 'unsupported'].includes(status);
});

// Test: Command parsing - scroll down
runner.test('Command parsing - scroll down', () => {
    const audioNavigate = new AudioNavigate();
    const command = audioNavigate.parseCommand('go down');
    return command && 
           command.type === 'scroll' && 
           command.action === 'down' && 
           command.target === 'window';
});

// Test: Command parsing - scroll up
runner.test('Command parsing - scroll up', () => {
    const audioNavigate = new AudioNavigate();
    const command = audioNavigate.parseCommand('scroll up');
    return command && 
           command.type === 'scroll' && 
           command.action === 'up' && 
           command.target === 'window';
});

// Test: Command parsing - click
runner.test('Command parsing - click', () => {
    const audioNavigate = new AudioNavigate();
    const command = audioNavigate.parseCommand('click submit');
    return command && 
           command.type === 'click' && 
           command.action === 'click' && 
           command.target === 'submit';
});

// Test: Command parsing - fill
runner.test('Command parsing - fill', () => {
    const audioNavigate = new AudioNavigate();
    const command = audioNavigate.parseCommand('fill John Doe in name field');
    return command && 
           command.type === 'fill' && 
           command.action === 'fill' && 
           command.target === 'name field' &&
           command.value === 'John Doe';
});

// Test: Command parsing - select
runner.test('Command parsing - select', () => {
    const audioNavigate = new AudioNavigate();
    const command = audioNavigate.parseCommand('choose Option 2 from dropdown');
    return command && 
           command.type === 'select' && 
           command.action === 'select' && 
           command.target === 'dropdown' &&
           command.value === 'Option 2';
});

// Test: Command parsing - invalid command
runner.test('Command parsing - invalid command', () => {
    const audioNavigate = new AudioNavigate();
    const command = audioNavigate.parseCommand('random text that is not a command');
    return command === null;
});

// Test: Element matching - text content
runner.test('Element matching - text content', () => {
    const audioNavigate = new AudioNavigate();
    const element = {
        textContent: 'Submit Button',
        placeholder: '',
        getAttribute: () => '',
        name: ''
    };
    return audioNavigate.elementMatchesText(element, 'submit') === true &&
           audioNavigate.elementMatchesText(element, 'cancel') === false;
});

// Test: Element matching - placeholder
runner.test('Element matching - placeholder', () => {
    const audioNavigate = new AudioNavigate();
    const element = {
        textContent: '',
        placeholder: 'Enter your name',
        getAttribute: () => '',
        name: ''
    };
    return audioNavigate.elementMatchesText(element, 'name') === true &&
           audioNavigate.elementMatchesText(element, 'email') === false;
});

// Test: Element matching - aria-label
runner.test('Element matching - aria-label', () => {
    const audioNavigate = new AudioNavigate();
    const element = {
        textContent: '',
        placeholder: '',
        getAttribute: (attr) => attr === 'aria-label' ? 'Search field' : '',
        name: ''
    };
    return audioNavigate.elementMatchesText(element, 'search') === true &&
           audioNavigate.elementMatchesText(element, 'filter') === false;
});

// Test: Element matching - name attribute
runner.test('Element matching - name attribute', () => {
    const audioNavigate = new AudioNavigate();
    const element = {
        textContent: '',
        placeholder: '',
        getAttribute: () => '',
        name: 'username'
    };
    return audioNavigate.elementMatchesText(element, 'username') === true &&
           audioNavigate.elementMatchesText(element, 'password') === false;
});

// Test: Multiple scroll commands
runner.test('Multiple scroll commands', () => {
    const audioNavigate = new AudioNavigate();
    const commands = ['go down', 'scroll down', 'move down', 'down', 'go up', 'scroll up', 'move up', 'up'];
    
    return commands.every(cmd => {
        const parsed = audioNavigate.parseCommand(cmd);
        return parsed && 
               parsed.type === 'scroll' && 
               (parsed.action === 'up' || parsed.action === 'down');
    });
});

// Test: Multiple click commands
runner.test('Multiple click commands', () => {
    const audioNavigate = new AudioNavigate();
    const commands = ['click submit', 'press login', 'activate button'];
    
    return commands.every(cmd => {
        const parsed = audioNavigate.parseCommand(cmd);
        return parsed && 
               parsed.type === 'click' && 
               parsed.action === 'click';
    });
});

// Run all tests
runner.run().catch(console.error);
