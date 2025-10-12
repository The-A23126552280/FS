// src/App.jsx
// This is the View layer, handling presentation and user interactions.

import React, { useState, useEffect, useCallback } from "react";
import { apiFetchTasks } from "./model/taskModel.js";
import {
  addTask,
  updateTask,
  toggleCompletion,
  deleteTaskById,
} from "./controller/taskController.js";
// Import CSS
import "./styles/App.css";

// --- Reusable Modal Component ---
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// --- Confirmation Modal Component ---
const ConfirmationModal = ({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
  loading,
}) => {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="confirm-modal">
        <div className="icon-warning">!</div>
        <h3 className="confirm-title">Confirm Deletion</h3>
        <p className="confirm-message">
          Are you sure you want to delete the task:{" "}
          <strong>"{taskTitle}"</strong>? This action cannot be undone.
        </p>
        <div className="confirm-actions">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// --- Task Form Component (Used for Create/Update) ---
const TaskForm = ({ taskToEdit, onClose, tasks, setTasks, setLoading }) => {
  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : "");
  const [description, setDescription] = useState(
    taskToEdit ? taskToEdit.description : "",
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      await updateTask(
        tasks,
        setTasks,
        setLoading,
        taskToEdit.id,
        title,
        description,
      );
    } else {
      await addTask(tasks, setTasks, setLoading, title, description);
    }
    onClose();
  };

  return (
    <div className="task-form-container">
      <h2 className="form-title">
        {taskToEdit ? "Edit Task" : "Create New Task"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Build frontend component"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Use pure CSS for styling."
            className="form-input textarea"
            rows="3"
          ></textarea>
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={setLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={setLoading}
          >
            {taskToEdit ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Single Task Item Component ---
const TaskItem = ({
  task,
  tasks,
  setTasks,
  setLoading,
  handleEditClick,
  handleDeleteRequest,
}) => {
  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-details">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description}</p>
        <small className="task-date">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </small>
      </div>
      <div className="task-actions">
        <button
          onClick={() => toggleCompletion(tasks, setTasks, setLoading, task.id)}
          className={`btn-icon ${task.completed ? "btn-icon-unmark" : "btn-icon-complete"}`}
          title={task.completed ? "Mark Incomplete" : "Mark Complete"}
        >
          {task.completed ? "✕" : "✓"}
        </button>
        <button
          onClick={() => handleEditClick(task)}
          className="btn-icon btn-icon-edit"
          title="Edit Task"
        >
          ✎
        </button>
        <button
          onClick={() => handleDeleteRequest(task)}
          className="btn-icon btn-icon-delete"
          title="Delete Task"
        >
          🗑
        </button>
      </div>
    </div>
  );
};

// --- Main App Component (The View) ---
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // State for deletion confirmation
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // 1. Initial Load (READ)
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      const loadedTasks = await apiFetchTasks();
      setTasks(loadedTasks);
      setLoading(false);
    };
    loadTasks();
  }, []);

  // Handlers
  const handleModalClose = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (task) => {
    setTaskToDelete(task);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!taskToDelete) return;
    await deleteTaskById(tasks, setTasks, setLoading, taskToDelete.id);
    setTaskToDelete(null);
    setIsConfirmModalOpen(false);
  }, [tasks, setTasks, setLoading, taskToDelete]);

  const sortedTasks = [...tasks].sort((a, b) =>
    a.completed === b.completed
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : a.completed
        ? 1
        : -1,
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">MVC Task Manager (MERN APP)</h1>
        <p className="app-subtitle">
          Separation of Model, View, and Controller.
        </p>
      </header>

      <div className="task-list-header">
        <h2>Tasks</h2>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
          disabled={loading}
        >
          + New Task
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-indicator">
          <span>Loading...</span>
        </div>
      )}

      {/* Task List (READ) */}
      <div className="task-list">
        {!loading && tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Get organized and add one!</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              tasks={tasks}
              setTasks={setTasks}
              setLoading={setLoading}
              handleEditClick={handleEditClick}
              handleDeleteRequest={handleDeleteRequest}
            />
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <TaskForm
          taskToEdit={editingTask}
          onClose={handleModalClose}
          tasks={tasks}
          setTasks={setTasks}
          setLoading={setLoading}
        />
      </Modal>

      {/* Confirmation Modal (DELETE) */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        taskTitle={taskToDelete?.title || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setTaskToDelete(null);
          setIsConfirmModalOpen(false);
        }}
        loading={loading}
      />
    </div>
  );
};

export default App;
