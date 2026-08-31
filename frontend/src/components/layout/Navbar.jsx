// Navbar — top navigation bar with user info and logout button.
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <svg className="navbar__logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
          </svg>
          <span className="navbar__title">TaskFlow</span>
        </div>

        {user && (
          <div className="navbar__user">
            <div className="navbar__avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="navbar__name">{user.name}</span>
            <Button variant="ghost" onClick={logout} id="logout-btn">
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
