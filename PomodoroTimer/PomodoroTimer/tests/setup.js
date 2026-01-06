// Jest setup file for DOM testing
import '@testing-library/jest-dom';
import 'jest-localstorage-mock';

// Mock DOM APIs that might not be available in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Audio API
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  preload: 'auto',
  src: '',
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup DOM structure that the app expects
beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Add basic HTML structure that the app expects
  document.body.innerHTML = `
    <div class="nav" id="nav">
      <div class="nav-left"><span class="nav-button"><a class="on" href="javascript:;">Tasks</a></span></div>
      <div class="nav-right">
        <ul>
          <li><span class="nav-button"><a href="javascript:;">Settings</a></span></li>
          <li><span class="nav-button"><a href="javascript:;" id="night-mode-toggle">🌙</a></span></li>
        </ul>
      </div>
    </div>
    <div class="panle" id="panle">
      <div id="main">
        <h1>Pomodoro Timer</h1>
        <p>Add pomodoro sessions to start your study and work today!</p>
        <div class="button" id="newMission-btn"><span>🍅 New Pomodoro</span></div>
        <div id="addMission" class="noClick">
          <div class="addMission-nav">
            <div class="addMission-nav-title">Add New Pomodoro</div>
            <div class="addMission-nav-close" id="addMission-nav-close">x</div>
          </div>
          <div class="addMission-main">
            <div class="addMission-main-1">
              <label for="missionName">Task Name:</label>
              <input type="text" id="missionName" placeholder="My Pomodoro Task">
            </div>
            <div class="addMission-main-1">
              <label for="missionName">Estimated Pomodoros: <strong id="missionCount">1</strong></label>
              <span class="addMission-main-button">
                <span class="addMission-main-button-sub" id="addMission-main-button-sub">-</span>
                <span class="addMission-main-button-add" id="addMission-main-button-add">+</span>
              </span>
            </div>
            <div class="addMission-main-1">
              <ul>
                <li>Total Time:</li>
                <li>Work Time:</li>
                <li>Break Time:</li>
              </ul>
              <ul>
                <li id="li-totalTime"></li>
                <li id="li-missionTime"></li>
                <li id="li-restTime"></li>
              </ul>
            </div>
          </div>
          <div class="addMission-foot">
            <span class="addMission-foot-button">
              <span class="addMission-foot-button-cancel" id="addMission-foot-button-cancel">Cancel</span>
              <span class="addMission-foot-button-confirm" id="addMission-foot-button-confirm">Confirm</span>
            </span>
          </div>
        </div>
      </div>
      <div id="set" class="hidden">
        <!-- Settings content -->
      </div>
    </div>
  `;
});

// Global test utilities
global.testUtils = {
  // Helper to create a mock task
  createMockTask: (overrides = {}) => ({
    id: `task_${Date.now()}`,
    name: 'Test Task',
    workTime: 25,
    restTime: 5,
    totalCount: 1,
    finishedCount: 0,
    createdAt: new Date().toISOString(),
    isActive: false,
    currentState: 'idle',
    ...overrides
  }),
  
  // Helper to simulate user interaction
  simulateClick: (element) => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  },
  
  // Helper to simulate input change
  simulateInput: (element, value) => {
    element.value = value;
    const event = new Event('change', {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  }
};
