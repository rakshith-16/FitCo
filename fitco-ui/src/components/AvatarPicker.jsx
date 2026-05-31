import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './AvatarPicker.module.css';

const EMOJIS = [
  '😀','😎','🤩','🥳','😏','🧐','🤓','😴',
  '🥷','👻','🤖','👽','🦸','🦹','🧙','🧛',
  '🐯','🦁','🐻','🐼','🐨','🦊','🐺','🐸',
];

const CARTOONS = [
  { label: 'Ninja',      bg: '#2d3436', emoji: '🥷' },
  { label: 'Astronaut',  bg: '#0984e3', emoji: '👨‍🚀' },
  { label: 'Wizard',     bg: '#6c5ce7', emoji: '🧙‍♂️' },
  { label: 'Robot',      bg: '#00b894', emoji: '🤖' },
  { label: 'Viking',     bg: '#e17055', emoji: '🧔' },
  { label: 'Vampire',    bg: '#636e72', emoji: '🧛' },
  { label: 'Superhero',  bg: '#e84393', emoji: '🦸' },
  { label: 'Pirate',     bg: '#fdcb6e', emoji: '🏴‍☠️' },
  { label: 'Alien',      bg: '#55efc4', emoji: '👽' },
  { label: 'Ghost',      bg: '#b2bec3', emoji: '👻' },
  { label: 'Dragon',     bg: '#d63031', emoji: '🐉' },
  { label: 'Unicorn',    bg: '#fd79a8', emoji: '🦄' },
];

export default function AvatarPicker() {
  const { user, updateAvatar } = useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('emoji');
  const fileRef = useRef();
  const popupRef = useRef();

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateAvatar(ev.target.result);
      setOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const pickEmoji = (emoji) => {
    updateAvatar(`emoji:${emoji}`);
    setOpen(false);
  };

  const pickCartoon = (c) => {
    updateAvatar(`cartoon:${c.emoji}:${c.bg}`);
    setOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={popupRef}>
      <button className={styles.trigger} onClick={() => setOpen(o => !o)} title="Change avatar">
        <AvatarDisplay avatar={user?.avatar} name={user?.name} size={36} />
        <span className={styles.editDot}>✏️</span>
      </button>

      {open && (
        <div className={styles.popup}>
          <p className={styles.popupTitle}>Choose your avatar</p>

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'emoji' ? styles.activeTab : ''}`} onClick={() => setTab('emoji')}>😀 Emojis</button>
            <button className={`${styles.tab} ${tab === 'cartoon' ? styles.activeTab : ''}`} onClick={() => setTab('cartoon')}>🦸 Characters</button>
            <button className={`${styles.tab} ${tab === 'photo' ? styles.activeTab : ''}`} onClick={() => setTab('photo')}>📷 Photo</button>
          </div>

          {tab === 'emoji' && (
            <div className={styles.grid}>
              {EMOJIS.map(em => (
                <button key={em} className={styles.emojiBtn} onClick={() => pickEmoji(em)}>{em}</button>
              ))}
            </div>
          )}

          {tab === 'cartoon' && (
            <div className={styles.cartoonGrid}>
              {CARTOONS.map(c => (
                <button key={c.label} className={styles.cartoonBtn} onClick={() => pickCartoon(c)}
                  style={{ background: c.bg }}>
                  <span className={styles.cartoonEmoji}>{c.emoji}</span>
                  <span className={styles.cartoonLabel}>{c.label}</span>
                </button>
              ))}
            </div>
          )}

          {tab === 'photo' && (
            <div className={styles.photoArea}>
              <p className={styles.photoHint}>Upload a photo from your device</p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
              <button className={styles.uploadBtn} onClick={() => fileRef.current.click()}>📁 Browse Photo</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AvatarDisplay({ avatar, name, size = 36 }) {
  const fontSize = size * 0.42;

  if (!avatar) {
    return (
      <div className={styles.avatarDefault} style={{ width: size, height: size, fontSize }}>
        {name?.charAt(0).toUpperCase()}
      </div>
    );
  }

  if (avatar.startsWith('data:')) {
    return <img src={avatar} alt="avatar" className={styles.avatarImg} style={{ width: size, height: size }} />;
  }

  if (avatar.startsWith('emoji:')) {
    const em = avatar.slice(6);
    return (
      <div className={styles.avatarEmoji} style={{ width: size, height: size, fontSize: size * 0.6 }}>
        {em}
      </div>
    );
  }

  if (avatar.startsWith('cartoon:')) {
    const [, em, bg] = avatar.split(':');
    return (
      <div className={styles.avatarEmoji} style={{ width: size, height: size, fontSize: size * 0.6, background: bg }}>
        {em}
      </div>
    );
  }

  return (
    <div className={styles.avatarDefault} style={{ width: size, height: size, fontSize }}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}
