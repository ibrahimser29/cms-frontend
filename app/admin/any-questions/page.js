'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';
import styles from '../hero/page.module.css';
import localStyles from './page.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function resolveUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/uploads/${path}`;
}

export default function AnyQuestionsEditPage() {
  const router     = useRouter();
  const imgFileRef = useRef(null);

  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success,   setSuccess]   = useState('');
  const [error,     setError]     = useState('');

  const [title, setTitle] = useState('');
  const [text,  setText]  = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/homepage/any-questions`)
      .then((r) => r.json())
      .then((json) => {
        const s = json.data;
        if (!s) return;
        setTitle(s.title ?? '');
        const c = s.content ?? {};
        setText(
          c.text ?? c.description ?? c.subtitle ?? c.body
            ?? Object.values(c).find((v) => typeof v === 'string')
            ?? ''
        );
        setImage(s.images?.[0] ?? '');
      })
      .catch(() => setError('Failed to load section data.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('files', file);
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/any-questions/images`, {
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
    setSuccess('');
    try {
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/any-questions/images`, {
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
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/any-questions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: { text } }),
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
        <span>Any Questions Section</span>
      </div>

      <h1 className={styles.heading}>Edit Any Questions Section</h1>

      {error   && <div className={`${styles.banner} ${styles.bannerError}`}>{error}</div>}
      {success && <div className={`${styles.banner} ${styles.bannerSuccess}`}>{success}</div>}

      <form onSubmit={handleSave} className={styles.form}>

        {/* Content */}
        <section className={styles.card}>
          <h2 className={styles.cardHeading}>Content</h2>

          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Any Questions?"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Text</label>
            <textarea
              className={styles.input}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Descriptive text shown next to the form…"
              rows={4}
              style={{ resize: 'vertical', lineHeight: '1.6' }}
            />
          </div>
        </section>

        {/* Decorative image */}
        <section className={styles.card}>
          <h2 className={styles.cardHeading}>Decorative Image</h2>

          {image ? (
            <div className={localStyles.singleImageWrap}>
              <img src={resolveUrl(image)} alt="Section" className={localStyles.singleImage} />
              <button
                type="button"
                className={styles.deleteImg}
                onClick={handleDeleteImage}
                title="Remove image"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
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
