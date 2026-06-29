'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import styles from './page.module.css';

const API_BASE = 'http://127.0.0.1:3000';

const SECTION_EDIT_PATHS = {
  hero:        '/admin/hero',
  'our-work':  '/admin/our-work',
  advantages:      '/admin/advantages',
  'about-us':      '/admin/about-us',
  'any-questions': '/admin/any-questions',
};

export default function AdminDashboard() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchWithAuth(`${API_BASE}/homepage/admin/all`)
      .then((r) => r.json())
      .then((json) => setSections(json.data ?? []))
      .catch(() => setSections([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.sub}>Manage homepage sections</p>

      {/* Static resources */}
      <div className={styles.grid} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.key}>prices</span>
          </div>
          <p className={styles.cardTitle}>Price List</p>
          <p className={styles.cardType}>Add · Edit · Delete</p>
          <div className={styles.cardActions}>
            <Link href="/admin/prices" className={styles.editBtn}>Manage</Link>
          </div>
        </div>
      </div>

      <p className={styles.sub}>Homepage sections</p>

      {loading ? (
        <p className={styles.empty}>Loading sections…</p>
      ) : (
        <div className={styles.grid}>
          {sections.map((section) => {
            const editPath = SECTION_EDIT_PATHS[section.key];
            return (
              <div key={section.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.key}>{section.key}</span>
                  <span className={`${styles.badge} ${section.isActive ? styles.active : styles.inactive}`}>
                    {section.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className={styles.cardTitle}>{section.title || '—'}</p>
                <p className={styles.cardType}>Type: {section.type}</p>
                <div className={styles.cardActions}>
                  {editPath ? (
                    <Link href={editPath} className={styles.editBtn}>
                      Edit
                    </Link>
                  ) : (
                    <span className={styles.soonBtn}>Edit (soon)</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
