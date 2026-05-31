import { useState, useCallback } from 'react';

const STORAGE_KEY = 'fitco_workout_logs';

// Shape stored in localStorage:
// {
//   "2026-05-31": {
//     date: "2026-05-31",
//     exercises: [{ name, sets, reps, weight, note }]
//   }
// }

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useWorkoutLog() {
  const [logs, setLogs] = useState(load);

  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  // Add one exercise entry to a date (default today)
  const addExercise = useCallback((exercise, date = today) => {
    setLogs(prev => {
      const updated = {
        ...prev,
        [date]: {
          date,
          exercises: [...(prev[date]?.exercises || []), exercise],
        },
      };
      save(updated);
      return updated;
    });
  }, [today]);

  // Remove one exercise by index from a date
  const removeExercise = useCallback((date, index) => {
    setLogs(prev => {
      const exercises = (prev[date]?.exercises || []).filter((_, i) => i !== index);
      const updated = { ...prev };
      if (exercises.length === 0) {
        delete updated[date];
      } else {
        updated[date] = { ...prev[date], exercises };
      }
      save(updated);
      return updated;
    });
  }, []);

  // Sorted array of all session dates descending
  const sessionDates = Object.keys(logs).sort((a, b) => b.localeCompare(a));

  // --- Stats ---
  const totalSessions = sessionDates.length;

  const totalExercises = sessionDates.reduce(
    (sum, d) => sum + (logs[d]?.exercises?.length || 0), 0
  );

  // Sessions in the current calendar week (Mon–Sun)
  const weekStart = (() => {
    const d = new Date();
    const day = d.getDay() || 7;       // make Sunday = 7
    d.setDate(d.getDate() - (day - 1));
    return d.toISOString().slice(0, 10);
  })();
  const thisWeek = sessionDates.filter(d => d >= weekStart).length;

  // Current streak — consecutive days ending today or yesterday
  let streak = 0;
  const check = new Date();
  while (true) {
    const key = check.toISOString().slice(0, 10);
    if (logs[key]) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }

  // Last 84 days (12 weeks) for heatmap
  const heatmapDays = Array.from({ length: 84 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (83 - i));
    const key = d.toISOString().slice(0, 10);
    return { key, count: logs[key]?.exercises?.length || 0 };
  });

  // Last 7 days bar chart
  const barDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key  = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    return { key, label, count: logs[key]?.exercises?.length || 0 };
  });

  return {
    logs,
    today,
    todayLog: logs[today] || null,
    sessionDates,
    addExercise,
    removeExercise,
    stats: { totalSessions, totalExercises, thisWeek, streak },
    heatmapDays,
    barDays,
  };
}
