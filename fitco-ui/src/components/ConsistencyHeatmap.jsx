import styles from './ConsistencyHeatmap.module.css';

// 84 days = 12 weeks × 7 days, displayed as columns of 7
function getColor(count) {
  if (count === 0) return 'var(--c0)';
  if (count <= 2)  return 'var(--c1)';
  if (count <= 4)  return 'var(--c2)';
  if (count <= 6)  return 'var(--c3)';
  return 'var(--c4)';
}

const WEEK_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

export default function ConsistencyHeatmap({ days }) {
  // split 84 days into 12 columns of 7
  const weeks = [];
  for (let w = 0; w < 12; w++) {
    weeks.push(days.slice(w * 7, w * 7 + 7));
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className={styles.wrapper}>
      {/* Row labels */}
      <div className={styles.rowLabels}>
        {WEEK_LABELS.map((l, i) => (
          <span key={i} className={styles.rowLabel}>{l}</span>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.weekCol}>
            {week.map((day, di) => (
              <div
                key={di}
                className={`${styles.cell} ${day.key === today ? styles.cellToday : ''}`}
                style={{ background: getColor(day.count) }}
                title={`${day.key}: ${day.count} exercise${day.count !== 1 ? 's' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        {['var(--c0)', 'var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)'].map((c, i) => (
          <div key={i} className={styles.legendCell} style={{ background: c }} />
        ))}
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  );
}
