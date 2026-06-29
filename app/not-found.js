import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      {/* Background columns */}
      <div className={styles.background}>
        <div className={styles.imageSide}>
          <div className={styles.overlay} />
        </div>
        <div className={styles.blackSide} />
      </div>

      {/* Content floats over both columns */}
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h1 className={styles.number}>
            4<span className={styles.zero}>0</span>4
          </h1>
          <h2 className={styles.title}>Woops</h2>
          <p className={styles.description}>
            Oh, you must be lost, there is no such page.
          </p>
          <Link href="/" className={styles.button}>
            Go to the home page
          </Link>
        </div>
      </div>
    </div>
  );
}
