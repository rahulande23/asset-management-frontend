import { useState, useEffect } from "react";
import API_URL from "../../api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/employee/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTasks(data.tasks || []);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const handleUpdateProgress = async (taskId, newProgress) => {
    try {
      const res = await fetch(
        `${API_URL}/employee/tasks/${taskId}/progress`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ progress: newProgress }),
        },
      );

      if (res.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, progress: newProgress } : task,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating task progress:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.progress === 100) ||
      (filterStatus === "in-progress" &&
        task.progress > 0 &&
        task.progress < 100) ||
      (filterStatus === "not-started" && task.progress === 0);
    return matchesPriority && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <>
      <section className="section-header">
        <h2>My Tasks</h2>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filter-group">
          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </section>

      {/* Tasks List */}
      <section className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">No tasks found</div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-card-header">
                <h3>{task.task}</h3>
                <span
                  className={`priority-badge ${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
              </div>
              <div className="task-card-body">
                <p className="task-deadline">
                  <strong>Deadline:</strong> {task.deadline}
                </p>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-progress">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span className="progress-percentage">
                      {task.progress}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="task-card-actions">
                <button
                  className="action-btn secondary"
                  onClick={() =>
                    handleUpdateProgress(
                      task.id,
                      Math.min(task.progress + 25, 100),
                    )
                  }
                  disabled={task.progress === 100}
                >
                  Update Progress
                </button>
                {task.progress === 100 && (
                  <span className="completed-badge">✓ Completed</span>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}

export default Tasks;
