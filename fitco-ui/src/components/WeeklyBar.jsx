import styles from './WeeklyBar.module.css';

export default function WeeklyBar({ barDays }) {
  const max = Math.max(...barDays.map(d => d.count), 1);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className={styles.chart}>
      {barDays.map(day => {
        const pct = (day.count / max) * 100;
        const isToday = day.key === today;
        return (
          <div className={styles.col} key={day.key}>
            <span className={styles.count}>{day.count > 0 ? day.count : ''}</span>
            <div className={styles.barTrack}>
              <div
                className={`${styles.bar} ${isToday ? styles.barToday : ''}`}
                style={{ height: `${Math.max(pct, day.count > 0 ? 8 : 0)}%` }}
              />
            </div>
            <span className={`${styles.dayLabel} ${isToday ? styles.dayLabelToday : ''}`}>
              {day.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
