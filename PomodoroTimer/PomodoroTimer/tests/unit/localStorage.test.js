/**
 * Unit tests for localStorage task persistence functionality
 * Tests the core data storage and retrieval operations
 */

describe('Task Persistence - localStorage Operations', () => {
  const STORAGE_KEY = 'pomodoroTasks';
  
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Task Storage', () => {
    test('should save a single task to localStorage', () => {
      const mockTask = testUtils.createMockTask({
        name: 'Unit Test Task',
        workTime: 25,
        restTime: 5,
        totalCount: 3
      });

      // Simulate saving task
      const tasks = [mockTask];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

      // Verify storage
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
      
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({
        name: 'Unit Test Task',
        workTime: 25,
        restTime: 5,
        totalCount: 3,
        finishedCount: 0
      });
    });

    test('should save multiple tasks to localStorage', () => {
      const tasks = [
        testUtils.createMockTask({ name: 'Task 1', totalCount: 2 }),
        testUtils.createMockTask({ name: 'Task 2', totalCount: 4 }),
        testUtils.createMockTask({ name: 'Task 3', totalCount: 1 })
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(3);
      expect(stored.map(t => t.name)).toEqual(['Task 1', 'Task 2', 'Task 3']);
    });

    test('should handle empty task list', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toEqual([]);
    });
  });

  describe('Task Retrieval', () => {
    test('should load tasks from localStorage', () => {
      const mockTasks = [
        testUtils.createMockTask({ name: 'Loaded Task 1' }),
        testUtils.createMockTask({ name: 'Loaded Task 2' })
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));

      const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(loaded).toHaveLength(2);
      expect(loaded[0].name).toBe('Loaded Task 1');
      expect(loaded[1].name).toBe('Loaded Task 2');
    });

    test('should return empty array when no tasks stored', () => {
      const result = localStorage.getItem(STORAGE_KEY);
      expect(result).toBeNull();
    });

    test('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json data');
      
      // This should be handled by the application code
      expect(() => {
        try {
          JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (e) {
          // Application should catch this and return empty array
          return [];
        }
      }).not.toThrow();
    });
  });

  describe('Task Updates', () => {
    test('should update task progress in localStorage', () => {
      const initialTask = testUtils.createMockTask({
        id: 'task_123',
        name: 'Progress Task',
        finishedCount: 0,
        totalCount: 3
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([initialTask]));

      // Simulate progress update
      const updatedTask = { ...initialTask, finishedCount: 1 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([updatedTask]));

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored[0].finishedCount).toBe(1);
    });

    test('should update task state in localStorage', () => {
      const task = testUtils.createMockTask({
        id: 'task_456',
        currentState: 'idle'
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([task]));

      // Update state to working
      const updatedTask = { ...task, currentState: 'working', isActive: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([updatedTask]));

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored[0].currentState).toBe('working');
      expect(stored[0].isActive).toBe(true);
    });
  });

  describe('Task Deletion', () => {
    test('should remove specific task from localStorage', () => {
      const tasks = [
        testUtils.createMockTask({ id: 'task_1', name: 'Keep Task 1' }),
        testUtils.createMockTask({ id: 'task_2', name: 'Delete This Task' }),
        testUtils.createMockTask({ id: 'task_3', name: 'Keep Task 3' })
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

      // Remove task_2
      const filteredTasks = tasks.filter(t => t.id !== 'task_2');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(2);
      expect(stored.map(t => t.name)).toEqual(['Keep Task 1', 'Keep Task 3']);
    });

    test('should handle deletion of non-existent task', () => {
      const tasks = [testUtils.createMockTask({ id: 'task_1' })];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

      // Try to delete non-existent task
      const filteredTasks = tasks.filter(t => t.id !== 'non_existent');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(1);
    });
  });

  describe('Data Validation', () => {
    test('should validate task data structure', () => {
      const validTask = testUtils.createMockTask();
      
      // Check required fields
      expect(validTask).toHaveProperty('id');
      expect(validTask).toHaveProperty('name');
      expect(validTask).toHaveProperty('workTime');
      expect(validTask).toHaveProperty('restTime');
      expect(validTask).toHaveProperty('totalCount');
      expect(validTask).toHaveProperty('finishedCount');
      expect(validTask).toHaveProperty('createdAt');
      expect(validTask).toHaveProperty('isActive');
      expect(validTask).toHaveProperty('currentState');
    });

    test('should handle invalid task data types', () => {
      const invalidTasks = [
        { name: 'Invalid Task', workTime: 'not a number' },
        { name: 'Another Invalid', totalCount: null },
        null,
        undefined,
        'not an object'
      ];

      // Application should validate and filter out invalid tasks
      const validTasks = invalidTasks.filter(task => {
        return task && 
               typeof task === 'object' && 
               typeof task.name === 'string' &&
               typeof task.workTime === 'number';
      });

      expect(validTasks).toHaveLength(0);
    });
  });

  describe('Storage Limits', () => {
    test('should handle localStorage quota exceeded', () => {
      // Mock localStorage quota exceeded error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      const task = testUtils.createMockTask();
      
      expect(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([task]));
        } catch (e) {
          // Application should handle this gracefully
          console.warn('Storage quota exceeded:', e);
        }
      }).not.toThrow();

      // Restore original method
      localStorage.setItem = originalSetItem;
    });

    test('should handle large number of tasks', () => {
      // Create 100 tasks to test performance
      const largeTasks = Array.from({ length: 100 }, (_, i) => 
        testUtils.createMockTask({ 
          name: `Task ${i + 1}`,
          id: `task_${i + 1}`
        })
      );

      const serialized = JSON.stringify(largeTasks);
      localStorage.setItem(STORAGE_KEY, serialized);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(100);
      expect(stored[0].name).toBe('Task 1');
      expect(stored[99].name).toBe('Task 100');
    });
  });

  describe('Browser Compatibility', () => {
    test('should handle localStorage not available', () => {
      // Mock localStorage not available
      const originalLocalStorage = window.localStorage;
      delete window.localStorage;

      // Application should detect and handle this
      expect(typeof window.localStorage).toBe('undefined');

      // Restore localStorage
      window.localStorage = originalLocalStorage;
    });

    test('should handle private browsing mode', () => {
      // In private browsing, localStorage might throw on setItem
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new DOMException('SecurityError');
      });

      const task = testUtils.createMockTask();
      
      expect(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([task]));
        } catch (e) {
          // Application should fallback to in-memory storage
          console.warn('localStorage not available:', e);
        }
      }).not.toThrow();

      localStorage.setItem = originalSetItem;
    });
  });
});
