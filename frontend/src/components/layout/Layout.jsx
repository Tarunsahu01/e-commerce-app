/**
 * Layout: Shared shell with Navbar + Footer.
 *
 * Outlet from React Router renders child route content between header and footer.
 * Keeps Navbar/Footer consistent across all pages without prop drilling.
 */
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ChatBot } from '../chat/ChatBot';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
