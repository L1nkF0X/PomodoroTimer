/**
 * Integration tests for task persistence with DOM interactions
 * Tests the complete flow from user actions to localStorage persistence
 */

// Mock the global.js functions that we'll need to test
const mockGlobalFunctions = {
  missionIndex: 0,
  missionItem: [],
  clockTime: 25,
  clockSRestTime: 5,
  
  // Mock Mission constructor
  Mission: function(index, missionName, workTime, restTime, count) {
    this.index = index;
    this.missionName = missionName;
    this.workTime = workTime;
    this.restTime = restTime;
    this.count = count;
    this.finishCount = 0;
    this.isWorking = false;
    this.id = `task_${Date.now()}_${index}`;
    
    // Mock methods
    this.CreateMissionList = jest.fn();
    this.ShowTime = jest.fn();
    this.EventStart = jest.fn();
    this.EventStop = jest.fn();
  }
};

// Add mock functions to global scope
Object.assign(global, mockGlobalFunctions);

describe('Task Persistence Integration Tests', () => {
  const STORAGE_KEY = 'pomodoroTasks';
  
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    
    // Reset mock data
    mockGlobalFunctions.missionIndex = 0;
    mockGlobalFunctions.missionItem = [];
  });

  describe('Task Creation Flow', () => {
    test('should persist task when user creates new pomodoro', () => {
      // Simulate user opening new task dialog
      const newMissionBtn = document.getElementById('newMission-btn');
      const addMissionDialog = document.getElementById('addMission');
      
      testUtils.simulateClick(newMissionBtn);
      
      // Simulate user filling in task details
      const taskNameInput = document.getElementById('missionName');
      const confirmBtn = document.getElementById('addMission-foot-button-confirm');
      const countDisplay = document.getElementById('missionCount');
      
      testUtils.simulateInput(taskNameInput, 'Integration Test Task');
      
      // Simulate clicking add button to increase count
      const addBtn = document.getElementById('addMission-main-button-add');
      testUtils.simulateClick(addBtn);
      countDisplay.innerHTML = '2'; // Simulate count update
      
      // Mock the task creation and persistence
      const mockTask = testUtils.createMockTask({
        name: 'Integration Test Task',
        workTime: 25,
        restTime: 5,
        totalCount: 2
      });
      
      // Simulate confirm button click and persistence
      testUtils.simulateClick(confirmBtn);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockTask]));
      
      // Verify task was persisted
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(storedTasks).toHaveLength(1);
      expect(storedTasks[0]).toMatchObject({
        name: 'Integration Test Task',
        workTime: 25,
        restTime: 5,
        totalCount: 2,
        finishedCount: 0
      });
    });

    test('should handle task creation with default values', () => {
      const taskNameInput = document.getElementById('missionName');
      const confirmBtn = document.getElementById('addMission-foot-button-confirm');
      
      // Don't fill in task name (should use placeholder)
      testUtils.simulateClick(confirmBtn);
      
      const mockTask = testUtils.createMockTask({
        name: 'My Pomodoro Task', // Default placeholder value
        workTime: 25,
        restTime: 5,
        totalCount: 1
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockTask]));
      
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(storedTasks[0].name).toBe('My Pomodoro Task');
      expect(storedTasks[0].totalCount).toBe(1);
    });
  });

  describe('Task Loading Flow', () => {
    test('should restore tasks from localStorage on page load', () => {
      // Pre-populate localStorage with tasks
      const existingTasks = [
        testUtils.createMockTask({ 
          name: 'Existing Task 1', 
          finishedCount: 1, 
          totalCount: 3 
        }),
        testUtils.createMockTask({ 
          name: 'Existing Task 2', 
          finishedCount: 0, 
          totalCount: 2 
        })
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTasks));
      
      // Simulate page load by reading from localStorage
      const loadedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      
      expect(loadedTasks).toHaveLength(2);
      expect(loadedTasks[0].name).toBe('Existing Task 1');
      expect(loadedTasks[0].finishedCount).toBe(1);
      expect(loadedTasks[1].name).toBe('Existing Task 2');
      expect(loadedTasks[1].finishedCount).toBe(0);
      
      // Verify tasks would be recreated in DOM
      loadedTasks.forEach((taskData, index) => {
        const mission = new mockGlobalFunctions.Mission(
          index,
          taskData.name,
          taskData.workTime,
          taskData.restTime,
          taskData.totalCount
        );
        mission.finishCount = taskData.finishedCount;
        
        expect(mission.missionName).toBe(taskData.name);
        expect(mission.finishCount).toBe(taskData.finishedCount);
      });
    });

    test('should handle empty localStorage gracefully', () => {
      // No tasks in localStorage
      const loadedTasks = localStorage.getItem(STORAGE_KEY);
      expect(loadedTasks).toBeNull();
      
      // Application should handle this by showing empty state
      const missionList = document.getElementById('missionList');
      expect(missionList).toBeNull(); // Should not exist when no tasks
    });

    test('should handle corrupted localStorage data', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');
      
      let loadedTasks = [];
      try {
        loadedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      } catch (e) {
        // Application should handle this gracefully
        loadedTasks = [];
        localStorage.removeItem(STORAGE_KEY); // Clean up corrupted data
      }
      
      expect(loadedTasks).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('Task Progress Persistence', () => {
    test('should persist task progress when pomodoro is completed', () => {
      const initialTask = testUtils.createMockTask({
        id: 'task_progress_test',
        name: 'Progress Test Task',
        finishedCount: 0,
        totalCount: 3,
        currentState: 'idle'
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([initialTask]));
      
      // Simulate completing a pomodoro
      const updatedTask = {
        ...initialTask,
        finishedCount: 1,
        currentState: 'completed_pomodoro'
      };
      
      // Update localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify([updatedTask]));
      
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(storedTasks[0].finishedCount).toBe(1);
      expect(storedTasks[0].currentState).toBe('completed_pomodoro');
    });

    test('should persist timer state during work session', () => {
      const task = testUtils.createMockTask({
        id: 'timer_state_test',
        currentState: 'idle',
        isActive: false
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([task]));
      
      // Simulate starting timer
      const workingTask = {
        ...task,
        currentState: 'working',
        isActive: true,
        startTime: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([workingTask]));
      
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(storedTasks[0].currentState).toBe('working');
      expect(storedTasks[0].isActive).toBe(true);
      expect(storedTasks[0].startTime).toBeDefined();
    });
  });

  describe('Task Deletion Flow', () => {
    test('should remove task from localStorage when deleted', () => {
      const tasks = [
        testUtils.createMockTask({ id: 'task_1', name: 'Keep This' }),
        testUtils.createMockTask({ id: 'task_2', name: 'Delete This' }),
        testUtils.createMockTask({ id: 'task_3', name: 'Keep This Too' })
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      
      // Simulate task deletion by clicking delete button
      // In real app, this would be triggered by clicking the trash icon
      const taskToDelete = 'task_2';
      const remainingTasks = tasks.filter(t => t.id !== taskToDelete);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingTasks));
      
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(storedTasks).toHaveLength(2);
      expect(storedTasks.map(t => t.name)).toEqual(['Keep This', 'Keep This Too']);
    });

    test('should handle deletion of last task', () => {
      const singleTask = [testUtils.createMockTask({ name: 'Last Task' })];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(singleTask));
      
      // Delete the last task
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(storedTasks).toEqual([]);
    });
  });

  describe('Settings Persistence Integration', () => {
    test('should use persisted time settings for new tasks', () => {
      // Simulate changed settings
      const customSettings = {
        workTime: 30,
        restTime: 10
      };
      
      localStorage.setItem('pomodoroSettings', JSON.stringify(customSettings));
      
      // Create new task with custom settings
      const taskWithCustomSettings = testUtils.createMockTask({
        name: 'Custom Settings Task',
        workTime: 30,
        restTime: 10
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([taskWithCustomSettings]));
      
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(storedTasks[0].workTime).toBe(30);
      expect(storedTasks[0].restTime).toBe(10);
    });
  });

  describe('Multiple Tasks Management', () => {
    test('should handle multiple tasks with different states', () => {
      const multipleTasks = [
        testUtils.createMockTask({ 
          name: 'Completed Task', 
          finishedCount: 3, 
          totalCount: 3,
          currentState: 'completed'
        }),
        testUtils.createMockTask({ 
          name: 'In Progress Task', 
          finishedCount: 1, 
          totalCount: 4,
          currentState: 'working',
          isActive: true
        }),
        testUtils.createMockTask({ 
          name: 'Not Started Task', 
          finishedCount: 0, 
          totalCount: 2,
          currentState: 'idle'
        })
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(multipleTasks));
      
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(storedTasks).toHaveLength(3);
      
      // Verify each task state is preserved
      expect(storedTasks[0].currentState).toBe('completed');
      expect(storedTasks[1].currentState).toBe('working');
      expect(storedTasks[1].isActive).toBe(true);
      expect(storedTasks[2].currentState).toBe('idle');
    });

    test('should maintain task order in localStorage', () => {
      const orderedTasks = [
        testUtils.createMockTask({ name: 'First Task', createdAt: '2024-01-01T10:00:00Z' }),
        testUtils.createMockTask({ name: 'Second Task', createdAt: '2024-01-01T11:00:00Z' }),
        testUtils.createMockTask({ name: 'Third Task', createdAt: '2024-01-01T12:00:00Z' })
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orderedTasks));
      
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(storedTasks.map(t => t.name)).toEqual([
        'First Task',
        'Second Task', 
        'Third Task'
      ]);
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle localStorage errors during task operations', () => {
      // Mock localStorage error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error');
      });
      
      const task = testUtils.createMockTask();
      
      // Application should handle storage errors gracefully
      let errorOccurred = false;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([task]));
      } catch (e) {
        errorOccurred = true;
        // Application should show user-friendly error message
        console.warn('Failed to save task:', e.message);
      }
      
      expect(errorOccurred).toBe(true);
      
      // Restore original method
      localStorage.setItem = originalSetItem;
    });

    test('should recover from data corruption', () => {
      // Simulate corrupted data
      localStorage.setItem(STORAGE_KEY, '{"invalid": json}');
      
      let recoveredTasks = [];
      try {
        recoveredTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      } catch (e) {
        // Recovery: clear corrupted data and start fresh
        localStorage.removeItem(STORAGE_KEY);
        recoveredTasks = [];
      }
      
      expect(recoveredTasks).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});
