// Loader component — a simple spinner for loading states.
import './Loader.css';

const Loader = ({ size = 'md', className = '' }) => {
  return (
    <div className={`loader-container ${className}`}>
      <div className={`loader loader--${size}`} />
    </div>
  );
};

export default Loader;
