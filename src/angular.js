/**
 * Angular.js integration for Audio Navigate
 * Provides services and directives for Angular applications
 */

import { AudioNavigate } from './index.js';

export class AudioNavigateService {
  constructor(options = {}) {
    this.audioNavigate = new AudioNavigate({
      ...options,
      onCommand: (command) => {
        this.lastCommand = command;
        options.onCommand?.(command);
      },
      onResult: (result) => {
        this.transcript = result;
        options.onResult?.(result);
      },
      onError: (err) => {
        this.error = err;
        options.onError?.(err);
      }
    });
    this.lastCommand = null;
    this.transcript = '';
    this.error = null;
  }

  startListening() {
    this.audioNavigate.startListening();
    this.error = null;
  }

  stopListening() {
    this.audioNavigate.stopListening();
  }

  isListening() {
    return this.audioNavigate.getStatus() === 'listening';
  }

  isSupported() {
    return this.audioNavigate.isSupported();
  }

  getStatus() {
    return this.audioNavigate.getStatus();
  }

  getLastCommand() {
    return this.lastCommand;
  }

  getTranscript() {
    return this.transcript;
  }

  getError() {
    return this.error;
  }
}

// Angular.js module setup (if Angular is available)
if (typeof window !== 'undefined' && window.angular) {
  const angular = window.angular;
  
  angular.module('audioNavigate', [])
    .service('audioNavigateService', ['$window', function($window) {
      return new AudioNavigateService();
    }])
    .directive('audioNavigateButton', ['audioNavigateService', function(audioNavigateService) {
      return {
        restrict: 'E',
        scope: {
          onStart: '&',
          onStop: '&',
          className: '@',
          options: '='
        },
        template: `
          <button ng-click="toggleListening()" 
                  ng-class="className" 
                  ng-disabled="!isSupported"
                  aria-label="Audio navigation {{ isListening ? 'on' : 'off' }}">
            {{ children }} {{ isListening ? '🔴' : '⚪' }}
          </button>
        `,
        link: function(scope) {
          scope.isListening = false;
          scope.isSupported = audioNavigateService.isSupported();

          scope.toggleListening = function() {
            if (scope.isListening) {
              audioNavigateService.stopListening();
              scope.isListening = false;
              scope.onStop();
            } else {
              audioNavigateService.startListening();
              scope.isListening = true;
              scope.onStart();
            }
          };
        }
      };
    }])
    .directive('audioNavigateStatus', ['audioNavigateService', function(audioNavigateService) {
      return {
        restrict: 'E',
        scope: {
          className: '@',
          showTranscript: '@',
          showLastCommand: '@'
        },
        template: `
          <div ng-class="className">
            <div>Status: {{ status }}</div>
            <div ng-if="error">Error: {{ error.message }}</div>
            <div ng-if="showTranscript && transcript">Last transcript: "{{ transcript }}"</div>
            <div ng-if="showLastCommand && lastCommand">
              Last command: {{ lastCommand.type }} - {{ lastCommand.action }}
            </div>
          </div>
        `,
        link: function(scope) {
          scope.status = audioNavigateService.getStatus();
          scope.transcript = audioNavigateService.getTranscript();
          scope.error = audioNavigateService.getError();
          scope.lastCommand = audioNavigateService.getLastCommand();

          scope.$watch(function() {
            return audioNavigateService.getStatus();
          }, function(newStatus) {
            scope.status = newStatus;
          });

          scope.$watch(function() {
            return audioNavigateService.getTranscript();
          }, function(newTranscript) {
            scope.transcript = newTranscript;
          });

          scope.$watch(function() {
            return audioNavigateService.getError();
          }, function(newError) {
            scope.error = newError;
          });

          scope.$watch(function() {
            return audioNavigateService.getLastCommand();
          }, function(newCommand) {
            scope.lastCommand = newCommand;
          });
        }
      };
    }]);
}
