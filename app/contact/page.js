import styles from './page.module.css';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>

        {/* ── Left ── */}
        <div className={styles.left}>
          <h1 className={styles.heading}>Contact</h1>

          <ul className={styles.list}>
            <li className={styles.item}>
              {/* Phone icon */}
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>+420 000 000 000</span>
            </li>

            <li className={styles.item}>
              {/* Location icon */}
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>
                Na Plzeňce 1166/0<br />
                150 00
              </span>
            </li>
          </ul>
        </div>

        {/* ── Right: map ── */}
        <div className={styles.mapWrap}>
          {/* Replace the src below with your Google Maps embed URL */}
          <iframe
            className={styles.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.8!2d14.39!3d50.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b94f2!2sNa%20Plze%C5%88ce%201166%2F0%2C%20150%2000%20Praha!5e0!3m2!1sen!2scz!4v1"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location map"
          />
        </div>

      </div>
    </main>
  );
}
