'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { isLoggedIn, isAdmin } from '@/lib/api';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/prices', label: 'Prices for services' },
  { href: '/about', label: 'About us' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [actionLink, setActionLink] = useState(null);

  useEffect(() => {
    if (isAdmin()) {
      setActionLink({ href: '/admin', label: 'Dashboard' });
    } else if (!isLoggedIn()) {
      setActionLink({ href: '/login', label: 'Login' });
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="BIO CWT"
            width={140}
            height={60}
            className={styles.logoImg}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${
                    pathname === link.href ? styles.navLinkActive : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {actionLink && (
              <li>
                <Link
                  href={actionLink.href}
                  className={`${styles.navAction} ${
                    pathname === actionLink.href ? styles.navActionActive : ''
                  }`}
                >
                  {actionLink.label}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <button
          type="button"
          className={`${styles.toggle} ${open ? styles.toggleOpen : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        id="mobile-menu"
        className={`${styles.mobileNav} ${open ? styles.mobileNavOpen : ''}`}
        aria-label="Mobile"
      >
        <ul className={styles.mobileNavList}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.mobileNavLink} ${
                  pathname === link.href ? styles.navLinkActive : ''
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {actionLink && (
            <li>
              <Link
                href={actionLink.href}
                className={styles.mobileNavAction}
                onClick={() => setOpen(false)}
              >
                {actionLink.label}
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
