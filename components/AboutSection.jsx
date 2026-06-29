import styles from './AboutSection.module.css';

const API_BASE = 'http://127.0.0.1:3000';

function imgUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/uploads/${path}`;
}

export default function AboutSection({ section }) {
  if (!section) return null;

  const title       = section.title ?? 'About Us';
  const company     = section.content?.company ?? '';
  const description = section.content?.description ?? '';
  const images      = section.images ?? [];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>
            {company && <><strong className={styles.company}>{company}</strong>{' – '}</>}
            {description}
          </p>
        </div>

        {images.length > 0 && (
          <div className={styles.images}>
            {images.slice(0, 3).map((img, i) => (
              <img
                key={i}
                src={imgUrl(img)}
                alt={`${title} ${i + 1}`}
                className={styles.image}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
