// TaskCard — displays a single task with status badge, edit, and delete actions.
import Button from '../common/Button';
import './TaskCard.css';

const STATUS_CONFIG = {
  pending: { label: 'Pending', className: 'status--pending' },
  'in-progress': { label: 'In Progress', className: 'status--in-progress' },
  completed: { label: 'Completed', className: 'status--completed' },
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const statusInfo = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;

  const nextStatus = () => {
    const order = ['pending', 'in-progress', 'completed'];
    const currentIdx = order.indexOf(task.status);
    return order[(currentIdx + 1) % order.length];
  };

  return (
    <div className={`task-card ${task.status === 'completed' ? 'task-card--done' : ''}`}>
      <div className="task-card__header">
        <button
          className={`task-card__status ${statusInfo.className}`}
          onClick={() => onStatusChange(task._id, nextStatus())}
          title={`Click to change status → ${STATUS_CONFIG[nextStatus()]?.label}`}
        >
          {statusInfo.label}
        </button>
        <div className="task-card__actions">
          <Button variant="ghost" onClick={() => onEdit(task)} aria-label="Edit task">
            ✎
          </Button>
          <Button variant="ghost" onClick={() => onDelete(task._id)} aria-label="Delete task">
            ✕
          </Button>
        </div>
      </div>

      <h3 className="task-card__title">{task.title}</h3>

      {task.description && (
        <p className="task-card__desc">{task.description}</p>
      )}

      <div className="task-card__meta">
        {new Date(task.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
    </div>
  );
};

export default TaskCard;
