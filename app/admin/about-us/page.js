'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';
import styles from '../hero/page.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function resolveUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/uploads/${path}`;
}

export default function AboutUsEditPage() {
  const router     = useRouter();
  const imgFileRef = useRef(null);

  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success,   setSuccess]   = useState('');
  const [error,     setError]     = useState('');

  const [title,       setTitle]       = useState('');
  const [company,     setCompany]     = useState('');
  const [description, setDescription] = useState('');
  const [images,      setImages]      = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/homepage/about-us`)
      .then((r) => r.json())
      .then((json) => {
        const s = json.data;
        if (!s) return;
        setTitle(s.title ?? '');
        setCompany(s.content?.company ?? '');
        setDescription(s.content?.description ?? '');
        setImages(s.images ?? []);
      })
      .catch(() => setError('Failed to load section data.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = '';
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f));
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/about-us/images`, {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error(`Upload failed ${res.status}`);
      const json = await res.json();
      setImages(Array.isArray(json.data?.images) ? json.data.images : images);
      setSuccess('Images uploaded.');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage(path) {
    setError('');
    setSuccess('');
    try {
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/about-us/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: path }),
      });
      if (!res.ok) throw new Error(`Delete failed ${res.status}`);
      setImages((prev) => prev.filter((img) => img !== path));
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
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/about-us`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: { company, description },
        }),
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
        <span>About Us Section</span>
      </div>

      <h1 className={styles.heading}>Edit About Us Section</h1>

      {error   && <div className={`${styles.banner} ${styles.bannerError}`}>{error}</div>}
      {success && <div className={`${styles.banner} ${styles.bannerSuccess}`}>{success}</div>}

      <form onSubmit={handleSave} className={styles.form}>

        {/* Content */}
        <section className={styles.card}>
          <h2 className={styles.cardHeading}>Content</h2>

          <div className={styles.field}>
            <label className={styles.label}>Section Title</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="About Us"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Company Name</label>
            <input
              className={styles.input}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name (shown in bold)"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Company description…"
              rows={5}
              style={{ resize: 'vertical', lineHeight: '1.6' }}
            />
          </div>
        </section>

        {/* Images */}
        <section className={styles.card}>
          <div className={styles.cardHeadingRow}>
            <h2 className={styles.cardHeading}>Images (up to 3 shown)</h2>
            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() => imgFileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : '+ Upload images'}
            </button>
            <input
              ref={imgFileRef}
              type="file"
              accept="image/*"
              multiple
              className={styles.hiddenFile}
              onChange={handleImageUpload}
            />
          </div>

          {images.length === 0 ? (
            <p className={styles.noImages}>No images yet.</p>
          ) : (
            <div className={styles.imageGrid}>
              {images.map((img) => (
                <div key={img} className={styles.thumb}>
                  <img src={resolveUrl(img)} alt="" />
                  <button
                    type="button"
                    className={styles.deleteImg}
                    onClick={() => handleDeleteImage(img)}
                    title="Remove"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
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
