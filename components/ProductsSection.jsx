import styles from './ProductsSection.module.css';

const API_BASE = 'http://127.0.0.1:3000';

function imgUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_BASE}/uploads/${path}`;
}

export default function ProductsSection({ products = [], title }) {
  const sectionTitle = title ?? 'The Wood We\nWork With';
  const displayed = products.slice(0, 3);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          {sectionTitle.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h2>

        <div className={styles.grid}>
          {displayed.map((product) => {
            const image = imgUrl(product.image);
            const features = product.features ?? [];

            return (
              <div key={product.id}>
                <div className={styles.imageWrap}>
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.placeholder}>🪵</div>
                  )}
                </div>

                <p className={styles.name}>{product.name}</p>

                {features.length > 0 && (
                  <ul className={styles.features}>
                    {features.slice(0, 5).map((f) => (
                      <li
                        key={f.id}
                        className={`${styles.feature} ${
                          f.type === 'positive' ? styles.positive : styles.negative
                        }`}
                      >
                        <i className={styles.icon}>
                          {f.type === 'positive' ? '✓' : '✗'}
                        </i>
                        {f.content}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
