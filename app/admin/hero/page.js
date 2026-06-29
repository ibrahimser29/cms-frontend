'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';
import styles from './page.module.css';

const API_BASE = 'http://127.0.0.1:3000';

function resolveUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/uploads/${path}`;
}

async function uploadToSection(files) {
  const fd = new FormData();
  files.forEach((f) => fd.append('files', f));
  const res = await fetchWithAuth(`${API_BASE}/homepage/admin/hero/images`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }
  const json = await res.json();
  return Array.isArray(json.data?.images) ? json.data.images : [];
}

export default function HeroEditPage() {
  const router    = useRouter();
  const bgFileRef = useRef(null);
  const imgFileRef = useRef(null);

  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [bgUploading, setBgUploading] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [success,    setSuccess]    = useState('');
  const [error,      setError]      = useState('');

  const [title,      setTitle]      = useState('');
  const [subtitle,   setSubtitle]   = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl,  setButtonUrl]  = useState('');
  const [bgImage,    setBgImage]    = useState('');   // stored path/url
  const [bgPreview,  setBgPreview]  = useState('');   // display src
  const [images,     setImages]     = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/homepage/hero`)
      .then((r) => r.json())
      .then((json) => {
        const section = json.data;
        if (!section) return;
        const c = section.content ?? {};
        setTitle(c.title ?? '');
        setSubtitle(c.subtitle ?? '');
        setButtonText(c.buttonText ?? '');
        setButtonUrl(c.buttonUrl ?? '');
        setBgImage(c.backgroundImage ?? '');
        setBgPreview(c.backgroundImage ? resolveUrl(c.backgroundImage) : '');
        setImages(section.images ?? []);
      })
      .catch(() => setError('Failed to load section data.'))
      .finally(() => setLoading(false));
  }, []);

  // Background image: upload immediately on file select, store the returned URL
  async function handleBgFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    // Show local preview right away while uploading
    const localPreview = URL.createObjectURL(file);
    setBgPreview(localPreview);
    setError('');
    setBgUploading(true);
    try {
      const updatedImages = await uploadToSection([file]);
      // Find the URL that wasn't in the list before
      const newUrl = updatedImages.find((u) => !images.includes(u)) ?? updatedImages.at(-1);
      if (newUrl) {
        setBgImage(newUrl);
        setBgPreview(resolveUrl(newUrl));
        setImages(updatedImages);
      }
    } catch (err) {
      setError(err.message);
      setBgPreview(bgImage ? resolveUrl(bgImage) : '');
    } finally {
      setBgUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  }

  // Carousel images
  async function handleCarouselUpload(e) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = '';
    setError('');
    setUploading(true);
    try {
      const updatedImages = await uploadToSection(files);
      setImages(updatedImages);
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
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/hero/images`, {
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
      const res = await fetchWithAuth(`${API_BASE}/homepage/admin/hero`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { title, subtitle, buttonText, buttonUrl, backgroundImage: bgImage },
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
        <span>Hero Section</span>
      </div>

      <h1 className={styles.heading}>Edit Hero Section</h1>

      {error   && <div className={`${styles.banner} ${styles.bannerError}`}>{error}</div>}
      {success && <div className={`${styles.banner} ${styles.bannerSuccess}`}>{success}</div>}

      <form onSubmit={handleSave} className={styles.form}>
        {/* Content fields */}
        <section className={styles.card}>
          <h2 className={styles.cardHeading}>Content</h2>

          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Solid Wood Products"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Subtitle</label>
            <input
              className={styles.input}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Oak, beech, ash from 1700 CZK per m3"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Button Text</label>
              <input
                className={styles.input}
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Order"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Button URL</label>
              <input
                className={styles.input}
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="/contact"
              />
            </div>
          </div>

          {/* Background image — file upload */}
          <div className={styles.field}>
            <label className={styles.label}>Background Image</label>
            <div className={styles.fileRow}>
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => bgFileRef.current?.click()}
                disabled={bgUploading}
              >
                {bgUploading ? 'Uploading…' : 'Choose file'}
              </button>
              <span className={styles.fileName}>
                {bgUploading ? 'Uploading…' : (bgImage || 'No file chosen')}
              </span>
            </div>
            <input
              ref={bgFileRef}
              type="file"
              accept="image/*"
              className={styles.hiddenFile}
              onChange={handleBgFileSelect}
            />
            {bgPreview && (
              <div className={styles.bgPreview}>
                <img src={bgPreview} alt="Background preview" />
              </div>
            )}
          </div>
        </section>

        {/* Carousel images */}
        <section className={styles.card}>
          <div className={styles.cardHeadingRow}>
            <h2 className={styles.cardHeading}>Carousel Images</h2>
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
              onChange={handleCarouselUpload}
            />
          </div>

          {images.length === 0 ? (
            <p className={styles.noImages}>No carousel images yet.</p>
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
