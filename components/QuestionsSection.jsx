'use client';

import { useState } from 'react';
import styles from './QuestionsSection.module.css';

const API_BASE = 'http://127.0.0.1:3000';

function imgUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/uploads/${path}`;
}

export default function QuestionsSection({ section }) {
  const [form, setForm] = useState({ name: '', phone: '', question: '' });

  const title   = section?.title ?? 'Any Questions?';
  const content = section?.content ?? {};
  const text    = content.text
    ?? content.description
    ?? content.subtitle
    ?? content.body
    ?? Object.values(content).find((v) => typeof v === 'string')
    ?? '';
  const woodImg = imgUrl(section?.images?.[0]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up submission
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Left: form */}
        <div className={styles.left}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your telephone number"
              value={form.phone}
              onChange={handleChange}
              className={styles.input}
            />
            <textarea
              name="question"
              placeholder="Your question"
              value={form.question}
              onChange={handleChange}
              className={styles.textarea}
            />
            <button type="submit" className={styles.button}>Send</button>
          </form>
        </div>

        {/* Right: title + text + wood image */}
        <div className={styles.right}>
          <h2 className={styles.title}>{title}</h2>
          {text && <p className={styles.text}>{text}</p>}
          {woodImg && (
            <img src={woodImg} alt="" className={styles.woodImage} />
          )}
        </div>
      </div>
    </section>
  );
}
