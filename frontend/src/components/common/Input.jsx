// Reusable Input component with label and error support.
import './Input.css';

const Input = ({
  label,
  id,
  type = 'text',
  error,
  className = '',
  ...rest
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={id} className="input-group__label">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`input-group__input ${error ? 'input-group__input--error' : ''}`}
        {...rest}
      />
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
};

export default Input;
