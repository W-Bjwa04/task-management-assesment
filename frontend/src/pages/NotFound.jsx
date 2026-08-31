// NotFound page — simple 404 with link back to dashboard.
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1 className="not-found__code">404</h1>
      <h2 className="not-found__title">Page not found</h2>
      <p className="not-found__text">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFound;
