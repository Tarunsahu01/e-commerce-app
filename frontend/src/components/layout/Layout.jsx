/**
 * Layout: Shared shell with Navbar + Footer.
 *
 * Outlet from React Router renders child route content between header and footer.
 * Keeps Navbar/Footer consistent across all pages without prop drilling.
 */
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import ClickSpark from '../ClickSpark';

export function Layout() {
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
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}
