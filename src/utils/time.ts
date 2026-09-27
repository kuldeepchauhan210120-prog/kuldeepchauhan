import { Task } from '../types';

/**
 * Returns current local time as "HH:MM" 24-hr string
 */
export function getCurrentTimeHHMM(d = new Date()): string {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Converts "HH:MM" to total minutes from midnight
 */
export function timeStringToMinutes(timeStr?: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return 0;
  return parts[0] * 60 + parts[1];
}

/**
 * Converts total minutes from midnight back to "HH:MM"
 */
export function minutesToTimeString(minutes: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, Math.round(minutes)));
  const h = String(Math.floor(clamped / 60)).padStart(2, '0');
  const m = String(clamped % 60).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Formats "09:30" to "9:30 AM" or "14:15" to "2:15 PM"
 */
export function formatTime12Hour(timeStr?: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Checks if a task is currently active at this exact hour/minute
 */
export function isTaskCurrentFocus(task: Task, currentTimeMinutes?: number): boolean {
  if (task.completed) return false;
  const current = currentTimeMinutes ?? timeStringToMinutes(getCurrentTimeHHMM());

  if (task.timeType === 'fixed' && task.startTime) {
    const start = timeStringToMinutes(task.startTime);
    const end = task.endTime
      ? timeStringToMinutes(task.endTime)
      : start + (task.durationMinutes || 45);
    return current >= start && current < end;
  }

  return false;
}

/**
 * Checks if a task is overdue:
 * - Fixed: endTime has passed (or startTime has passed by more than 15 mins)
 * - Deadline: deadlineTime has passed
 */
export function isTaskOverdue(task: Task, currentTimeMinutes?: number): { isOverdue: boolean; overdueMinutes: number } {
  if (task.completed) return { isOverdue: false, overdueMinutes: 0 };
  const current = currentTimeMinutes ?? timeStringToMinutes(getCurrentTimeHHMM());

  if (task.timeType === 'fixed' && task.startTime) {
    const end = task.endTime ? timeStringToMinutes(task.endTime) : timeStringToMinutes(task.startTime) + (task.durationMinutes || 45);
    if (current > end) {
      return { isOverdue: true, overdueMinutes: current - end };
    }
  }

  if (task.timeType === 'deadline' && task.deadlineTime) {
    const deadline = timeStringToMinutes(task.deadlineTime);
    if (current > deadline) {
      return { isOverdue: true, overdueMinutes: current - deadline };
    }
  }

  return { isOverdue: false, overdueMinutes: 0 };
}

/**
 * Returns formatted countdown for deadline tasks:
 * e.g. "3h 20m remaining", "42m left", "Due in 8m!"
 */
export function getDeadlineToNowLabel(deadlineTime?: string, currentTimeMinutes?: number): {
  label: string;
  isUrgent: boolean;
  isOverdue: boolean;
} {
  if (!deadlineTime) return { label: '', isUrgent: false, isOverdue: false };
  const current = currentTimeMinutes ?? timeStringToMinutes(getCurrentTimeHHMM());
  const deadline = timeStringToMinutes(deadlineTime);
  const diff = deadline - current;

  if (diff < 0) {
    const overdueMins = Math.abs(diff);
    const h = Math.floor(overdueMins / 60);
    const m = overdueMins % 60;
    const timeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
    return { label: `Overdue by ${timeStr}`, isUrgent: true, isOverdue: true };
  }

  if (diff === 0) {
    return { label: 'Due right now!', isUrgent: true, isOverdue: false };
  }

  const h = Math.floor(diff / 60);
  const m = diff % 60;
  const isUrgent = diff <= 45; // less than 45 mins left

  if (h > 0) {
    return { label: `${h}h ${m}m remaining`, isUrgent, isOverdue: false };
  }
  return { label: `${m}m remaining`, isUrgent, isOverdue: false };
}

/**
 * Quick Reschedule Helper: Calculates new time string
 */
export function calculateRescheduledTime(
  baseTime: string,
  type: '+30m' | '+1h' | 'afternoon' | 'tomorrow_morning'
): { startTime?: string; endTime?: string; deadlineTime?: string } {
  const currentMins = timeStringToMinutes(getCurrentTimeHHMM());

  if (type === '+30m') {
    const newMins = currentMins + 30;
    const timeStr = minutesToTimeString(newMins);
    return { startTime: timeStr, deadlineTime: timeStr };
  }

  if (type === '+1h') {
    const newMins = currentMins + 60;
    const timeStr = minutesToTimeString(newMins);
    return { startTime: timeStr, deadlineTime: timeStr };
  }

  if (type === 'afternoon') {
    return { startTime: '14:00', endTime: '15:00', deadlineTime: '15:00' };
  }

  // tomorrow morning
  return { startTime: '09:00', endTime: '10:00', deadlineTime: '10:00' };
}
