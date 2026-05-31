import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const INITIAL = {
  name: '', email: '', password: '',
  gender: '', dateOfBirth: '', heightCm: '', weightKg: '', fitnessGoal: '',
};

export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        heightCm: form.heightCm ? parseFloat(form.heightCm) : null,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
        dateOfBirth: form.dateOfBirth || null,
      };
      const { data } = await register(payload);
      loginUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: 520 }}>
        <p className={styles.eyebrow}>FitCo</p>
        <div className={styles.logo}>Create Account</div>
        <p className={styles.subtitle}>Start your fitness journey</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className={styles.field}>
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>

          <div className={styles.field}>
            <label>Password *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" required minLength={8} />
          </div>

          <div className={styles.field}>
            <label>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Height (cm)</label>
              <input type="number" name="heightCm" value={form.heightCm} onChange={handleChange} placeholder="170" />
            </div>
            <div className={styles.field}>
              <label>Weight (kg)</label>
              <input type="number" name="weightKg" value={form.weightKg} onChange={handleChange} placeholder="70" />
            </div>
          </div>

          <div className={styles.field}>
            <label>Fitness Goal</label>
            <select name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange}>
              <option value="">Select Goal</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Stay Fit">Stay Fit</option>
              <option value="Endurance">Endurance</option>
              <option value="Flexibility">Flexibility</option>
            </select>
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
