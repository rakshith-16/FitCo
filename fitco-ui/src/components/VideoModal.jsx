import { useEffect } from 'react';
import styles from './VideoModal.module.css';

export default function VideoModal({ exercise, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const src =
    `https://www.youtube.com/embed/${exercise.videoId}` +
    `?start=${exercise.videoStart}` +
    `&end=${exercise.videoStart + 35}` +
    `&autoplay=1` +
    `&rel=0` +
    `&controls=1` +
    `&modestbranding=1` +
    `&color=white`;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Proper Form · 30 sec</p>
            <h2 className={styles.title}>{exercise.name}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* YouTube player */}
        <div className={styles.videoWrap}>
          <iframe
            src={src}
            title={exercise.name}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className={styles.iframe}
          />
        </div>

        {/* Form tip */}
        <div className={styles.tip}>
          <span className={styles.tipIcon}>💡</span>
          <p className={styles.tipText}>{exercise.tip}</p>
        </div>

        {/* Sets info */}
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Volume</span>
            <span className={styles.metaValue}>{exercise.sets}</span>
          </div>
          <div className={styles.metaDivider} />
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Rest</span>
            <span className={styles.metaValue}>60 – 90 sec</span>
          </div>
          <div className={styles.metaDivider} />
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Tempo</span>
            <span className={styles.metaValue}>2 – 0 – 1</span>
          </div>
        </div>

      </div>
    </div>
  );
}
