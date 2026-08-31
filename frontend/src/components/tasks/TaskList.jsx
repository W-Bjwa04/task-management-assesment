// TaskList — renders a grid of TaskCards or an empty state.
import TaskCard from './TaskCard';
import './TaskList.css';

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  if (!tasks.length) {
    return (
      <div className="task-list__empty">
        <div className="task-list__empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default TaskList;
