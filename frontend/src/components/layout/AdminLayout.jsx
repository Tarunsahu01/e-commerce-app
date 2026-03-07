/**
 * AdminLayout: Shell for admin routes — Navbar without cart, Footer.
 * Used so admin dashboard does not show cart icon or cart features.
 */
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from '../layout/AdminNavbar';
import { Footer } from './Footer';

export function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
