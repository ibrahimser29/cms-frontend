'use client';

import { useState } from 'react';
import styles from './WorkSection.module.css';

const API_BASE = 'http://127.0.0.1:3000';

function imgUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/uploads/${path}`;
}

export default function WorkSection({ section }) {
  const [current, setCurrent] = useState(0);

  const title  = section?.title  ?? 'Our Work';
  const images = section?.images ?? [];

  if (images.length === 0) return null;

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.carousel}>
          <button type="button" className={styles.arrow} onClick={prev} aria-label="Previous">
            &#8249;
          </button>

          <div className={styles.frame}>
            <img
              src={imgUrl(images[current])}
              alt={`${title} ${current + 1}`}
              className={styles.image}
            />

            {images.length > 1 && (
              <div className={styles.dots}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <button type="button" className={styles.arrow} onClick={next} aria-label="Next">
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
