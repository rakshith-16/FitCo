import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

const stats = [
  { label: 'Workouts Done',    value: '0',  sub: 'this month',   gradient: 'linear-gradient(135deg,#6366F1,#8B5CF6)', icon: '🏋️' },
  { label: 'Calories Burned',  value: '0',  sub: 'kcal total',   gradient: 'linear-gradient(135deg,#F59E0B,#EF4444)', icon: '🔥' },
  { label: 'Active Streak',    value: '0',  sub: 'days in a row', gradient: 'linear-gradient(135deg,#10B981,#06B6D4)', icon: '⚡' },
  { label: 'Personal Records', value: '0',  sub: 'all time',     gradient: 'linear-gradient(135deg,#EC4899,#F43F5E)', icon: '🏆' },
];

export default function Home() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Athlete';

  return (
    <div className={styles.wrapper}>
      {/* Hero banner */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.heroTag}>Good day</p>
          <h1 className={styles.heroTitle}>Welcome back, {firstName}!</h1>
          <p className={styles.heroSub}>Stay consistent. Every rep counts.</p>
        </div>
        <div className={styles.heroBadge}>💪</div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div className={styles.statCard} key={s.label} style={{ '--grad': s.gradient }}>
            <div className={styles.statTop}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statValue}>{s.value}</span>
            </div>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statSub}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className={styles.tipCard}>
        <div className={styles.tipLeft}>
          <span className={styles.tipIcon}>💡</span>
        </div>
        <div>
          <p className={styles.tipTitle}>Today's Insight</p>
          <p className={styles.tipText}>
            Consistency outperforms intensity. A focused 30-minute session every day
            will outperform sporadic two-hour efforts. Build the habit — results follow.
          </p>
        </div>
      </div>
    </div>
  );
}
