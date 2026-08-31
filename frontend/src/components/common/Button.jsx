// Reusable Button component with variant support.
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...rest
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    fullWidth ? 'btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
