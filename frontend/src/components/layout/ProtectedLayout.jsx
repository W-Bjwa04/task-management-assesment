// ProtectedLayout — wraps protected pages with Navbar and main content area.
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './ProtectedLayout.css';

const ProtectedLayout = () => {
  return (
    <div className="protected-layout">
      <Navbar />
      <main className="protected-layout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
