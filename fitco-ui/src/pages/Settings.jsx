import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AvatarPicker, { AvatarDisplay } from '../components/AvatarPicker';
import styles from './Settings.module.css';

export default function Settings() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    gender: '',
    dob: '',
  });

  const [personal, setPersonal] = useState({
    height: '',
    weight: '',
    fitnessGoal: '',
    activityLevel: '',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.pageTitle}>Account</p>
      <h1 className={styles.pageHeading}>Settings</h1>

      <div className={styles.avatarSection}>
        <AvatarDisplay avatar={user?.avatar} name={user?.name} size={72} />
        <div>
          <p className={styles.avatarName}>{user?.name}</p>
          <p className={styles.avatarEmail}>{user?.email}</p>
          <AvatarPicker triggerLabel="Change Avatar" />
        </div>
      </div>

      <form onSubmit={handleSave} className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile Details</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} placeholder="you@email.com" />
            </div>
            <div className={styles.field}>
              <label>Phone</label>
              <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className={styles.field}>
              <label>Gender</label>
              <select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })}>
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Date of Birth</label>
              <input type="date" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Fitness Details</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Height (cm)</label>
              <input type="number" value={personal.height} onChange={e => setPersonal({ ...personal, height: e.target.value })} placeholder="175" />
            </div>
            <div className={styles.field}>
              <label>Weight (kg)</label>
              <input type="number" value={personal.weight} onChange={e => setPersonal({ ...personal, weight: e.target.value })} placeholder="70" />
            </div>
            <div className={styles.field}>
              <label>Fitness Goal</label>
              <select value={personal.fitnessGoal} onChange={e => setPersonal({ ...personal, fitnessGoal: e.target.value })}>
                <option value="">Select</option>
                <option value="WEIGHT_LOSS">Weight Loss</option>
                <option value="MUSCLE_GAIN">Muscle Gain</option>
                <option value="ENDURANCE">Endurance</option>
                <option value="FLEXIBILITY">Flexibility</option>
                <option value="GENERAL_FITNESS">General Fitness</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Activity Level</label>
              <select value={personal.activityLevel} onChange={e => setPersonal({ ...personal, activityLevel: e.target.value })}>
                <option value="">Select</option>
                <option value="SEDENTARY">Sedentary</option>
                <option value="LIGHTLY_ACTIVE">Lightly Active</option>
                <option value="MODERATELY_ACTIVE">Moderately Active</option>
                <option value="VERY_ACTIVE">Very Active</option>
              </select>
            </div>
          </div>
        </section>

        <div className={styles.footer}>
          {saved && <span className={styles.successMsg}>Changes saved successfully</span>}
          <button type="submit" className={styles.saveBtn}>Save Changes</button>
        </div>
      </form>
    </div>
  );
}
