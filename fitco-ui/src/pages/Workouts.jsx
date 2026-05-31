import { useState } from 'react';
import { MUSCLES, WORKOUTS } from '../data/exercises';
import VideoModal from '../components/VideoModal';
import styles from './Workouts.module.css';

function ExerciseCard({ exercise, index, onClick }) {
  return (
    <div className={styles.card} onClick={() => onClick(exercise)}>
      {/* Image */}
      <div className={styles.cardImgWrap}>
        <img
          src={exercise.image}
          alt={exercise.name}
          className={styles.cardImg}
          loading="lazy"
        />
        {/* Play overlay */}
        <div className={styles.playOverlay}>
          <div className={styles.playBtn}>▶</div>
          <span className={styles.playLabel}>Watch Form</span>
        </div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <span className={styles.cardNum}>{String(index + 1).padStart(2, '0')}</span>
        <div>
          <p className={styles.cardName}>{exercise.name}</p>
          <p className={styles.cardSets}>{exercise.sets}</p>
        </div>
      </div>
    </div>
  );
}

export default function Workouts() {
  const [activeTab, setActiveTab] = useState('chest');
  const [selected, setSelected]   = useState(null);   // null = modal closed

  const exercises = WORKOUTS[activeTab];
  const muscle    = MUSCLES.find(m => m.key === activeTab);

  return (
    <div className={styles.wrapper}>
      {/* Tabs */}
      <div className={styles.tabBar}>
        {MUSCLES.map(m => (
          <button
            key={m.key}
            className={`${styles.tab} ${activeTab === m.key ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'fullbody' && (
          <div className={styles.fullBodyBanner}>
            <div>
              <p className={styles.bannerEyebrow}>No Equipment Needed</p>
              <h2 className={styles.bannerTitle}>Full Body Workout</h2>
              <p className={styles.bannerSub}>Yoga · Calisthenics · Conditioning — all in one session</p>
            </div>
            <span className={styles.bannerIcon}>🧘</span>
          </div>
        )}

        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Training</p>
          <h2 className={styles.sectionTitle}>{activeTab !== 'fullbody' ? `${muscle.label} Workout` : 'All Exercises'}</h2>
          <p className={styles.sectionSub}>
            {exercises.length} exercises · Click any card to watch proper form
          </p>
        </div>

        <div className={styles.grid}>
          {exercises.map((ex, i) => (
            <ExerciseCard
              key={ex.name}
              exercise={ex}
              index={i}
              onClick={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Modal — only rendered when a card is selected, destroying iframe on close */}
      {selected && (
        <VideoModal
          exercise={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
