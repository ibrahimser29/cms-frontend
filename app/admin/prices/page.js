'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';
import styles from './page.module.css';
import cardStyles from '../hero/page.module.css';

const API_BASE = 'http://127.0.0.1:3000';

const EMPTY_FORM = { category: '', length: '', width: '', thickness: '', pricePerM3: '', sortOrder: '0' };

function fmt(n, d) {
  const v = parseFloat(n.toFixed(d));
  return v % 1 === 0 ? v.toString() : v.toFixed(d).replace(/0+$/, '');
}

function toInt(v) { return parseInt(v, 10) || 0; }

export default function AdminPricesPage() {
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');

  // add-form state
  const [addForm,   setAddForm]   = useState(EMPTY_FORM);
  const [adding,    setAdding]    = useState(false);
  const [showAdd,   setShowAdd]   = useState(false);

  // inline-edit state: { [id]: formValues }
  const [editMap,   setEditMap]   = useState({});
  const [saving,    setSaving]    = useState(null); // id being saved
  const [deleting,  setDeleting]  = useState(null); // id being deleted

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/price`);
      const json = await res.json();
      setItems(json.data ?? []);
    } catch {
      setError('Failed to load price items.');
    } finally {
      setLoading(false);
    }
  }

  // ── Group items by category ──
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }

  // ── Add ──
  function onAddChange(field, value) {
    setAddForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAdding(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category:   addForm.category.trim(),
          length:     toInt(addForm.length),
          width:      toInt(addForm.width),
          thickness:  toInt(addForm.thickness),
          pricePerM3: toInt(addForm.pricePerM3),
          sortOrder:  toInt(addForm.sortOrder),
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setAddForm(EMPTY_FORM);
      setShowAdd(false);
      setSuccess('Item added.');
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  // ── Edit ──
  function startEdit(item) {
    setEditMap((prev) => ({
      ...prev,
      [item.id]: {
        category:   item.category,
        length:     String(item.length),
        width:      String(item.width),
        thickness:  String(item.thickness),
        pricePerM3: String(item.pricePerM3),
        sortOrder:  String(item.sortOrder ?? 0),
      },
    }));
  }

  function cancelEdit(id) {
    setEditMap((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }

  function onEditChange(id, field, value) {
    setEditMap((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function handleSave(id) {
    setError('');
    setSuccess('');
    setSaving(id);
    const form = editMap[id];
    try {
      const res = await fetchWithAuth(`${API_BASE}/price/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category:   form.category.trim(),
          length:     toInt(form.length),
          width:      toInt(form.width),
          thickness:  toInt(form.thickness),
          pricePerM3: toInt(form.pricePerM3),
          sortOrder:  toInt(form.sortOrder),
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      cancelEdit(id);
      setSuccess('Item saved.');
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(null);
    }
  }

  // ── Delete ──
  async function handleDelete(id) {
    if (!confirm('Delete this price item?')) return;
    setError('');
    setDeleting(id);
    try {
      const res = await fetchWithAuth(`${API_BASE}/price/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSuccess('Item deleted.');
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className={cardStyles.page}>
      {/* Breadcrumb */}
      <div className={cardStyles.breadcrumb}>
        <Link href="/admin" className={cardStyles.breadLink}>Dashboard</Link>
        <span className={cardStyles.sep}>/</span>
        <span>Prices</span>
      </div>

      <div className={styles.titleRow}>
        <h1 className={cardStyles.heading}>Price List</h1>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => { setShowAdd((v) => !v); setError(''); setSuccess(''); }}
        >
          {showAdd ? 'Cancel' : '+ Add item'}
        </button>
      </div>

      {error   && <div className={`${cardStyles.banner} ${cardStyles.bannerError}`}>{error}</div>}
      {success && <div className={`${cardStyles.banner} ${cardStyles.bannerSuccess}`}>{success}</div>}

      {/* ── Add form ── */}
      {showAdd && (
        <form onSubmit={handleAdd} className={styles.addForm}>
          <h2 className={styles.addFormTitle}>New Price Item</h2>
          <div className={styles.addGrid}>
            <div className={cardStyles.field}>
              <label className={cardStyles.label}>Category</label>
              <input className={cardStyles.input} value={addForm.category} onChange={(e) => onAddChange('category', e.target.value)} placeholder="buk pr" required />
            </div>
            <div className={cardStyles.field}>
              <label className={cardStyles.label}>Length (mm)</label>
              <input className={cardStyles.input} type="number" min="1" value={addForm.length} onChange={(e) => onAddChange('length', e.target.value)} placeholder="1000" required />
            </div>
            <div className={cardStyles.field}>
              <label className={cardStyles.label}>Width (mm)</label>
              <input className={cardStyles.input} type="number" min="1" value={addForm.width} onChange={(e) => onAddChange('width', e.target.value)} placeholder="300" required />
            </div>
            <div className={cardStyles.field}>
              <label className={cardStyles.label}>Thickness (mm)</label>
              <input className={cardStyles.input} type="number" min="1" value={addForm.thickness} onChange={(e) => onAddChange('thickness', e.target.value)} placeholder="40" required />
            </div>
            <div className={cardStyles.field}>
              <label className={cardStyles.label}>Price per m³</label>
              <input className={cardStyles.input} type="number" min="0" value={addForm.pricePerM3} onChange={(e) => onAddChange('pricePerM3', e.target.value)} placeholder="38500" required />
            </div>
            <div className={cardStyles.field}>
              <label className={cardStyles.label}>Sort order</label>
              <input className={cardStyles.input} type="number" min="0" value={addForm.sortOrder} onChange={(e) => onAddChange('sortOrder', e.target.value)} />
            </div>
          </div>
          <div className={cardStyles.actions}>
            <button type="button" className={cardStyles.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className={cardStyles.saveBtn} disabled={adding}>{adding ? 'Adding…' : 'Add item'}</button>
          </div>
        </form>
      )}

      {/* ── Table ── */}
      {loading ? (
        <p className={cardStyles.loading}>Loading…</p>
      ) : items.length === 0 ? (
        <p className={styles.empty}>No price items yet. Click "+ Add item" to create one.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Délka</th>
                <th className={styles.th}>Šířka</th>
                <th className={styles.th}>Tloušťka</th>
                <th className={styles.th}>m³</th>
                <th className={styles.th}>Cena m³</th>
                <th className={`${styles.th} ${styles.thAccent}`}>Cena kc.</th>
                <th className={styles.th}>Order</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groups).map(([category, rows]) => (
                rows.map((item) => {
                  const isEditing = Boolean(editMap[item.id]);
                  const form      = editMap[item.id];
                  const m3        = (item.length * item.width * item.thickness) / 1e9;
                  const priceKc   = m3 * item.pricePerM3;

                  if (isEditing) {
                    return (
                      <tr key={item.id} className={styles.editRow}>
                        <td className={styles.td}>
                          <input className={styles.cellInput} value={form.category} onChange={(e) => onEditChange(item.id, 'category', e.target.value)} />
                        </td>
                        <td className={styles.td}>
                          <input className={styles.cellInput} type="number" value={form.length} onChange={(e) => onEditChange(item.id, 'length', e.target.value)} />
                        </td>
                        <td className={styles.td}>
                          <input className={styles.cellInput} type="number" value={form.width} onChange={(e) => onEditChange(item.id, 'width', e.target.value)} />
                        </td>
                        <td className={styles.td}>
                          <input className={styles.cellInput} type="number" value={form.thickness} onChange={(e) => onEditChange(item.id, 'thickness', e.target.value)} />
                        </td>
                        <td className={styles.td + ' ' + styles.computed}>—</td>
                        <td className={styles.td}>
                          <input className={styles.cellInput} type="number" value={form.pricePerM3} onChange={(e) => onEditChange(item.id, 'pricePerM3', e.target.value)} />
                        </td>
                        <td className={`${styles.td} ${styles.tdAccent}`}>—</td>
                        <td className={styles.td}>
                          <input className={styles.cellInput} type="number" value={form.sortOrder} onChange={(e) => onEditChange(item.id, 'sortOrder', e.target.value)} />
                        </td>
                        <td className={styles.td}>
                          <div className={styles.rowActions}>
                            <button type="button" className={styles.saveRowBtn} onClick={() => handleSave(item.id)} disabled={saving === item.id}>
                              {saving === item.id ? '…' : 'Save'}
                            </button>
                            <button type="button" className={styles.cancelRowBtn} onClick={() => cancelEdit(item.id)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={item.id} className={styles.row}>
                      <td className={`${styles.td} ${styles.categoryTd}`}>{item.category}</td>
                      <td className={styles.td}>{item.length}</td>
                      <td className={styles.td}>{item.width}</td>
                      <td className={styles.td}>{item.thickness}</td>
                      <td className={styles.td}>{fmt(m3, 4)}</td>
                      <td className={styles.td}>{item.pricePerM3}</td>
                      <td className={`${styles.td} ${styles.tdAccent}`}>{fmt(priceKc, 2)}</td>
                      <td className={styles.td}>{item.sortOrder}</td>
                      <td className={styles.td}>
                        <div className={styles.rowActions}>
                          <button type="button" className={styles.editRowBtn} onClick={() => startEdit(item)}>Edit</button>
                          <button type="button" className={styles.deleteRowBtn} onClick={() => handleDelete(item.id)} disabled={deleting === item.id}>
                            {deleting === item.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
