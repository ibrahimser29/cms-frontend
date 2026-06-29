'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';
import styles from '../hero/page.module.css';
import localStyles from './page.module.css';

const API_BASE = 'http://127.0.0.1:3000';

function resolveUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/uploads/${path}`;
}

export default function AdvantagesEditPage() {
  const router    = useRouter();
  const imgFileRef = useRef(null);

  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success,   setSuccess]   = useState('');
  const [error,     setError]     = useState('');

  const [title,      setTitle]      = useState('');
  const [advantages, setAdvantages] = useState([]); // [{ text }]
  const [buttons,    setButtons]    = useState([]); // [{ label, href }]
  const [image,      setImage]      = useState('');  // images[0]

  useEffect(() => {
    fetch(`${API_BASE}/homepage/advantages`)
      .then((r) => r.json())
      .then((json) => {
        const s = json.data;
        if (!s) return;
        setTitle(s.title ?? '');
        const sorted = [...(s.content?.advantages ?? [])].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        );
        setAdvantages(sorted.map((a) => ({ text: a.text ?? '' })));
        setButtons((s.content?.buttons ?? []).map((b) => ({ label: b.label ?? '', href: b.href ?? '' })));
        setImage(s.images?.[0] ?? '');
      })
      .catch(() => setError('Failed to load section data.'))
      .finally(() => setLoading(false));
  }, []);

  // ── Advantages list helpers ──
  function addAdvantage() {
    setAdvantages((prev) => [...prev, { text: '' }]);
  }
  function removeAdvantage(i) {
    setAdvantages((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateAdvantage(i, text) {
    setAdvantages((prev) => prev.map((a, idx) => (idx === i ? { text } : a)));
  }

  // ── Buttons list helpers ──
  function addButton() {
    setButtons((prev) => [...prev, { label: '', href: '' }]);
  }
  function removeButton(i) {
    setButtons((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateButton(i, field, value) {
    setButtons((prev) =>
      prev.map((b, idx) => (idx === i ? { ...b, [field]: value } : b))
    );
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('files', file);
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/advantages/images`, {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error(`Upload failed ${res.status}`);
      const json = await res.json();
      const imgs = json.data?.images ?? [];
      setImage(imgs[imgs.length - 1] ?? image);
      setSuccess('Image uploaded.');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage() {
    if (!image) return;
    setError('');
    try {
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/advantages/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: image }),
      });
      if (!res.ok) throw new Error(`Delete failed ${res.status}`);
      setImage('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const content = {
        advantages: advantages.map((a, i) => ({ text: a.text, order: i })),
        buttons:    buttons.map((b) => ({ label: b.label, href: b.href })),
      };
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/advantages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setSuccess('Changes saved successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className={styles.loading}>Loading…</div>;

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link href="/admin" className={styles.breadLink}>Dashboard</Link>
        <span className={styles.sep}>/</span>
        <span>Advantages Section</span>
      </div>

      <h1 className={styles.heading}>Edit Advantages Section</h1>

      {error   && <div className={`${styles.banner} ${styles.bannerError}`}>{error}</div>}
      {success && <div className={`${styles.banner} ${styles.bannerSuccess}`}>{success}</div>}

      <form onSubmit={handleSave} className={styles.form}>

        {/* Title */}
        <section className={styles.card}>
          <h2 className={styles.cardHeading}>Title</h2>
          <div className={styles.field}>
            <label className={styles.label}>Section Title</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Advantages Working With Us"
            />
          </div>
        </section>

        {/* Advantages list */}
        <section className={styles.card}>
          <div className={styles.cardHeadingRow}>
            <h2 className={styles.cardHeading}>Advantages</h2>
            <button type="button" className={styles.uploadBtn} onClick={addAdvantage}>
              + Add item
            </button>
          </div>

          {advantages.length === 0 && (
            <p className={styles.noImages}>No advantages yet. Click "+ Add item".</p>
          )}

          <div className={localStyles.list}>
            {advantages.map((adv, i) => (
              <div key={i} className={localStyles.listRow}>
                <span className={localStyles.index}>{i + 1}</span>
                <input
                  className={`${styles.input} ${localStyles.listInput}`}
                  value={adv.text}
                  onChange={(e) => updateAdvantage(i, e.target.value)}
                  placeholder="Advantage text…"
                />
                <button
                  type="button"
                  className={localStyles.removeBtn}
                  onClick={() => removeAdvantage(i)}
                  title="Remove"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className={styles.card}>
          <div className={styles.cardHeadingRow}>
            <h2 className={styles.cardHeading}>Buttons</h2>
            <button type="button" className={styles.uploadBtn} onClick={addButton}>
              + Add button
            </button>
          </div>

          {buttons.length === 0 && (
            <p className={styles.noImages}>No buttons yet. Click "+ Add button".</p>
          )}

          <div className={localStyles.list}>
            {buttons.map((btn, i) => (
              <div key={i} className={localStyles.listRow}>
                <input
                  className={`${styles.input} ${localStyles.btnLabel}`}
                  value={btn.label}
                  onChange={(e) => updateButton(i, 'label', e.target.value)}
                  placeholder="Label"
                />
                <input
                  className={`${styles.input} ${localStyles.btnHref}`}
                  value={btn.href}
                  onChange={(e) => updateButton(i, 'href', e.target.value)}
                  placeholder="/contact"
                />
                <button
                  type="button"
                  className={localStyles.removeBtn}
                  onClick={() => removeButton(i)}
                  title="Remove"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Image */}
        <section className={styles.card}>
          <h2 className={styles.cardHeading}>Section Image</h2>

          {image ? (
            <div className={localStyles.singleImageWrap}>
              <img src={resolveUrl(image)} alt="Advantages" className={localStyles.singleImage} />
              <button
                type="button"
                className={styles.deleteImg}
                onClick={handleDeleteImage}
                title="Remove image"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ) : (
            <p className={styles.noImages}>No image yet.</p>
          )}

          <div style={{ marginTop: '0.75rem' }}>
            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() => imgFileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : image ? 'Replace image' : 'Upload image'}
            </button>
          </div>
          <input
            ref={imgFileRef}
            type="file"
            accept="image/*"
            className={styles.hiddenFile}
            onChange={handleImageUpload}
          />
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => router.push('/admin')}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
