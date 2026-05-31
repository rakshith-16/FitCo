import { useState } from 'react';
import styles from './Workouts.module.css';

const MUSCLES = [
  { key: 'chest',    label: 'Chest',    icon: '▣' },
  { key: 'biceps',   label: 'Biceps',   icon: '▣' },
  { key: 'back',     label: 'Back',     icon: '▣' },
  { key: 'triceps',  label: 'Triceps',  icon: '▣' },
  { key: 'shoulder', label: 'Shoulder', icon: '▣' },
  { key: 'legs',     label: 'Legs',     icon: '▣' },
  { key: 'abs',      label: 'Abs',      icon: '▣' },
];

const WORKOUTS = {
  chest: [
    { name: 'Bench Press',            sets: '4 sets × 8–10 reps',       level: 'Intermediate' },
    { name: 'Incline Dumbbell Press', sets: '3 sets × 10–12 reps',      level: 'Beginner' },
    { name: 'Decline Bench Press',    sets: '3 sets × 8–10 reps',       level: 'Intermediate' },
    { name: 'Push-Ups',               sets: '3 sets × 15–20 reps',      level: 'Beginner' },
    { name: 'Cable Fly',              sets: '3 sets × 12–15 reps',      level: 'Intermediate' },
    { name: 'Dips (Chest Focus)',      sets: '3 sets × 10–12 reps',     level: 'Advanced' },
  ],
  biceps: [
    { name: 'Barbell Curl',           sets: '4 sets × 10–12 reps',      level: 'Beginner' },
    { name: 'Hammer Curl',            sets: '3 sets × 12 reps',         level: 'Beginner' },
    { name: 'Incline Dumbbell Curl',  sets: '3 sets × 10 reps',         level: 'Intermediate' },
    { name: 'Concentration Curl',     sets: '3 sets × 12 reps',         level: 'Intermediate' },
    { name: 'Cable Curl',             sets: '3 sets × 15 reps',         level: 'Beginner' },
    { name: 'Preacher Curl',          sets: '3 sets × 10 reps',         level: 'Advanced' },
  ],
  back: [
    { name: 'Pull-Ups',               sets: '4 sets × 6–10 reps',       level: 'Intermediate' },
    { name: 'Bent-Over Barbell Row',  sets: '4 sets × 8–10 reps',       level: 'Intermediate' },
    { name: 'Lat Pulldown',           sets: '3 sets × 12 reps',         level: 'Beginner' },
    { name: 'Seated Cable Row',       sets: '3 sets × 12 reps',         level: 'Beginner' },
    { name: 'Deadlift',               sets: '3 sets × 5–6 reps',        level: 'Advanced' },
    { name: 'Single-Arm Dumbbell Row',sets: '3 sets × 10 reps',         level: 'Beginner' },
  ],
  triceps: [
    { name: 'Close-Grip Bench Press', sets: '4 sets × 8–10 reps',       level: 'Intermediate' },
    { name: 'Tricep Pushdown',        sets: '3 sets × 12–15 reps',      level: 'Beginner' },
    { name: 'Skull Crushers',         sets: '3 sets × 10–12 reps',      level: 'Intermediate' },
    { name: 'Overhead Tricep Extension', sets: '3 sets × 12 reps',      level: 'Beginner' },
    { name: 'Dips (Tricep Focus)',    sets: '3 sets × 10–12 reps',       level: 'Intermediate' },
    { name: 'Diamond Push-Ups',       sets: '3 sets × 15 reps',         level: 'Beginner' },
  ],
  shoulder: [
    { name: 'Overhead Press',         sets: '4 sets × 8–10 reps',       level: 'Intermediate' },
    { name: 'Lateral Raises',         sets: '3 sets × 15 reps',         level: 'Beginner' },
    { name: 'Front Raises',           sets: '3 sets × 12 reps',         level: 'Beginner' },
    { name: 'Arnold Press',           sets: '3 sets × 10 reps',         level: 'Intermediate' },
    { name: 'Rear Delt Fly',          sets: '3 sets × 15 reps',         level: 'Beginner' },
    { name: 'Face Pulls',             sets: '3 sets × 15 reps',         level: 'Intermediate' },
  ],
  legs: [
    { name: 'Squat',                  sets: '4 sets × 8–10 reps',       level: 'Intermediate' },
    { name: 'Leg Press',              sets: '4 sets × 10–12 reps',      level: 'Beginner' },
    { name: 'Romanian Deadlift',      sets: '3 sets × 10 reps',         level: 'Intermediate' },
    { name: 'Leg Curl',               sets: '3 sets × 12 reps',         level: 'Beginner' },
    { name: 'Leg Extension',          sets: '3 sets × 15 reps',         level: 'Beginner' },
    { name: 'Walking Lunges',         sets: '3 sets × 12 reps / leg',   level: 'Beginner' },
    { name: 'Calf Raises',            sets: '4 sets × 20 reps',         level: 'Beginner' },
  ],
  abs: [
    { name: 'Plank',                  sets: '3 sets × 60 sec',          level: 'Beginner' },
    { name: 'Crunches',               sets: '4 sets × 20 reps',         level: 'Beginner' },
    { name: 'Leg Raises',             sets: '3 sets × 15 reps',         level: 'Intermediate' },
    { name: 'Russian Twists',         sets: '3 sets × 20 reps',         level: 'Beginner' },
    { name: 'Cable Crunch',           sets: '3 sets × 15 reps',         level: 'Intermediate' },
    { name: 'Hanging Knee Raise',     sets: '3 sets × 15 reps',         level: 'Advanced' },
  ],
};


export default function Workouts() {
  const [activeTab, setActiveTab] = useState('chest');
  const exercises = WORKOUTS[activeTab];
  const muscle = MUSCLES.find(m => m.key === activeTab);

  return (
    <div className={styles.wrapper}>
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

      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Training</p>
          <h2 className={styles.sectionTitle}>{muscle.label} Workout</h2>
          <p className={styles.sectionSub}>{exercises.length} exercises</p>
        </div>

        <div className={styles.grid}>
          {exercises.map((ex, i) => (
            <div className={styles.card} key={i}>
              <div className={styles.cardNum}>{String(i + 1).padStart(2, '0')}</div>
              <div className={styles.cardBody}>
                <div className={styles.cardName}>{ex.name}</div>
                <div className={styles.cardSets}>{ex.sets}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
