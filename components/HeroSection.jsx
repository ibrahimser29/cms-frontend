import Link from 'next/link';
import styles from './HeroSection.module.css';

const API_BASE = 'http://127.0.0.1:3000';

function imgUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/uploads/${path}`;
}

const DEFAULT = {
  title: 'Solid Wood Products',
  subtitle: 'Oak, beech, ash from 1700 CZK per m3',
  buttonText: 'Order',
  buttonUrl: '/contact',
  backgroundImage: '/images/hero-main.png',
};

const DEFAULT_IMAGES = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.png',
];

export default function HeroSection({ section }) {
  const content    = section?.content ?? DEFAULT;
  const images     = section?.images?.length ? section.images : DEFAULT_IMAGES;
  const title      = content?.title      ?? DEFAULT.title;
  const subtitle   = content?.subtitle   ?? DEFAULT.subtitle;
  const buttonText = content?.buttonText ?? DEFAULT.buttonText;
  const buttonUrl  = content?.buttonUrl  ?? DEFAULT.buttonUrl;
  const bgImage    = imgUrl(content?.backgroundImage);

  return (
    <section className={styles.hero}>
      {/* Background layers */}
      <div className={styles.background}>
        <div
          className={styles.imageSide}
          style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
        />
        <div className={styles.blackSide} />
      </div>

      {/* Card centered over both columns */}
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.left}>
            {title    && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p  className={styles.subtitle}>{subtitle}</p>}
            <Link href={buttonUrl} className={styles.button}>{buttonText}</Link>
          </div>

          <div className={styles.divider} />

          <div className={styles.images}>
            {images.slice(0, 3).map((img, i) => (
              <img
                key={i}
                src={imgUrl(img)}
                alt={title || 'Hero image'}
                className={styles.image}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
