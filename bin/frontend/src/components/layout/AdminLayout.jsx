/**
 * AdminLayout: Shell for admin routes — Navbar without cart, Footer.
 * Used so admin dashboard does not show cart icon or cart features.
 */
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from '../layout/AdminNavbar';
import { Footer } from './Footer';
import ClickSpark from '../ClickSpark';

export function AdminLayout() {
  return (
    <ClickSpark
      sparkColor="#000000"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
      easing="ease-out"
      extraScale={1}
    >
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}
