'use client';
import "./globals.css";
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/apartments', label: 'Apartments' },
    { href: '/tenants', label: 'Tenants' },
    { href: '/tenancies', label: 'Tenancies' },
    { href: '/tenant-move-history', label: 'Move History' },
  ];

  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold mb-6">Property Manager</h1>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href} className="mb-2">
                <Link
                  href={link.href}
                  className={`block p-2 rounded ${pathname === link.href ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}