'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '@/lib/api';
import styles from './layout.module.css';

const NAV = [
  { label: 'Dashboard',          href: '/admin' },
  { label: 'Hero Section',       href: '/admin/hero' },
  { label: 'Our Work Section',   href: '/admin/our-work' },
  { label: 'Advantages Section',    href: '/admin/advantages' },
  { label: 'About Us Section',      href: '/admin/about-us' },
  { label: 'Any Questions Section', href: '/admin/any-questions' },
  { label: 'Prices',                href: '/admin/prices' },
];

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <p className={styles.sidebarLabel}>Admin Panel</p>
        <nav className={styles.nav}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
