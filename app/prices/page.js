import { getPrices } from '@/lib/data';
import styles from './page.module.css';

function fmt(n, decimals) {
  const v = parseFloat(n.toFixed(decimals));
  return v % 1 === 0 ? v.toString() : v.toFixed(decimals).replace(/0+$/, '');
}

export default async function PricesPage() {
  const items = await getPrices();

  // Group by category, preserving backend sort order
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  const categories = Object.entries(groups);

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>Price List</h1>

        {categories.length === 0 ? (
          <p className={styles.empty}>No price data available.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>délka</th>
                  <th className={styles.th}>šířka</th>
                  <th className={styles.th}>tloušťka</th>
                  <th className={styles.th}>m3</th>
                  <th className={styles.th}>cena m3</th>
                  <th className={`${styles.th} ${styles.thAccent}`}>cena kc.</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(([category, rows]) => (
                  <>
                    <tr key={`cat-${category}`} className={styles.categoryRow}>
                      <td colSpan={6} className={styles.categoryCell}>{category}</td>
                    </tr>
                    {rows.map((item) => {
                      const m3      = (item.length * item.width * item.thickness) / 1e9;
                      const priceKc = m3 * item.pricePerM3;
                      return (
                        <tr key={item.id} className={styles.row}>
                          <td className={styles.td}>{item.length}</td>
                          <td className={styles.td}>{item.width}</td>
                          <td className={styles.td}>{item.thickness}</td>
                          <td className={styles.td}>{fmt(m3, 4)}</td>
                          <td className={styles.td}>{item.pricePerM3}</td>
                          <td className={`${styles.td} ${styles.tdAccent}`}>{fmt(priceKc, 2)}</td>
                        </tr>
                      );
                    })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
