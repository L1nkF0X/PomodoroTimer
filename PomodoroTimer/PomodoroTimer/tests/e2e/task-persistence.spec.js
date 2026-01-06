/**
 * End-to-End tests for task persistence functionality
 * Tests the complete user workflow with real browser interactions
 */

const { test, expect } = require('@playwright/test');

test.describe('Task Persistence E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Task Creation and Persistence', () => {
    test('should persist tasks across page reloads', async ({ page }) => {
      await page.goto('/');
      
      // Create a new task
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'E2E Test Task');
      
      // Increase pomodoro count to 3
      await page.click('#addMission-main-button-add');
      await page.click('#addMission-main-button-add');
      
      // Verify count display
      await expect(page.locator('#missionCount')).toHaveText('3');
      
      // Confirm task creation
      await page.click('#addMission-foot-button-confirm');
      
      // Verify task appears in the list
      await expect(page.locator('#missionList')).toBeVisible();
      await expect(page.locator('#missionList strong')).toHaveText('E2E Test Task');
      await expect(page.locator('.span1')).toHaveText('0/3');
      
      // Reload page to test persistence
      await page.reload();
      
      // Verify task still exists after reload
      await expect(page.locator('#missionList')).toBeVisible();
      await expect(page.locator('#missionList strong')).toHaveText('E2E Test Task');
      await expect(page.locator('.span1')).toHaveText('0/3');
    });

    test('should persist multiple tasks', async ({ page }) => {
      await page.goto('/');
      
      // Create first task
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'First Task');
      await page.click('#addMission-foot-button-confirm');
      
      // Create second task
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'Second Task');
      await page.click('#addMission-main-button-add'); // Make it 2 pomodoros
      await page.click('#addMission-foot-button-confirm');
      
      // Verify both tasks exist
      const taskNames = await page.locator('#missionList strong').allTextContents();
      expect(taskNames).toEqual(['First Task', 'Second Task']);
      
      // Reload and verify persistence
      await page.reload();
      
      const persistedTaskNames = await page.locator('#missionList strong').allTextContents();
      expect(persistedTaskNames).toEqual(['First Task', 'Second Task']);
    });

    test('should persist task with default name', async ({ page }) => {
      await page.goto('/');
      
      // Create task without entering name (should use placeholder)
      await page.click('#newMission-btn');
      await page.click('#addMission-foot-button-confirm');
      
      // Verify default name is used
      await expect(page.locator('#missionList strong')).toHaveText('My Pomodoro Task');
      
      // Reload and verify persistence
      await page.reload();
      await expect(page.locator('#missionList strong')).toHaveText('My Pomodoro Task');
    });
  });

  test.describe('Task Progress Persistence', () => {
    test('should persist task progress when pomodoro is completed', async ({ page }) => {
      await page.goto('/');
      
      // Create a task
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'Progress Test');
      await page.click('#addMission-main-button-add'); // 2 pomodoros
      await page.click('#addMission-foot-button-confirm');
      
      // Start the task
      await page.click('.span2'); // Start button
      
      // Verify timer is running (button should change to complete)
      await expect(page.locator('.span2 i')).toHaveText('✅');
      
      // Complete the pomodoro manually
      await page.click('.span2'); // Complete button
      
      // Verify progress updated
      await expect(page.locator('.span1')).toHaveText('1/2');
      
      // Reload page
      await page.reload();
      
      // Verify progress persisted
      await expect(page.locator('.span1')).toHaveText('1/2');
    });

    test('should persist timer state during active session', async ({ page }) => {
      await page.goto('/');
      
      // Create and start a task
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'Timer State Test');
      await page.click('#addMission-foot-button-confirm');
      
      await page.click('.span2'); // Start timer
      
      // Verify timer is active
      await expect(page.locator('.span2 i')).toHaveText('✅');
      await expect(page.locator('.span3 i')).toHaveText('⏹️');
      
      // Wait a moment for timer to run
      await page.waitForTimeout(2000);
      
      // Stop the timer
      await page.click('.span3'); // Stop button
      
      // Verify timer stopped
      await expect(page.locator('.span2 i')).toHaveText('▶️');
      await expect(page.locator('.span3 i')).toHaveText('🗑️');
      
      // Reload and verify state
      await page.reload();
      await expect(page.locator('.span2 i')).toHaveText('▶️');
    });
  });

  test.describe('Task Deletion Persistence', () => {
    test('should persist task deletion', async ({ page }) => {
      await page.goto('/');
      
      // Create multiple tasks
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'Task to Keep');
      await page.click('#addMission-foot-button-confirm');
      
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'Task to Delete');
      await page.click('#addMission-foot-button-confirm');
      
      // Verify both tasks exist
      let taskNames = await page.locator('#missionList strong').allTextContents();
      expect(taskNames).toEqual(['Task to Keep', 'Task to Delete']);
      
      // Delete the second task
      const deleteButtons = page.locator('.span3');
      await deleteButtons.nth(1).click(); // Delete second task
      
      // Verify task was deleted
      taskNames = await page.locator('#missionList strong').allTextContents();
      expect(taskNames).toEqual(['Task to Keep']);
      
      // Reload and verify deletion persisted
      await page.reload();
      taskNames = await page.locator('#missionList strong').allTextContents();
      expect(taskNames).toEqual(['Task to Keep']);
    });

    test('should handle deletion of all tasks', async ({ page }) => {
      await page.goto('/');
      
      // Create a single task
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'Only Task');
      await page.click('#addMission-foot-button-confirm');
      
      // Verify task exists
      await expect(page.locator('#missionList')).toBeVisible();
      
      // Delete the task
      await page.click('.span3');
      
      // Verify no tasks remain
      await expect(page.locator('#missionList')).not.toBeVisible();
      
      // Reload and verify empty state persisted
      await page.reload();
      await expect(page.locator('#missionList')).not.toBeVisible();
    });
  });

  test.describe('Settings Integration', () => {
    test('should persist custom time settings for new tasks', async ({ page }) => {
      await page.goto('/');
      
      // Go to settings
      await page.click('a[href="javascript:;"]:has-text("Settings")');
      
      // Change work time to 30 minutes
      await page.fill('.text[placeholder="25"]', '30');
      
      // Change break time to 10 minutes
      await page.fill('.text[placeholder="5"]', '10');
      
      // Go back to tasks
      await page.click('a[href="javascript:;"]:has-text("Tasks")');
      
      // Create a new task
      await page.click('#newMission-btn');
      
      // Verify custom times are displayed
      await expect(page.locator('#li-missionTime')).toHaveText('30 minutes');
      await expect(page.locator('#li-restTime')).toHaveText('10 minutes');
      
      await page.fill('#missionName', 'Custom Time Task');
      await page.click('#addMission-foot-button-confirm');
      
      // Reload page
      await page.reload();
      
      // Verify task persisted and settings are maintained
      await expect(page.locator('#missionList strong')).toHaveText('Custom Time Task');
      
      // Check that settings are still applied for new tasks
      await page.click('#newMission-btn');
      await expect(page.locator('#li-missionTime')).toHaveText('30 minutes');
      await expect(page.locator('#li-restTime')).toHaveText('10 minutes');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle localStorage quota exceeded gracefully', async ({ page }) => {
      await page.goto('/');
      
      // Fill localStorage to near capacity
      await page.evaluate(() => {
        try {
          // Try to fill localStorage with large data
          const largeData = 'x'.repeat(1024 * 1024); // 1MB string
          for (let i = 0; i < 5; i++) {
            localStorage.setItem(`large_data_${i}`, largeData);
          }
        } catch (e) {
          // Expected to fail at some point
          console.log('Storage quota reached');
        }
      });
      
      // Try to create a task (should handle quota exceeded gracefully)
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'Quota Test Task');
      await page.click('#addMission-foot-button-confirm');
      
      // Application should not crash
      await expect(page.locator('body')).not.toHaveClass('error');
      
      // Clean up
      await page.evaluate(() => localStorage.clear());
    });

    test('should recover from corrupted localStorage data', async ({ page }) => {
      await page.goto('/');
      
      // Corrupt localStorage data
      await page.evaluate(() => {
        localStorage.setItem('pomodoroTasks', 'invalid json data');
      });
      
      // Reload page - should handle corruption gracefully
      await page.reload();
      
      // Application should still work
      await expect(page.locator('h1')).toHaveText('Pomodoro Timer');
      
      // Should be able to create new tasks
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'Recovery Test');
      await page.click('#addMission-foot-button-confirm');
      
      await expect(page.locator('#missionList strong')).toHaveText('Recovery Test');
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    test('should work consistently across different browsers', async ({ page, browserName }) => {
      await page.goto('/');
      
      // Create a task
      await page.click('#newMission-btn');
      await page.fill('#missionName', `${browserName} Test Task`);
      await page.click('#addMission-foot-button-confirm');
      
      // Verify task creation
      await expect(page.locator('#missionList strong')).toHaveText(`${browserName} Test Task`);
      
      // Test persistence
      await page.reload();
      await expect(page.locator('#missionList strong')).toHaveText(`${browserName} Test Task`);
      
      // Test task interaction
      await page.click('.span2'); // Start
      await expect(page.locator('.span2 i')).toHaveText('✅');
      
      await page.click('.span3'); // Stop
      await expect(page.locator('.span2 i')).toHaveText('▶️');
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.goto('/');
      
      // Create a task on mobile
      await page.click('#newMission-btn');
      await page.fill('#missionName', 'Mobile Test Task');
      await page.click('#addMission-foot-button-confirm');
      
      // Verify task creation
      await expect(page.locator('#missionList strong')).toHaveText('Mobile Test Task');
      
      // Test touch interactions
      await page.tap('.span2'); // Start task
      await expect(page.locator('.span2 i')).toHaveText('✅');
      
      // Test persistence on mobile
      await page.reload();
      await expect(page.locator('#missionList strong')).toHaveText('Mobile Test Task');
    });
  });

  test.describe('Performance', () => {
    test('should handle large number of tasks efficiently', async ({ page }) => {
      await page.goto('/');
      
      // Create multiple tasks quickly
      for (let i = 1; i <= 10; i++) {
        await page.click('#newMission-btn');
        await page.fill('#missionName', `Performance Test Task ${i}`);
        await page.click('#addMission-foot-button-confirm');
      }
      
      // Verify all tasks were created
      const taskCount = await page.locator('#missionList ul').count();
      expect(taskCount).toBe(10);
      
      // Test reload performance
      const startTime = Date.now();
      await page.reload();
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time (5 seconds)
      expect(loadTime).toBeLessThan(5000);
      
      // Verify all tasks still exist
      const persistedTaskCount = await page.locator('#missionList ul').count();
      expect(persistedTaskCount).toBe(10);
    });
  });
});
