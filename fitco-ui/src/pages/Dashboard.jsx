import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Home from './Home';
import Workouts from './Workouts';
import Settings from './Settings';
import AvatarPicker from '../components/AvatarPicker';
import styles from './Dashboard.module.css';

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return (
    <div className={styles.clock}>
      <span className={styles.clockDate}>{date}</span>
      <span className={styles.clockTime}>{time}</span>
    </div>
  );
}

const NAV = [
  { key: 'home',     label: 'Home',     icon: '🏠' },
  { key: 'workout',  label: 'Workout',  icon: '🏋️' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState('home');

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  return (
    <div className={styles.shell}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>FIT<span className={styles.logoAccent}>CO</span></div>
        <LiveClock />
        <div className={styles.navRight}>
          <AvatarPicker />
          <span className={styles.welcome}>{user?.name}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </nav>

      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <p className={styles.sidebarLabel}>Navigation</p>
          {NAV.map(n => (
            <button
              key={n.key}
              className={`${styles.navBtn} ${page === n.key ? styles.navBtnActive : ''}`}
              onClick={() => setPage(n.key)}
            >
              <span className={styles.navIcon}>{n.icon}</span>
              <span className={styles.navLabel}>{n.label}</span>
            </button>
          ))}
        </aside>

        <div className={styles.content}>
          {page === 'home'     && <Home />}
          {page === 'workout'  && <Workouts />}
          {page === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
}
