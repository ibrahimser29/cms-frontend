import Link from 'next/link';
import styles from './AdvantagesSection.module.css';

const API_BASE = 'http://127.0.0.1:3000';

function imgUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/uploads/${path}`;
}

export default function AdvantagesSection({ section }) {
  if (!section) return null;

  const title      = section.title ?? 'Advantages Working With Us';
  const advantages = section.content?.advantages ?? [];
  const buttons    = section.content?.buttons    ?? [];
  const image      = imgUrl(section.images?.[0]);

  const sorted = [...advantages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.body}>
          {image && (
            <div className={styles.imageWrap}>
              <img src={image} alt="Advantages" className={styles.image} />
            </div>
          )}

          <ul className={styles.list}>
            {sorted.map((adv, i) => (
              <li key={i} className={styles.item}>{adv.text}</li>
            ))}
          </ul>
        </div>

        {buttons.length > 0 && (
          <div className={styles.actions}>
            {buttons.map((btn, i) => (
              <Link key={i} href={btn.href ?? '#'} className={styles.button}>
                {btn.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
