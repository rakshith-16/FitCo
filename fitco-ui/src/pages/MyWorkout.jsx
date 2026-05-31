import { useState } from 'react';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import ConsistencyHeatmap from '../components/ConsistencyHeatmap';
import WeeklyBar from '../components/WeeklyBar';
import styles from './MyWorkout.module.css';

const EMPTY_FORM = { name: '', sets: '', reps: '', weight: '', note: '' };

const STAT_CARDS = [
  { key: 'totalSessions',  label: 'Total Sessions',   icon: '🗓️',  suffix: '' },
  { key: 'thisWeek',       label: 'This Week',         icon: '📅',  suffix: '' },
  { key: 'streak',         label: 'Current Streak',    icon: '🔥',  suffix: ' days' },
  { key: 'totalExercises', label: 'Exercises Logged',  icon: '✅',  suffix: '' },
];

function HistoryCard({ date, exercises, onRemove }) {
  const [open, setOpen] = useState(false);
  const label = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className={styles.historyCard}>
      <button className={styles.historyHeader} onClick={() => setOpen(o => !o)}>
        <div className={styles.historyMeta}>
          <span className={styles.historyDot} />
          <div>
            <p className={styles.historyDate}>{label}</p>
            <p className={styles.historyCount}>{exercises.length} exercise{exercises.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <span className={styles.historyChevron}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={styles.historyBody}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight</th>
                <th>Note</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex, i) => (
                <tr key={i}>
                  <td className={styles.tdName}>{ex.name}</td>
                  <td>{ex.sets || '—'}</td>
                  <td>{ex.reps || '—'}</td>
                  <td>{ex.weight ? `${ex.weight} kg` : '—'}</td>
                  <td className={styles.tdNote}>{ex.note || '—'}</td>
                  <td>
                    <button
                      className={styles.removeBtn}
                      onClick={() => onRemove(date, i)}
                      title="Remove"
                    >✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MyWorkout() {
  const { logs, today, todayLog, sessionDates, addExercise, removeExercise,
          stats, heatmapDays, barDays } = useWorkoutLog();

  const [form, setForm]     = useState(EMPTY_FORM);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Exercise name is required.'); return; }
    setError('');
    addExercise({
      name:   form.name.trim(),
      sets:   form.sets,
      reps:   form.reps,
      weight: form.weight,
      note:   form.note.trim(),
    });
    setForm(EMPTY_FORM);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const historyPast = sessionDates.filter(d => d !== today);

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageHead}>
        <p className={styles.eyebrow}>Training Log</p>
        <h1 className={styles.pageTitle}>My Workout</h1>
      </div>

      {/* ── Stat cards ── */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map(s => (
          <div className={styles.statCard} key={s.key}>
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{stats[s.key]}{s.suffix}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <p className={styles.chartTitle}>Last 7 Days</p>
          <WeeklyBar barDays={barDays} />
        </div>
        <div className={`${styles.chartBox} ${styles.chartBoxWide}`}>
          <p className={styles.chartTitle}>12-Week Consistency</p>
          <ConsistencyHeatmap days={heatmapDays} />
        </div>
      </div>

      {/* ── Main content: log form + today's log ── */}
      <div className={styles.mainRow}>

        {/* Log form */}
        <div className={styles.logBox}>
          <p className={styles.boxTitle}>Log Today's Workout</p>
          <p className={styles.boxSub}>{todayLabel}</p>

          {error   && <p className={styles.errorMsg}>{error}</p>}
          {success && <p className={styles.successMsg}>✅ Exercise added!</p>}

          <form onSubmit={handleAdd} className={styles.form}>
            <div className={styles.formField}>
              <label>Exercise Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Bench Press, Surya Namaskar"
                autoComplete="off"
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Sets</label>
                <input name="sets" type="number" min="1" value={form.sets}
                  onChange={handleChange} placeholder="4" />
              </div>
              <div className={styles.formField}>
                <label>Reps</label>
                <input name="reps" type="number" min="1" value={form.reps}
                  onChange={handleChange} placeholder="10" />
              </div>
              <div className={styles.formField}>
                <label>Weight (kg)</label>
                <input name="weight" type="number" min="0" value={form.weight}
                  onChange={handleChange} placeholder="60" />
              </div>
            </div>
            <div className={styles.formField}>
              <label>Note (optional)</label>
              <input name="note" value={form.note} onChange={handleChange}
                placeholder="Felt strong, increased weight..." />
            </div>
            <button type="submit" className={styles.addBtn}>+ Add Exercise</button>
          </form>
        </div>

        {/* Today's session */}
        <div className={styles.todayBox}>
          <p className={styles.boxTitle}>Today's Session</p>
          <p className={styles.boxSub}>{todayLog ? `${todayLog.exercises.length} exercises logged` : 'Nothing logged yet'}</p>

          {!todayLog && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🏋️</span>
              <p>Log your first exercise for today!</p>
            </div>
          )}

          {todayLog && (
            <div className={styles.todayList}>
              {todayLog.exercises.map((ex, i) => (
                <div className={styles.todayItem} key={i}>
                  <div className={styles.todayItemLeft}>
                    <span className={styles.todayItemNum}>{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className={styles.todayItemName}>{ex.name}</p>
                      <p className={styles.todayItemMeta}>
                        {[ex.sets && `${ex.sets} sets`,
                          ex.reps && `${ex.reps} reps`,
                          ex.weight && `${ex.weight} kg`
                        ].filter(Boolean).join(' · ') || 'No details'}
                      </p>
                      {ex.note && <p className={styles.todayItemNote}>"{ex.note}"</p>}
                    </div>
                  </div>
                  <button className={styles.removeBtn}
                    onClick={() => removeExercise(today, i)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Past history ── */}
      {historyPast.length > 0 && (
        <div className={styles.historySection}>
          <p className={styles.boxTitle}>Workout History</p>
          <p className={styles.boxSub}>{historyPast.length} past session{historyPast.length !== 1 ? 's' : ''}</p>
          <div className={styles.historyList}>
            {historyPast.map(date => (
              <HistoryCard
                key={date}
                date={date}
                exercises={logs[date].exercises}
                onRemove={removeExercise}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
